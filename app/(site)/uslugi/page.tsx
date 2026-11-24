import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Check, BadgePercent, Info } from 'lucide-react';
import FaqAccordion from '@/components/site/FaqAccordion';
import Reveal from '@/components/site/Reveal';
import { getServices } from '@/lib/queries';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description:
    'Прайс фотографа в Кемерово: портретная, семейная, свадебная, love story, newborn, предметная и имиджевая съёмка, репортаж. Прозрачные цены и запись онлайн.',
};

export default function UslugiPage() {
  const services = getServices({ activeOnly: true });

  return (
    <>
      {/* Шапка раздела */}
      <section className="border-b border-ink/[0.08] bg-sand/50 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="container-x">
          <p className="kicker">Прайс-лист</p>
          <h1 className="display-h mt-4 max-w-3xl text-5xl sm:text-6xl">
            Услуги и <span className="accent-i">цены</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
            Открытые цены без сюрпризов: студия и аренда уже включены в пакет «Под ключ».
            Дата фиксируется предоплатой 1 000 ₽ после короткого обсуждения деталей.
          </p>
        </div>
      </section>

      {/* Прайс */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="group relative flex flex-col gap-4 border-b border-ink/[0.08] p-6 transition-colors last:border-b-0 hover:bg-sand/40 sm:p-7 lg:flex-row lg:items-center lg:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-4 font-display text-5xl font-black text-sandline/80 transition-colors group-hover:text-goldsoft/60 select-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-bold leading-snug">{service.title}</h2>
                    {service.badge && (
                      <span className="rounded-full bg-gold/[0.12] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-golddeep">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mute">{service.description}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                    <Clock size={13} /> {service.duration}
                  </p>
                </div>

                <div className="relative flex shrink-0 items-center justify-between gap-6 lg:flex-col lg:items-end lg:justify-center lg:gap-2 lg:text-right">
                  <div>
                    <p className="font-display text-[28px] font-extrabold leading-none text-ink sm:text-3xl">
                      {formatPrice(service.price)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mute">{service.unit}</p>
                  </div>
                  <Link href={`/contacts?service=${service.id}#form`} className="btn-ink !px-5 !py-2.5 text-[13px] whitespace-nowrap">
                    Записаться
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-mute">
            <Info size={14} className="mt-0.5 shrink-0" />
            Съёмки проходят в фотостудиях Кемерово (аренда включена в «Под ключ») и на локациях.
            Выезд за пределы города возможен — стоимость обговаривается индивидуально.
          </p>
        </div>
      </section>

      {/* Что входит + FAQ */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-5 lg:gap-12">
          <Reveal className="lg:col-span-2">
            <p className="kicker"><BadgePercent size={13} /> Что входит</p>
            <h2 className="display-h mt-4 text-3xl sm:text-4xl">
              В стоимость <span className="accent-i">уже включено</span>
            </h2>
            <ul className="mt-6 space-y-3.5">
              {[
                'Консультация и обсуждение вашей идеи до съёмки',
                'Аренда любой красивой фотостудии в Кемерово (для пакета «Под ключ») — я сама всё подберу и забронирую',
                'Помощь с подбором образа и референсов',
                'Помощь с позированием на протяжении всей съёмки',
                '40–50 фотографий в авторской обработке за час (20–25 — за 30 минут)',
                'Все готовые фотографии дополнительно в чёрно-белом варианте',
                'Онлайн-галерея для удобного просмотра и скачивания',
                'Готовые фотографии — до 7 дней',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-golddeep">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <p className="kicker">Частые вопросы</p>
            <div className="mt-4">
              <FaqAccordion />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
