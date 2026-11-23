import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Clock,
  Check,
  Star,
  ChevronDown,
  Quote,
  Sparkles,
  Camera,
} from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import Aperture from '@/components/site/Aperture';
import { getSettings, getServices, getPortfolio } from '@/lib/queries';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

const MARQUEE = [
  'Свадебная съёмка',
  'Семейные фотосессии',
  'Love story',
  'Портретные съёмки',
  'Newborn и первый год',
  'Предметная съёмка',
  'Имидж для бизнеса',
  'Репортаж',
];

const TESTIMONIALS = [
  {
    text: 'Оля — волшебница. На свадьбе она замечала каждый важный момент раньше нас самих: и мамины слёзы, и дедушкин смех. Смотрим фотографии и каждый раз проживаем этот день заново.',
    name: 'Анастасия и Даниил',
    context: 'свадьба, август',
  },
  {
    text: 'Пришли на семейную съёмку с детьми трёх и пяти лет — и никто не орал! Оля умеет находить подход даже к самым неусидчивым. Фотографии живые и честные.',
    name: 'Мария',
    context: 'семейная фотосессия в парке',
  },
  {
    text: 'Заказывали предметную съёмку для магазина косметики. Ровный свет, чистый фон, подсказки по композиции. Карточки товара приняли с первого раза.',
    name: 'Елена',
    context: 'предметная съёмка, маркетплейсы',
  },
];

export default function HomePage() {
  const s = getSettings();
  const services = getServices({ activeOnly: true }).slice(0, 4);
  const portfolio = getPortfolio().slice(0, 5);
  const tg = (s.telegram || '').replace('@', '');

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Свадебная пара идёт по берегу озера на закате"
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover object-[62%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/55 to-ink/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-transparent to-ink/35" />
        </div>

        <div className="container-x relative z-10 w-full pb-14 pt-32 sm:pb-20 sm:pt-40">
          <div className="max-w-3xl">
            <p className="kicker !text-goldsoft before:!bg-goldsoft/60 animate-fadeUp">
              {s.hero_kicker}
            </p>
            <h1
              className="display-h mt-6 text-[42px] !leading-[1.04] text-paper sm:text-6xl lg:text-[76px] animate-fadeUp"
              style={{ animationDelay: '120ms' }}
            >
              Снимаю <span className="accent-i !text-goldsoft">искренность</span>,
              <br />
              а не позы
            </h1>
            <p
              className="mt-6 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg animate-fadeUp"
              style={{ animationDelay: '240ms' }}
            >
              {s.hero_subtitle}
            </p>
            <div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center animate-fadeUp"
              style={{ animationDelay: '360ms' }}
            >
              <Link href="/portfolio" className="btn-gold !px-7 !py-4 text-base">
                Смотреть портфолио
                <ArrowRight size={18} />
              </Link>
              <Link href="/contacts#form" className="btn-ghost-light !px-7 !py-4 text-base">
                Записаться на съёмку
              </Link>
            </div>

            {/* Факты */}
            <dl
              className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6 animate-fadeUp"
              style={{ animationDelay: '480ms' }}
            >
              {[
                [`${s.stat_years} лет`, 'в профессии'],
                [s.stat_shoots, 'съёмок провела'],
                [s.stat_rating, 'средняя оценка'],
              ].map(([num, label]) => (
                <div key={label} className="px-4 first:pl-0 last:pr-0">
                  <dt className="font-display text-2xl font-bold text-goldsoft sm:text-3xl">{num}</dt>
                  <dd className="mt-1 text-[10px] uppercase leading-snug tracking-[0.14em] text-paper/60 sm:text-[11px]">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <a
          href="#marquee"
          aria-label="Прокрутить вниз"
          className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 animate-scrollHint text-paper/70 transition-colors hover:text-paper lg:block"
        >
          <ChevronDown size={30} />
        </a>
      </section>

      {/* ============ БЕГУЩАЯ СТРОКА ============ */}
      <div id="marquee" className="overflow-hidden border-b border-white/10 bg-ink py-4 text-paper" aria-hidden="true">
        <div className="flex w-max animate-marquee items-center whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="flex items-center gap-6 pr-6 text-[13px] font-semibold uppercase tracking-[0.22em] text-paper/75">
              {item}
              <Aperture className="h-4 w-4 text-goldsoft/80" />
            </span>
          ))}
        </div>
      </div>

      {/* ============ УСЛУГИ (превью) ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">Услуги и цены</p>
              <h2 className="display-h mt-4 text-4xl sm:text-5xl">
                Выберите свой <span className="accent-i">формат</span>
              </h2>
            </div>
            <Link href="/uslugi" className="btn-ghost !py-3 text-[13px]">
              Все услуги и прайс
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 90}>
                <Link
                  href="/uslugi"
                  className="card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-4xl font-black text-sandline transition-colors group-hover:text-goldsoft">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {service.badge && (
                      <span className="rounded-full bg-gold/[0.12] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-golddeep">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold leading-snug">{service.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-mute">{service.description}</p>
                  <div className="mt-auto pt-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-2xl font-extrabold text-ink">{formatPrice(service.price)}</span>
                      <span className="text-[11px] text-mute">{service.unit}</span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-mute">
                      <Clock size={12} /> {service.duration}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ПОРТФОЛИО (превью) ============ */}
      <section className="bg-sand/60 py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">Портфолио</p>
              <h2 className="display-h mt-4 text-4xl sm:text-5xl">
                Недавние <span className="accent-i">истории</span>
              </h2>
            </div>
            <Link href="/portfolio" className="btn-ghost !py-3 text-[13px]">
              Все работы
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-4">
            {portfolio.map((item, i) => (
              <Link
                key={item.id}
                href="/portfolio"
                className={`group relative overflow-hidden rounded-2xl ${
                  i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <Image
                  src={item.image_path}
                  alt={item.title || item.category_name}
                  fill
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <span className="inline-block rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-goldsoft backdrop-blur-sm">
                    {item.category_name}
                  </span>
                  {item.title && (
                    <span className="mt-2 hidden text-sm font-medium text-paper/95 sm:block">{item.title}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ОБО МНЕ ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-full w-full rounded-3xl border border-gold/40" />
            <div className="relative overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/images/about.jpg"
                alt="Фотограф Ольга Руденкова на съёмке"
                width={900}
                height={1100}
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 right-4 rounded-2xl border border-ink/[0.08] bg-paper/95 px-5 py-3 shadow-card backdrop-blur">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-golddeep">
                <Camera size={13} /> С 2017 года
              </p>
              <p className="mt-0.5 font-display text-sm font-bold">в профессии</p>
            </div>
          </Reveal>

          <div>
            <p className="kicker">Обо мне</p>
            <h2 className="display-h mt-4 text-4xl sm:text-5xl">
              Привет, я — <span className="accent-i">Оля</span>
            </h2>
            <p className="mt-6 leading-relaxed text-mute">{s.about_text}</p>
            <ul className="mt-7 space-y-3">
              {[
                'Живые эмоции вместо постановочной пластики',
                'Честный свет, тёплая цветокоррекция, без «пластиковых» лиц',
                'Онлайн-галерея полного размера + 30 кадров с ретушью',
                'от брифа до готовых фото — 2–4 недели',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-golddeep">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-9 font-accent text-4xl italic text-golddeep">Ольга Руденкова</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">основатель студии</p>
          </div>
        </div>
      </section>

      {/* ============ ОТЗЫВЫ ============ */}
      <section className="border-y border-ink/[0.08] bg-sand/60 py-16 sm:py-20">
        <div className="container-x">
          <p className="kicker">Отзывы</p>
          <h2 className="display-h mt-4 text-4xl sm:text-5xl">
            Слова, которые <span className="accent-i">дороже</span> лайков
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card flex h-full flex-col gap-4 p-6">
                <Quote size={26} className="text-goldsoft" fill="currentColor" strokeWidth={0} />
                <div className="flex gap-0.5 text-gold" aria-label="Оценка 5 из 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="text-[15px] leading-relaxed text-ink/90">«{t.text}»</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-ink/[0.08] pt-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-base font-bold text-goldsoft">
                    {t.name.trim()[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-mute">{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ФИНАЛЬНЫЙ CTA ============ */}
      <section className="relative overflow-hidden bg-ink py-20 text-center text-paper sm:py-28">
        <Aperture aria-hidden className="pointer-events-none absolute -left-16 top-1/2 h-96 w-96 -translate-y-1/2 text-white/[0.04]" />
        <Aperture aria-hidden className="pointer-events-none absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 rotate-12 text-white/[0.04]" />
        <div className="container-x relative">
          <p className="kicker justify-center !text-goldsoft before:!bg-goldsoft/50">
            <Sparkles size={13} /> Запись открыта
          </p>
          <h2 className="display-h mt-6 text-4xl text-paper sm:text-6xl">
            Давайте создадим<br />
            <span className="accent-i !text-goldsoft">вашу</span> историю
          </h2>
          <p className="mx-auto mt-6 max-w-md text-paper/70">
            Оставьте заявку — отвечу лично в ближайшее рабочее время и помогу выбрать формат съёмки.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <Link href="/contacts#form" className="btn-gold !px-9 !py-4 text-base">
              Оставить заявку
              <ArrowRight size={18} />
            </Link>
            <a
              href={`https://t.me/${tg}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-paper/60 underline decoration-goldsoft/40 underline-offset-4 transition-colors hover:text-goldsoft"
            >
              или напишите в Telegram: {s.telegram}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
