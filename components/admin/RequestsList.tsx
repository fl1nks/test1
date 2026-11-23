'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Inbox, Phone, Clock, CheckCheck, Loader } from 'lucide-react';
import type { Request } from '@/lib/queries';
import { formatDateTime } from '@/lib/format';
import { setRequestStatusAction, deleteRequestAction } from '@/app/admin/actions';

type Filter = 'all' | 'new' | 'in_progress' | 'done';

const TABS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'done', label: 'Закрытые' },
];

const STATUS_META = {
  new: { label: 'Новая', cls: 'st-new' },
  in_progress: { label: 'В работе', cls: 'st-in_progress' },
  done: { label: 'Закрыта', cls: 'st-done' },
} as const;

export default function RequestsList({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [pendingId, setPendingId] = useState<number | null>(null);

  const counts = {
    all: requests.length,
    new: requests.filter((r) => r.status === 'new').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    done: requests.filter((r) => r.status === 'done').length,
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  async function setStatus(id: number, status: string) {
    setPendingId(id);
    await setRequestStatusAction(id, status);
    setPendingId(null);
    router.refresh();
  }

  async function remove(id: number) {
    if (!window.confirm('Удалить заявку? Это действие нельзя отменить.')) return;
    await deleteRequestAction(id);
    router.refresh();
  }

  return (
    <div>
      {/* Табы-фильтры */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-all ${
              filter === tab.key
                ? 'bg-ink text-paper shadow-card'
                : 'border border-ink/[0.12] bg-white text-mute hover:border-gold hover:text-golddeep'
            }`}
          >
            {tab.label} · {counts[tab.key]}
          </button>
        ))}
      </div>

      {/* Список */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/20 px-6 py-16 text-center">
          <Inbox className="mx-auto mb-3 text-sandline" size={40} />
          <p className="font-display text-xl font-bold">Здесь пусто</p>
          <p className="mt-1 text-sm text-mute">В этой группе пока нет заявок.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {filtered.map((req) => {
            const meta = STATUS_META[req.status] ?? STATUS_META.new;
            const tel = req.contact.replace(/\D/g, '');
            const isTel = /^[+()\-\d\s]+$/.test(req.contact.trim()) && tel.length >= 10;
            return (
              <li key={req.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
                <div className="flex flex-wrap items-center gap-3 border-b border-ink/[0.08] px-5 py-3.5 sm:px-6">
                  <span className={`st ${meta.cls}`}>{meta.label}</span>
                  <p className="font-display text-lg font-bold">{req.name}</p>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-mute">
                    <Clock size={12} />
                    {formatDateTime(req.created_at)}
                  </span>
                </div>
                <div className="px-5 py-4 sm:px-6">
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-mute">Связь</dt>
                      <dd className="mt-0.5">
                        {isTel ? (
                          <a href={`tel:${tel}`} className="inline-flex items-center gap-1.5 font-semibold text-golddeep hover:underline">
                            <Phone size={13} /> {req.contact}
                          </a>
                        ) : (
                          <a href={`https://t.me/${req.contact.replace('@', '').trim()}`} target="_blank" rel="noreferrer" className="font-semibold text-golddeep hover:underline">
                            {req.contact}
                          </a>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-mute">Услуга</dt>
                      <dd className="mt-0.5 font-semibold">{req.service_title}</dd>
                    </div>
                  </dl>
                  {req.comment && (
                    <div className="mt-3 rounded-xl bg-sand/50 px-4 py-3 text-sm leading-relaxed text-ink/90">
                      {req.comment}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Смена статуса */}
                    <div className="flex items-center gap-1.5" role="group" aria-label="Статус заявки">
                      {pendingId === req.id && <Loader size={15} className="animate-spin text-mute" />}
                      {(['new', 'in_progress', 'done'] as const).map((st) => {
                        const active = req.status === st;
                        const label = st === 'new' ? 'Новая' : st === 'in_progress' ? 'В работе' : 'Закрыта';
                        return (
                          <button
                            key={st}
                            disabled={active || pendingId === req.id}
                            onClick={() => setStatus(req.id, st)}
                            aria-pressed={active}
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all ${
                              active
                                ? st === 'new'
                                  ? 'bg-gold text-ink'
                                  : st === 'in_progress'
                                    ? 'bg-sky-700 text-white'
                                    : 'bg-emerald-700 text-white'
                                : 'border border-ink/[0.12] text-mute hover:border-gold hover:text-golddeep'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      {req.status !== 'done' && (
                        <button
                          onClick={() => setStatus(req.id, 'done')}
                          className="icon-btn hover:!border-emerald-800/40 hover:!text-emerald-800"
                          title="Отметить закрытой"
                          aria-label="Отметить закрытой"
                        >
                          <CheckCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(req.id)}
                        className="icon-btn hover:!border-red-800/40 hover:!text-red-800"
                        title="Удалить заявку"
                        aria-label="Удалить заявку"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
