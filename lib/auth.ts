import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'kurdenkova_admin';
const SESSION_TTL_SEC = 60 * 60 * 24 * 14; // 14 дней

function secret(): string {
  return process.env.SESSION_SECRET || 'dev-only-secret-change-in-production';
}

export function adminPassword(): string {
  // Пароль по умолчанию — смените его через переменную окружения ADMIN_PASSWORD
  return process.env.ADMIN_PASSWORD || 'olga2026';
}

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const b64urlJson = (obj: unknown) => b64url(JSON.stringify(obj));

function sign(data: string): string {
  return b64url(crypto.createHmac('sha256', secret()).update(data).digest());
}

export function createSessionToken(): string {
  const payload = b64urlJson({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC });
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) as { sub?: string; exp?: number };
    if (parsed.sub !== 'admin' || typeof parsed.exp !== 'number') return false;
    return parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function checkPassword(candidate: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(adminPassword());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Для серверных экшенов: бросает ошибку, если нет сессии */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) throw new Error('Нет доступа');
}

/* ---------- Простой анти-брутфорс на логин (в памяти процесса) ---------- */
const attempts = new Map<string, { fails: number; blockedUntil: number }>();
const MAX_FAILS = 5;
const BLOCK_MS = 5 * 60 * 1000;

export function loginBlockRemainingMs(key: string): number {
  const rec = attempts.get(key);
  if (!rec) return 0;
  if (rec.blockedUntil > Date.now()) return rec.blockedUntil - Date.now();
  return 0;
}

export function registerLoginFail(key: string) {
  const rec = attempts.get(key) ?? { fails: 0, blockedUntil: 0 };
  rec.fails += 1;
  if (rec.fails >= MAX_FAILS) rec.blockedUntil = Date.now() + BLOCK_MS;
  attempts.set(key, rec);
}

export function resetLoginFails(key: string) {
  attempts.delete(key);
}
