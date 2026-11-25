import Link from 'next/link';
import { Mail, Send, BadgeCheck, CalendarCheck, MapPinned } from 'lucide-react';
import LogoMark from './LogoMark';
import { getSettings } from '@/lib/queries';

export default function SiteFooter() {
  const s = getSettings();
  const tg = (s.telegram || '').replace('@', '').trim();
  const vk = (s.vk || '').replace(/^https?:\/\//, '');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper/75">
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 text-paper">
              <LogoMark className="h-12 w-12" rounded="rounded-2xl" />
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold uppercase tracking-[0.18em]">
                  Ольга&nbsp;Курденкова
                </span>
                <span className="block font-accent italic text-goldsoft">фотограф</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Индивидуальная, семейная и детская съёмка, беременность, дни рождения и мероприятия —
              в фотостудиях Кемерово и на локациях.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a href={`https://t.me/${tg}`} target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><Send size={17} /></a>
              <a href={`https://vk.ru/${vk.split('/').pop()}`} target="_blank" rel="noreferrer" aria-label="ВКонтакте" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-extrabold tracking-tight transition-colors hover:border-goldsoft hover:text-goldsoft">VK</a>
              <a href={`mailto:${s.email}`} aria-label="Почта" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><Mail size={17} /></a>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldsoft">Разделы</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="u-line">Главная</Link></li>
              <li><Link href="/uslugi" className="u-line">Услуги</Link></li>
              <li><Link href="/portfolio" className="u-line">Портфолио</Link></li>
              <li><Link href="/contacts" className="u-line">Контакты</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldsoft">Связь</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href={`https://t.me/${tg}`} target="_blank" rel="noreferrer" className="u-line">{s.telegram}</a></li>
              <li><a href={s.vk?.startsWith('http') ? s.vk : `https://vk.ru/${vk}`} target="_blank" rel="noreferrer" className="u-line">{vk}</a></li>
              <li><a href={`mailto:${s.email}`} className="u-line">{s.email}</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldsoft">Запись на съёмку</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-start gap-2"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-goldsoft" />Предоплата 1 000 ₽, фиксируем дату и бронируем студию</li>
              <li className="flex items-start gap-2"><CalendarCheck size={16} className="mt-0.5 shrink-0 text-goldsoft" />Готовность фотографий — до 7 дней</li>
              <li className="flex items-start gap-2"><MapPinned size={16} className="mt-0.5 shrink-0 text-goldsoft" />Съёмки в студиях Кемерово и на локациях; выезд за город — по договорённости</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-paper/50 sm:flex-row">
          <p>© {year} Ольга Курденкова · Фотограф, Кемерово</p>
          <p>Каждое фото — живая история, а не постановочный кадр.</p>
        </div>
      </div>
    </footer>
  );
}
