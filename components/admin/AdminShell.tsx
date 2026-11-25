'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Images,
  Inbox,
  Settings2,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import LogoMark from '@/components/site/LogoMark';
import { logoutAction } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Панель', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Услуги', icon: Briefcase },
  { href: '/admin/portfolio', label: 'Портфолио', icon: Images },
  { href: '/admin/requests', label: 'Заявки', icon: Inbox, badgeKey: true },
  { href: '/admin/settings', label: 'Контакты и тексты', icon: Settings2 },
];

export default function AdminShell({
  children,
  newCount,
  photographerName,
}: {
  children: React.ReactNode;
  newCount: number;
  photographerName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-paper">
      {/* Лого */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <span className="leading-tight">
            <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-paper/50">
              Админ-панель
            </span>
            <span className="block font-display text-sm font-bold">{photographerName}</span>
          </span>
        </Link>
        <button onClick={() => setOpen(false)} className="text-paper/60 hover:text-paper lg:hidden" aria-label="Закрыть меню">
          <X size={22} />
        </button>
      </div>

      {/* Навигация */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                active ? 'bg-gold text-ink shadow-card' : 'text-paper/75 hover:bg-white/5 hover:text-paper'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              <span className="flex-1">{item.label}</span>
              {item.badgeKey && newCount > 0 && (
                <span
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                    active ? 'bg-ink text-goldsoft' : 'bg-gold text-ink'
                  }`}
                >
                  {newCount}
                </span>
              )}
            </Link>
          );
        })}

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm font-semibold text-goldsoft transition-colors hover:border-goldsoft hover:text-gold"
        >
          <ExternalLink size={18} />
          Открыть сайт
        </a>
      </nav>

      {/* Выход */}
      <div className="border-t border-white/10 p-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-paper/60 transition-colors hover:bg-white/5 hover:text-paper"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-72">
      {/* Мобильная шапка */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink/10 bg-[#F2EFE9]/90 px-4 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 font-display font-bold" aria-label="Открыть меню">
          <Menu size={22} />
          <span className="text-sm">Админ-панель</span>
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-golddeep underline underline-offset-2">
          Открыть сайт
        </a>
      </div>

      {/* Сайдбар: десктоп — статичный, моб. — выдвижной */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-soft">{sidebar}</aside>
        </div>
      )}

      <main className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
