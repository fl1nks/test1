import { getDb } from './db';

/** node:sqlite возвращает объекты с null-прототипом — делаем их plain objects для передачи в Client Components */
function plain<T>(rows: T[]): T[] {
  return rows.map((r) => ({ ...(r as Record<string, unknown>) })) as T[];
}
function plainOne<T>(row: T): T {
  return ({ ...(row as Record<string, unknown>) }) as T;
}

export type Service = {
  id: number;
  title: string;
  description: string;
  price: number;
  unit: string;
  duration: string;
  badge: string;
  sort: number;
  active: number;
};

export type PortfolioCategory = { id: number; name: string; sort: number };
export type PortfolioItem = {
  id: number;
  category_id: number;
  category_name: string;
  title: string;
  image_path: string;
  sort: number;
  created_at: string;
};

export type Request = {
  id: number;
  name: string;
  contact: string;
  service_id: number | null;
  service_title: string;
  comment: string;
  status: 'new' | 'in_progress' | 'done';
  created_at: string;
};

export function getSettings(): Record<string, string> {
  const db = getDb();
  const rows = plain(db.prepare('SELECT key, value FROM settings').all() as unknown as Array<{ key: string; value: string }>);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export function getServices(opts: { activeOnly?: boolean } = {}): Service[] {
  const db = getDb();
  const where = opts.activeOnly ? 'WHERE active = 1' : '';
  return plain(
    db.prepare(`SELECT * FROM services ${where} ORDER BY sort ASC, id ASC`).all() as unknown as Service[]
  );
}

export function getServiceById(id: number): Service | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM services WHERE id = ?').get(id) as unknown as Service | undefined;
  return row ? plainOne(row) : null;
}

export function getCategories(): PortfolioCategory[] {
  const db = getDb();
  return plain(
    db.prepare('SELECT * FROM portfolio_categories ORDER BY sort ASC, id ASC').all() as unknown as PortfolioCategory[]
  );
}

export function getPortfolio(categoryId?: number | null): PortfolioItem[] {
  const db = getDb();
  const base = `
    SELECT i.*, c.name AS category_name
    FROM portfolio_items i
    JOIN portfolio_categories c ON c.id = i.category_id
  `;
  if (categoryId) {
    return plain(
      db.prepare(`${base} WHERE i.category_id = ? ORDER BY i.sort ASC, i.id ASC`).all(categoryId) as unknown as PortfolioItem[]
    );
  }
  return plain(
    db.prepare(`${base} ORDER BY i.sort ASC, i.id ASC`).all() as unknown as PortfolioItem[]
  );
}

export function getRequests(): Request[] {
  const db = getDb();
  return plain(
    db.prepare('SELECT * FROM requests ORDER BY id DESC').all() as unknown as Request[]
  );
}

export function countByStatus() {
  const db = getDb();
  const rows = db.prepare('SELECT status, COUNT(*) AS n FROM requests GROUP BY status').all() as Array<{ status: string; n: number }>;
  const out = { all: 0, new: 0, in_progress: 0, done: 0 };
  for (const r of rows) {
    out.all += r.n;
    if (r.status === 'new') out.new = r.n;
    else if (r.status === 'in_progress') out.in_progress = r.n;
    else if (r.status === 'done') out.done = r.n;
  }
  return out;
}

export function dashboardStats() {
  const db = getDb();
  const one = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  return {
    requests: one('SELECT COUNT(*) AS n FROM requests'),
    newRequests: one("SELECT COUNT(*) AS n FROM requests WHERE status = 'new'"),
    services: one('SELECT COUNT(*) AS n FROM services'),
    photos: one('SELECT COUNT(*) AS n FROM portfolio_items'),
  };
}


