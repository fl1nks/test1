import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Mail,
  Send,
  Plane,
} from 'lucide-react';
import RequestForm from '@/components/site/RequestForm';
import { getSettings, getServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Контакты и запись',
  description:
    'Как связаться с фотографом Ольгой Курденковой: Telegram, ВКонтакте, почта. Съёмки в фотостудиях Кемерово и на локациях, выезд за город — по договорённости. Заявка на фотосессию онлайн.',
};


export default function ContactsPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const s = getSettings();
  const services = getServices({ activeOnly: true });
  const tg = (s.telegram || '').replace('@', '').trim();
  const vk = (s.vk || '').replace(/^https?:\/\//, '');
  const vkHref = vk.startsWith('vk.ru') || vk.startsWith('vk.com') ? `https://${vk}` : `https://vk.ru/${vk}`;

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
    icon: <Send size={18} />,
    label: 'Telegram',
    value: s.telegram,
    href: `https://t.me/${tg}`,
    external: true,
  },
  {
    icon: <span className="text-[11px] font-black leading-none">VK</span>,
    label: 'ВКонтакте',
    value: vk,
    href: vkHref,
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
                  <Plane size={18} />
                </span>
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-golddeep">Где и как проходят съёмки</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/90">{s.visit_zone}</p>
                </div>
              </div>
            </div>

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
