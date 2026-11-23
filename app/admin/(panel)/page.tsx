import Link from 'next/link';
import {
  Inbox,
  Sparkles,
  Briefcase,
  Images,
  ArrowRight,
  Plus,
  Upload,
  Phone,
} from 'lucide-react';
import { dashboardStats, getRequests } from '@/lib/queries';
import { formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = dashboardStats();
  const recent = getRequests().slice(0, 5);

  const cards = [
    { label: 'Новые заявки', value: stats.newRequests, icon: Sparkles, accent: true, hint: 'требуют ответа' },
    { label: 'Всего заявок', value: stats.requests, icon: Inbox, accent: false, hint: 'за всё время' },
    { label: 'Услуги на сайте', value: stats.services, icon: Briefcase, accent: false, hint: 'активных и скрытых' },
    { label: 'Фото в портфолио', value: stats.photos, icon: Images, accent: false, hint: 'во всех категориях' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-golddeep">Панель управления</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Здравствуйте!</h1>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-ghost !py-2.5 text-[13px]">
          Открыть сайт
          <ArrowRight size={15} />
        </a>
      </div>

      {/* Статистика */}
      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border p-5 shadow-card ${
                card.accent ? 'border-gold/50 bg-gold/10' : 'border-ink/10 bg-white'
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  card.accent ? 'bg-gold text-ink' : 'bg-ink text-goldsoft'
                }`}
              >
                <Icon size={19} />
              </span>
              <p className="mt-4 font-display text-4xl font-black leading-none">{card.value}</p>
              <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/80">{card.label}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-mute">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Последние заявки */}
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-4">
            <h2 className="font-display text-xl font-bold">Последние заявки</h2>
            <Link href="/admin/requests" className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-golddeep hover:text-gold">
              Все заявки
              <ArrowRight size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Inbox className="mx-auto mb-3 text-sandline" size={40} />
              <p className="font-display text-lg font-bold">Заявок пока нет</p>
              <p className="mt-1 text-sm text-mute">Они появятся здесь, как только кто-нибудь заполнит форму на сайте.</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink/[0.08]">
              {recent.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <span
                    className={`st ${
                      r.status === 'new' ? 'st-new' : r.status === 'in_progress' ? 'st-in_progress' : 'st-done'
                    }`}
                  >
                    {r.status === 'new' ? 'Новая' : r.status === 'in_progress' ? 'В работе' : 'Закрыта'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{r.name}</p>
                    <p className="truncate text-xs text-mute">{r.service_title}</p>
                  </div>
                  <div className="text-right">
                    <a href={`tel:${r.contact.replace(/\D/g, '')}`} className="flex items-center gap-1 text-xs font-semibold text-ink/80 hover:text-golddeep">
                      <Phone size={12} />{r.contact}
                    </a>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-mute">{formatDateTime(r.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-bold">Быстрые действия</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link href="/admin/services" className="btn-ink justify-start !py-3 text-[13px]">
                <Plus size={16} /> Добавить или изменить услугу
              </Link>
              <Link href="/admin/portfolio" className="btn-ink justify-start !py-3 text-[13px]">
                <Upload size={16} /> Загрузить фото в портфолио
              </Link>
              <Link href="/admin/settings" className="btn-ink justify-start !py-3 text-[13px]">
                <Sparkles size={16} /> Изменить контакты и тексты
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">Подсказка</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              Все изменения на сайте появляются сразу после сохранения. Фото лучше загружать
              в формате JPG — быстро и качественно.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
