'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Aperture from './Aperture';

const LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/uslugi', label: 'Услуги' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/contacts', label: 'Контакты' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const transparent = isHome && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          transparent
            ? 'border-b border-transparent bg-transparent text-paper'
            : 'border-b border-ink/[0.08] bg-paper/85 text-ink shadow-[0_8px_30px_-18px_rgba(32,29,26,0.35)] backdrop-blur-xl'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <Link href="/" className="group flex items-center gap-3" aria-label="На главную">
            <Aperture
              className={`h-9 w-9 transition-transform duration-500 group-hover:rotate-45 ${
                transparent ? 'text-goldsoft' : 'text-golddeep'
              }`}
            />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-extrabold uppercase tracking-[0.18em] sm:text-base">
                Ольга&nbsp;Курденкова
              </span>
              <span
                className={`block font-accent text-[13px] italic leading-none ${
                  transparent ? 'text-goldsoft' : 'text-golddeep'
                }`}
              >
                фотограф
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`u-line text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  pathname === l.href
                    ? transparent
                      ? 'text-goldsoft'
                      : 'text-golddeep'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contacts#form" className="btn-gold !px-5 !py-2.5 text-[13px]">
              Записаться
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
          </nav>

          <button
            className="icon-btn md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 z-30 bg-ink text-paper transition-all duration-500 md:hidden ${
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-center px-8 pt-16">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ transitionDelay: `${80 + i * 70}ms` }}
              className={`border-b border-white/10 py-5 font-display text-4xl font-bold transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              } ${pathname === l.href ? 'text-goldsoft' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contacts#form"
            style={{ transitionDelay: '400ms' }}
            className={`btn-gold mt-8 w-full text-base transition-all duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            Записаться на съёмку
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
