'use server';

import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { getDb } from '@/lib/db';
import {
  requireAdmin,
  checkPassword,
  createSessionToken,
  loginBlockRemainingMs,
  registerLoginFail,
  resetLoginFails,
  SESSION_COOKIE,
} from '@/lib/auth';

export type LoginState = { error: string | null };

async function clientKey(): Promise<string> {
  try {
    const h = await headers();
    return (h.get('x-forwarded-for') || 'local').split(',')[0].trim();
  } catch {
    return 'local';
  }
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = await clientKey();
  const blocked = loginBlockRemainingMs(key);
  if (blocked > 0) {
    return { error: `Слишком много попыток. Подождите ${Math.ceil(blocked / 60000)} мин и попробуйте снова.` };
  }

  const password = String(formData.get('password') ?? '');
  if (!checkPassword(password)) {
    registerLoginFail(key);
    return { error: 'Неверный пароль. Попробуйте ещё раз.' };
  }

  resetLoginFails(key);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login');
}

/* ===================== Услуги ===================== */

export type SaveServiceResult = { ok: boolean; error?: string };

export async function saveServiceAction(formData: FormData): Promise<SaveServiceResult> {
  await requireAdmin();
  const idRaw = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price = Math.max(0, Math.round(Number(formData.get('price')) || 0));
  const unit = String(formData.get('unit') ?? '').trim();
  const duration = String(formData.get('duration') ?? '').trim();
  const badge = String(formData.get('badge') ?? '').trim();
  const sort = Math.round(Number(formData.get('sort')) || 0);
  const active = formData.get('active') === 'on' || formData.get('active') === '1' ? 1 : 0;

  if (title.length < 2) return { ok: false, error: 'Название услуги слишком короткое.' };
  if (!Number.isFinite(price)) return { ok: false, error: 'Укажите корректную цену.' };

  const db = getDb();
  if (idRaw) {
    const id = Number(idRaw);
    db.prepare(
      'UPDATE services SET title=?, description=?, price=?, unit=?, duration=?, badge=?, sort=?, active=? WHERE id=?'
    ).run(title, description, price, unit, duration, badge, sort, active, id);
  } else {
    const maxSort = (db.prepare('SELECT COALESCE(MAX(sort), 0) AS m FROM services').get() as { m: number }).m;
    db.prepare(
      'INSERT INTO services (title, description, price, unit, duration, badge, sort, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(title, description, price, unit, duration, badge, sort || maxSort + 1, active);
  }
  return { ok: true };
}

export async function toggleServiceAction(id: number): Promise<void> {
  await requireAdmin();
  const db = getDb();
  db.prepare('UPDATE services SET active = 1 - active WHERE id = ?').run(id);
}

export async function deleteServiceAction(id: number): Promise<void> {
  await requireAdmin();
  getDb().prepare('DELETE FROM services WHERE id = ?').run(id);
}

/* ===================== Портфолио: категории ===================== */

export async function saveCategoryAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const idRaw = String(formData.get('id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  if (name.length < 2) return { ok: false, error: 'Название категории слишком короткое.' };

  const db = getDb();
  if (idRaw) {
    db.prepare('UPDATE portfolio_categories SET name = ? WHERE id = ?').run(name, Number(idRaw));
  } else {
    const maxSort = (db.prepare('SELECT COALESCE(MAX(sort), 0) AS m FROM portfolio_categories').get() as { m: number }).m;
    db.prepare('INSERT INTO portfolio_categories (name, sort) VALUES (?, ?)').run(name, maxSort + 1);
  }
  return { ok: true };
}

export async function deleteCategoryAction(id: number): Promise<void> {
  await requireAdmin();
  const db = getDb();
  // Удаляем файлы загруженных фото этой категории
  const items = db
    .prepare("SELECT image_path FROM portfolio_items WHERE category_id = ? AND image_path LIKE '/files/%'")
    .all(id) as Array<{ image_path: string }>;
  for (const item of items) unlinkUpload(item.image_path);
  db.prepare('DELETE FROM portfolio_items WHERE category_id = ?').run(id);
  db.prepare('DELETE FROM portfolio_categories WHERE id = ?').run(id);
}

/* ===================== Портфолио: фотографии ===================== */

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function hasMagicBytes(buf: Buffer, mime: string): boolean {
  if (mime === 'image/jpeg') return buf.length > 2 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (mime === 'image/png')
    return buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (mime === 'image/webp')
    return (
      buf.length > 12 &&
      buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP'
    );
  return false;
}

function unlinkUpload(publicPath: string) {
  const name = publicPath.replace(/^\/files\//, '');
  if (!/^[A-Za-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(name)) return;
  try {
    fs.unlinkSync(path.join(UPLOAD_DIR, name));
  } catch {
    /* файла нет — не страшно */
  }
}

export type UploadResult = { ok: boolean; error?: string; uploaded?: number };

export async function uploadPhotosAction(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const categoryId = Number(formData.get('category_id'));
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return { ok: false, error: 'Выберите категорию для фотографий.' };
  }
  const db = getDb();
  const category = db.prepare('SELECT id FROM portfolio_categories WHERE id = ?').get(categoryId);
  if (!category) return { ok: false, error: 'Категория не найдена.' };

  const files = formData.getAll('photos').filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f);
  if (files.length === 0) return { ok: false, error: 'Выберите хотя бы один файл.' };

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  let sort = (db.prepare('SELECT COALESCE(MAX(sort), 0) AS m FROM portfolio_items WHERE category_id = ?').get(categoryId) as { m: number }).m;
  let uploaded = 0;

  for (const file of files) {
    const mime = file.type;
    const ext = EXT_BY_MIME[mime];
    if (!ext) continue; // пропускаем не-изображения
    if (file.size > MAX_UPLOAD_BYTES) continue; // пропускаем слишком большие
    const buf = Buffer.from(await file.arrayBuffer());
    if (!hasMagicBytes(buf, mime)) continue;

    const name = crypto.randomUUID() + ext;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
    sort += 1;
    db.prepare(
      "INSERT INTO portfolio_items (category_id, title, image_path, sort, created_at) VALUES (?, '', ?, ?, ?)"
    ).run(categoryId, `/files/${name}`, sort, new Date().toISOString());
    uploaded += 1;
  }

  if (uploaded === 0) {
    return { ok: false, error: 'Не удалось загрузить файлы: только JPG, PNG, WebP до 12 МБ.' };
  }
  return { ok: true, uploaded };
}

export async function movePhotoAction(id: number, categoryId: number): Promise<void> {
  await requireAdmin();
  getDb().prepare('UPDATE portfolio_items SET category_id = ? WHERE id = ?').run(categoryId, id);
}

export async function deletePhotoAction(id: number): Promise<void> {
  await requireAdmin();
  const db = getDb();
  const row = db.prepare('SELECT image_path FROM portfolio_items WHERE id = ?').get(id) as { image_path: string } | undefined;
  if (row) unlinkUpload(row.image_path);
  db.prepare('DELETE FROM portfolio_items WHERE id = ?').run(id);
}

/* ===================== Заявки ===================== */

const VALID_STATUS = new Set(['new', 'in_progress', 'done']);

export async function setRequestStatusAction(id: number, status: string): Promise<void> {
  await requireAdmin();
  if (!VALID_STATUS.has(status)) return;
  getDb().prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, id);
}

export async function deleteRequestAction(id: number): Promise<void> {
  await requireAdmin();
  getDb().prepare('DELETE FROM requests WHERE id = ?').run(id);
}

/* ===================== Настройки сайта ===================== */

const SETTINGS_KEYS = [
  'photographer_name',
  'profession',
  'hero_kicker',
  'hero_subtitle',
  'about_text',
  'phone',
  'email',
  'telegram',
  'whatsapp',
  'vk',
  'instagram',
  'address',
  'work_hours',
  'visit_zone',
] as const;

export async function saveSettingsAction(formData: FormData): Promise<{ ok: boolean }> {
  await requireAdmin();
  const db = getDb();
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const key of SETTINGS_KEYS) {
    const value = String(formData.get(key) ?? '').trim();
    upsert.run(key, value);
  }
  return { ok: true };
}
