import Link from 'next/link';
import { Phone, Mail, Send, MapPin, Clock } from 'lucide-react';
import Aperture from './Aperture';
import { getSettings } from '@/lib/queries';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

export default function SiteFooter() {
  const s = getSettings();
  const tg = (s.telegram || '').replace('@', '').trim();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper/75">
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 text-paper">
              <Aperture className="h-10 w-10 text-goldsoft" />
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold uppercase tracking-[0.18em]">
                  Ольга&nbsp;Курденкова
                </span>
                <span className="block font-accent italic text-goldsoft">фотограф</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Свадьбы, семьи, love story, портреты и коммерческая съёмка — в Кемерово,
              области и с выездом по России.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a href={`tel:${digitsOnly(s.phone)}`} aria-label="Позвонить" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><Phone size={17} /></a>
              <a href={`https://t.me/${tg}`} target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><Send size={17} /></a>
              <a href={`https://wa.me/${digitsOnly(s.whatsapp)}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.14 1.6 5.95L2.05 22l4.29-1.12a9.87 9.87 0 0 0 5.7 1.83h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.47.65.66-2.4-.2-.32a8.16 8.16 0 0 1-1.26-4.34c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 5.83 2.42 8.2 8.2 0 0 1 2.4 5.83c0 4.54-3.7 8.23-8.21 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.68 4.27 3.76.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z"/></svg></a>
              <a href={`mailto:${s.email}`} aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-goldsoft hover:text-goldsoft"><Mail size={17} /></a>
              {s.vk && (
                <a href={`https://${s.vk.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" aria-label="ВКонтакте" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-extrabold tracking-tight transition-colors hover:border-goldsoft hover:text-goldsoft">VK</a>
              )}
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
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldsoft">Контакты</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href={`tel:${digitsOnly(s.phone)}`} className="u-line">{s.phone}</a></li>
              <li><a href={`https://t.me/${tg}`} target="_blank" rel="noreferrer" className="u-line">{s.telegram}</a></li>
              <li><a href={`mailto:${s.email}`} className="u-line">{s.email}</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldsoft">Студия и выезд</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-goldsoft" />{s.address}</li>
              <li className="flex items-start gap-2 whitespace-pre-line"><Clock size={16} className="mt-0.5 shrink-0 text-goldsoft" />{s.work_hours}</li>
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
