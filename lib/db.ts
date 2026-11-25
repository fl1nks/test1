import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'site.db');

declare global {
  // eslint-disable-next-line no-var
  var __photoDb: DatabaseSync | undefined;
}

export function getDb(): DatabaseSync {
  if (globalThis.__photoDb) return globalThis.__photoDb;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  try { db.exec('PRAGMA journal_mode = WAL'); } catch { /* не критично */ }
  try { db.exec('PRAGMA foreign_keys = ON'); } catch { /* не критично */ }
  migrate(db);
  seed(db);
  globalThis.__photoDb = db;
  return db;
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      sort INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS portfolio_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sort INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS portfolio_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES portfolio_categories(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT '',
      image_path TEXT NOT NULL,
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      service_id INTEGER,
      service_title TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
    CREATE INDEX IF NOT EXISTS idx_items_category ON portfolio_items(category_id);
  `);
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  photographer_name: 'Ольга Курденкова',
  profession: 'фотограф',
  hero_kicker: 'Фотограф · Кемерово',
  hero_subtitle:
    'Индивидуальная, семейная и детская съёмка, беременность, дни рождения и мероприятия. Съёмки в красивых фотостудиях Кемерово и на локациях — студия подбирается под вашу идею, вам ничего искать не нужно.',
  email: 'olgakurden@gmail.com',
  telegram: '@kurden_phh',
  vk: 'vk.ru/sonsoday',
  instagram: '',
  visit_zone:
    'Съёмки проходят в красивых фотостудиях Кемерово (аренда включена в пакет «Под ключ») и на локациях. Выезд за пределы города возможен — его стоимость обговаривается индивидуально: напишите мне, и мы всё обсудим.',
};

const SEED_SERVICES: Array<[string, string, number, string, string, string]> = [
  // title, description, price, unit, duration, badge
  ['Студия «Под ключ» — 30 минут', 'Фотосессия в красивой фотостудии Кемерово: работа фотографа и аренда студии уже включены. 20–25 фотографий в авторской обработке + ч/б версии.', 4000, 'за съёмку', '30 минут', 'Под ключ'],
  ['Студия «Под ключ» — 1 час', 'Полноценная студийная съёмка в любой красивой фотостудии Кемерово: консультация, образы, 40–50 фотографий в обработке + ч/б версии.', 5500, 'за съёмку', '1 час', 'Под ключ'],
  ['Событийная съёмка — 30 минут', 'Дни рождения, свадьбы, росписи, мероприятия: 20–25 кадров в обработке. Выезд в пределах Кемерово, выезд за город — по договорённости.', 2500, 'за съёмку', '30 минут', 'Выезд'],
  ['Событийная съёмка — 1 час', 'Дни рождения, свадьбы, росписи, мероприятия: 40–50 кадров в обработке + ч/б версии. Выезд в пределах Кемерово, выезд за город — по договорённости.', 3500, 'за съёмку', '1 час', 'Выезд'],
];

const SEED_CATEGORIES: Array<[string, Array<[string, string]>]> = [
  ['Семейная и детская', [
    ['Семейный день в парке', '/images/portfolio/family-1.jpg'],
    ['Малыш и мама', '/images/portfolio/family-2.jpg'],
    ['Студия, бежевый', '/images/portfolio/family-3.jpg'],
  ]],
  ['Беременность', [
    ['У окна', '/images/portfolio/maternity-1.jpg'],
    ['Вдвоём', '/images/portfolio/maternity-2.jpg'],
  ]],
  ['Индивидуальная', [
    ['Терракотовый', '/images/portfolio/portrait-1.jpg'],
    ['Графит', '/images/portfolio/portrait-2.jpg'],
  ]],
  ['День рождения и события', [
    ['С двенадцатилетием', '/images/portfolio/birthday-1.jpg'],
  ]],
  ['Love story и свадьбы', [
    ['Свадьба Даши и Артёма', '/images/portfolio/wedding-1.jpg'],
    ['Образ невесты', '/images/portfolio/wedding-2.jpg'],
    ['Вечерние огни города', '/images/portfolio/love-1.jpg'],
    ['Поляна над горами', '/images/portfolio/love-2.jpg'],
  ]],
];

function seed(db: DatabaseSync) {
  // settings: INSERT OR IGNORE, чтобы не затирать правки из админки
  const insSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) insSetting.run(k, v);

  const servicesCount = (db.prepare('SELECT COUNT(*) AS n FROM services').get() as { n: number }).n;
  if (servicesCount === 0) {
    const ins = db.prepare(
      'INSERT INTO services (title, description, price, unit, duration, badge, sort, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
    );
    SEED_SERVICES.forEach(([t, d, p, u, dur, b], i) => ins.run(t, d, p, u, dur, b, i + 1));
  }

  const categoriesCount = (db.prepare('SELECT COUNT(*) AS n FROM portfolio_categories').get() as { n: number }).n;
  if (categoriesCount === 0) {
    const insCat = db.prepare('INSERT INTO portfolio_categories (name, sort) VALUES (?, ?)');
    const insItem = db.prepare(
      "INSERT INTO portfolio_items (category_id, title, image_path, sort, created_at) VALUES (?, ?, ?, ?, ?)"
    );
    const now = new Date().toISOString();
    SEED_CATEGORIES.forEach(([cat, items], i) => {
      const res = insCat.run(cat, i + 1);
      const catId = Number(res.lastInsertRowid);
      items.forEach(([title, img], j) => insItem.run(catId, title, img, j + 1, now));
    });
  }
}
