import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Phone,
  Mail,
  Send,
  MapPin,
  Clock,
  Plane,
  Building2,
} from 'lucide-react';
import RequestForm from '@/components/site/RequestForm';
import { getSettings, getServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Контакты и запись',
  description:
    'Как связаться с фотографом Ольгой Руденковой: телефон, Telegram, WhatsApp, почта, студия в Новосибирске и зона выездной съёмки. Заявка на фотосессию онлайн.',
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function WhatsAppIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.14 1.6 5.95L2.05 22l4.29-1.12a9.87 9.87 0 0 0 5.7 1.83h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.47.65.66-2.4-.2-.32a8.16 8.16 0 0 1-1.26-4.34c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 5.83 2.42 8.2 8.2 0 0 1 2.4 5.83c0 4.54-3.7 8.23-8.21 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.68 4.27 3.76.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z"/>
    </svg>
  );
}

export default function ContactsPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const s = getSettings();
  const services = getServices({ activeOnly: true });
  const tg = (s.telegram || '').replace('@', '').trim();

  const preselected = (() => {
    const id = Number(searchParams.service);
    return Number.isInteger(id) && services.some((svc) => svc.id === id) ? id : null;
  })();

  const contactRows: Array<{
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}> = [
    {
      icon: <Phone size={18} />,
      label: 'Телефон',
      value: s.phone,
      href: `tel:${digitsOnly(s.phone)}`,
    },
    {
      icon: <Send size={18} />,
      label: 'Telegram',
      value: s.telegram,
      href: `https://t.me/${tg}`,
      external: true,
    },
    {
      icon: <WhatsAppIcon size={18} />,
      label: 'WhatsApp',
      value: s.whatsapp,
      href: `https://wa.me/${digitsOnly(s.whatsapp)}`,
      external: true,
    },
    {
      icon: <Mail size={18} />,
      label: 'Почта',
      value: s.email,
      href: `mailto:${s.email}`,
    },
  ];

  return (
    <>
      <section className="border-b border-ink/[0.08] bg-sand/50 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="container-x">
          <p className="kicker">Контакты</p>
          <h1 className="display-h mt-4 text-5xl sm:text-6xl">
            Давайте <span className="accent-i">знакомиться</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
            Расскажите о вашей идее — подскажу по дате, месту и формату съёмки.
            Все поля заявки конфиденциальны.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          {/* Левая колонка: контакты, режим, выезд */}
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 sm:p-7">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">
                Связаться со мной
              </h2>
              <ul className="mt-5 divide-y divide-ink/[0.08]">
                {contactRows.map((row) => {
                  return (
                    <li key={row.label}>
                      <a
                        href={row.href}
                        {...(row.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/[0.12] text-golddeep transition-colors group-hover:bg-gold group-hover:text-paper">
                          {row.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-mute">
                            {row.label}
                          </span>
                          <span className="mt-0.5 block truncate font-semibold text-ink transition-colors group-hover:text-golddeep">
                            {row.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="card p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-goldsoft">
                  <Clock size={18} />
                </span>
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">Режим работы</h2>
                  <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/90">{s.work_hours}</p>
                </div>
              </div>
              <div className="my-5 border-t border-ink/[0.08]" />
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-goldsoft">
                  <Plane size={18} />
                </span>
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">Зона выездной съёмки</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/90">{s.visit_zone}</p>
                </div>
              </div>
              <div className="my-5 border-t border-ink/[0.08]" />
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-goldsoft">
                  <Building2 size={18} />
                </span>
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">Студия</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/90">{s.address}</p>
                </div>
              </div>
            </div>

            <iframe
              title="Карта: Новосибирск, студия «Свет»"
              src="https://www.openstreetmap.org/export/embed.html?bbox=82.7900%2C54.9000%2C83.0200%2C55.0600&layer=mapnik&marker=54.9833%2C82.8969"
              className="h-56 w-full rounded-2xl border border-ink/10 shadow-card"
              loading="lazy"
            />
          </div>

          {/* Правая колонка: форма заявки */}
          <div id="form" className="scroll-mt-24 lg:col-span-3">
            <RequestForm services={services} preselectedServiceId={preselected} />
          </div>
        </div>
      </section>
    </>
  );
}
