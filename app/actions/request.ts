'use server';

import { getDb } from '@/lib/db';
import { getServiceById } from '@/lib/queries';

export type RequestFormState = {
  ok: boolean;
  error?: string;
};

export async function submitRequest(
  _prev: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  // Ловим простых ботов
  const honeypot = String(formData.get('website') ?? '').trim();
  if (honeypot) return { ok: true };

  const name = String(formData.get('name') ?? '').trim();
  const contact = String(formData.get('contact') ?? '').trim();
  const serviceRaw = String(formData.get('service_id') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();

  if (name.length < 2) return { ok: false, error: 'Пожалуйста, представьтесь (имя от 2 символов).' };
  if (contact.length < 5) return { ok: false, error: 'Укажите телефон или Telegram — я свяжусь и всё обсужу.' };
  if (name.length > 120 || contact.length > 200 || comment.length > 2000) {
    return { ok: false, error: 'Слишком длинные значения в форме.' };
  }

  let serviceId: number | null = null;
  let serviceTitle = 'Консультация — нужна помощь с выбором';
  if (serviceRaw) {
    const id = Number(serviceRaw);
    if (Number.isInteger(id) && id > 0) {
      const svc = getServiceById(id);
      if (svc) {
        serviceId = svc.id;
        serviceTitle = svc.title;
      }
    }
  }

  const db = getDb();
  db.prepare(
    "INSERT INTO requests (name, contact, service_id, service_title, comment, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
  ).run(name, contact, serviceId, serviceTitle, comment, new Date().toISOString());

  return { ok: true };
}
