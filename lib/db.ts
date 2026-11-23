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
  photographer_name: 'Ольга Руденкова',
  profession: 'фотограф',
  hero_kicker: 'Фотограф · Новосибирск',
  hero_subtitle:
    'Свадьбы, семьи, love story, портреты и коммерческая съёмка — в студии, на природе и с выездом. Помогаю расслабиться в кадре и забираю домой живые, тёплые фотографии.',
  about_text:
    'Привет! Я Ольга — фотограф из Новосибирска. Последние 8 лет снимаю свадьбы, семьи и личные истории так, чтобы фотографии не пылились в архивах, а радовали каждый день. Не работаю по шаблону: место, свет и настроение рождаются каждый раз заново. На съёмке я рядом как друг — спокойно, легко и с полным погружением в вашу историю.',
  stat_years: '8',
  stat_shoots: '450+',
  stat_rating: '9.9',
  phone: '+7 (913) 000-00-00',
  email: 'olga@rudenkova.photo',
  telegram: '@rudenkova_foto',
  whatsapp: '+7 (913) 000-00-00',
  vk: 'vk.com/rudenkova_foto',
  instagram: '@rudenkova.foto',
  address: 'Новосибирск, студия «Свет», ул. Ленина, 12 · выезд по городу',
  work_hours: 'Пн–Сб: 09:00–20:00\nВоскресенье: по договорённости',
  visit_zone:
    'Новосибирск и ближайшие пригороды — бесплатно. До 50 км от города — по тарифу 20 ₽/км. Область и командировки по России — по договорённости.',
};

const SEED_SERVICES: Array<[string, string, number, string, string, string]> = [
  // title, description, price, unit, duration, badge
  ['Портретная фотосессия', 'Индивидуальная съёмка в студии или на улице: образы, свет, настроение. 15 обработанных кадров в подарок.', 5000, 'за съёмку', '60 минут', 'Хит'],
  ['Семейная фотосессия', 'Прогулка или студия: родители и дети на одном кадре без суеты. 20 обработанных кадров в подарок.', 8500, 'за съёмку', '90 минут', ''],
  ['Love story', 'Лёгкая предсвадебная или годовщинная история для двоих — город, природа, интерьеры.', 7500, 'за съёмку', '60 минут', ''],
  ['Свадебная съёмка', 'Полный день: сборы, регистрация, прогулка и банкет. Быстрые превью в день свадьбы, вся съёмка — за 3–4 недели.', 65000, 'за день', '8–12 часов', 'Премиум'],
  ['Newborn и первый год', 'Нежная съёмка новорождённых дома или в студии + фотосессия «первый кубок» на годик.', 9000, 'за съёмку', 'до 2 часов', ''],
  ['Предметная съёмка', 'Каталог, маркетплейсы, соцсети: ровный свет, стекинг, чистые фоны. 30 кадров «как для журнала».', 12000, 'за съёмку', 'до 30 кадров', ''],
  ['Имиджевая съёмка для бизнеса', 'Команды, руководители, репутация компании: деловые портреты и репортаж из офиса.', 18000, 'за съёмку', 'до 1,5 часов', ''],
  ['Репортажная съёмка мероприятий', 'Конференции, презентации, открытия, концерты: живые кадры без постановки.', 7000, 'за час', 'от 2 часов', ''],
];

const SEED_CATEGORIES: Array<[string, Array<[string, string]>]> = [
  ['Свадьба', [
    ['Свадьба Даши и Артёма', '/images/portfolio/wedding-1.jpg'],
    ['Образ невесты', '/images/portfolio/wedding-2.jpg'],
  ]],
  ['Семейная', [
    ['Семейный день в парке', '/images/portfolio/family-1.jpg'],
    ['Малыш и мама', '/images/portfolio/family-2.jpg'],
  ]],
  ['Love story', [
    ['Вечерние огни города', '/images/portfolio/love-1.jpg'],
    ['Поляна над горами', '/images/portfolio/love-2.jpg'],
  ]],
  ['Портрет', [
    ['Терракотовый', '/images/portfolio/portrait-1.jpg'],
    ['Графит', '/images/portfolio/portrait-2.jpg'],
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
