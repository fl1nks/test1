'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Clock,
  Tag,
  BadgePercent,
  ListOrdered,
  Banknote,
} from 'lucide-react';
import type { Service } from '@/lib/queries';
import { formatPrice } from '@/lib/format';
import { saveServiceAction, deleteServiceAction, toggleServiceAction } from '@/app/admin/actions';

export default function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Service | 'new' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEditing(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = editing ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [editing]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const result = await saveServiceAction(form);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? 'Не удалось сохранить услугу.');
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Удалить услугу «${service.title}»? Это действие нельзя отменить.`)) return;
    await deleteServiceAction(service.id);
    router.refresh();
  }

  async function handleToggle(service: Service) {
    await toggleServiceAction(service.id);
    router.refresh();
  }

  const editingService = editing && editing !== 'new' ? editing : null;

  return (
    <>
      {/* Шапка + кнопка добавления */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-mute">
          Всего услуг: <b className="text-ink">{services.length}</b>. Изменения сразу видны на сайте.
        </p>
        <button onClick={() => { setError(null); setEditing('new'); }} className="btn-ink !py-2.5 text-[13px]">
          <Plus size={16} />
          Добавить услугу
        </button>
      </div>

      {/* Список */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
        {services.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-display text-xl font-bold">Услуг пока нет</p>
            <p className="mt-1 text-sm text-mute">Нажмите «Добавить услугу», чтобы создать первую.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/[0.08]">
            {services.map((service) => (
              <li key={service.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-sand/30 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
                <span className="hidden w-10 shrink-0 font-display text-2xl font-black text-sandline sm:block">
                  {service.sort}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-bold leading-snug">{service.title}</p>
                    {service.badge && (
                      <span className="rounded-full bg-gold/[0.12] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-golddeep">
                        {service.badge}
                      </span>
                    )}
                    {service.active !== 1 && (
                      <span className="rounded-full bg-ink/[0.08] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-mute">
                        Скрыта
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-mute">{service.description}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
                    <Clock size={11} /> {service.duration || '—'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="font-display text-xl font-extrabold">{formatPrice(service.price)}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-mute">{service.unit || 'за съёмку'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggle(service)}
                      className="icon-btn"
                      title={service.active === 1 ? 'Скрыть с сайта' : 'Показать на сайте'}
                      aria-label={service.active === 1 ? 'Скрыть с сайта' : 'Показать на сайте'}
                    >
                      {service.active === 1 ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                    <button onClick={() => { setError(null); setEditing(service); }} className="icon-btn" aria-label="Редактировать">
                      <Pencil size={17} />
                    </button>
                    <button onClick={() => handleDelete(service)} className="icon-btn hover:!border-red-800/40 hover:!text-red-800" aria-label="Удалить">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальная форма */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setEditing(null)} aria-label="Закрыть" />
          <form
            onSubmit={handleSubmit}
            className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-paper p-6 shadow-soft sm:rounded-3xl sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">
                {editingService ? 'Редактировать услугу' : 'Новая услуга'}
              </h2>
              <button type="button" onClick={() => setEditing(null)} className="icon-btn" aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>

            <input type="hidden" name="id" defaultValue={editingService?.id ?? ''} />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="title">Название *</label>
                <input id="title" name="title" required minLength={2} defaultValue={editingService?.title ?? ''} placeholder="Например: Семейная фотосессия" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="description">Описание</label>
                <textarea id="description" name="description" defaultValue={editingService?.description ?? ''} placeholder="Что входит, сколько кадров, где проходит…" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="price">Цена, ₽ *</label>
                <div className="relative">
                  <Banknote size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input id="price" name="price" type="number" min={0} step={100} required defaultValue={editingService?.price ?? ''} placeholder="8500" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="unit">За что цена</label>
                <div className="relative">
                  <Tag size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input id="unit" name="unit" defaultValue={editingService?.unit ?? ''} placeholder="за съёмку / за час / за день" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="duration">Длительность</label>
                <div className="relative">
                  <Clock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input id="duration" name="duration" defaultValue={editingService?.duration ?? ''} placeholder="90 минут" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="badge">Бейдж (необязательно)</label>
                <div className="relative">
                  <BadgePercent size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input id="badge" name="badge" defaultValue={editingService?.badge ?? ''} placeholder="Хит / Премиум / Новинка" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="sort">Порядок в списке</label>
                <div className="relative">
                  <ListOrdered size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input id="sort" name="sort" type="number" min={0} defaultValue={editingService?.sort ?? 0} className="input !pl-11" />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-ink/10 px-4 py-3">
                <input type="checkbox" name="active" defaultChecked={editingService ? editingService.active === 1 : true} className="h-5 w-5 accent-[#A8845C]" />
                <span className="text-sm font-semibold">Показывать на сайте</span>
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !py-3 text-[13px]">Отмена</button>
              <button type="submit" disabled={busy} className="btn-gold !py-3 text-[13px]">
                {busy ? 'Сохраняю…' : 'Сохранить услугу'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
