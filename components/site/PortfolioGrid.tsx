'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react';
import type { PortfolioItem, PortfolioCategory } from '@/lib/queries';

export default function PortfolioGrid({
  items,
  categories,
}: {
  items: PortfolioItem[];
  categories: PortfolioCategory[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === null ? items : items.filter((i) => i.category_id === active)),
    [items, active]
  );

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of items) map.set(item.category_id, (map.get(item.category_id) ?? 0) + 1);
    return map;
  }, [items]);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => {
        if (cur === null || filtered.length === 0) return cur;
        return (cur + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, step]);

  // Если фильтр изменился, а лайтбокс открыт за пределами списка — закрыть
  useEffect(() => {
    if (lightbox !== null && lightbox >= filtered.length) setLightbox(null);
  }, [filtered.length, lightbox]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      {/* Фильтры по категориям */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Категории портфолио">
        <button
          role="tab"
          aria-selected={active === null}
          onClick={() => setActive(null)}
          className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
            active === null
              ? 'bg-ink text-paper shadow-card'
              : 'border border-ink/[0.12] bg-white text-mute hover:border-gold hover:text-golddeep'
          }`}
        >
          Все · {items.length}
        </button>
        {categories.map((cat) => {
          const n = counts.get(cat.id) ?? 0;
          if (n === 0) return null;
          const selected = active === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(selected ? null : cat.id)}
              className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                selected
                  ? 'bg-ink text-paper shadow-card'
                  : 'border border-ink/[0.12] bg-white text-mute hover:border-gold hover:text-golddeep'
              }`}
            >
              {cat.name} · {n}
            </button>
          );
        })}
      </div>

      {/* Сетка */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/20 p-16 text-center">
          <LayoutGrid className="mx-auto mb-4 text-goldsoft" size={36} />
          <p className="font-display text-2xl font-bold">В этой категории пока пусто</p>
          <p className="mt-2 text-mute">Выберите другую категорию или загляните позже.</p>
        </div>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightbox(i)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left shadow-card"
              aria-label={`Открыть фото: ${item.title || item.category_name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_path}
                alt={item.title || item.category_name}
                loading="lazy"
                className="w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/15 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="w-max rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-goldsoft backdrop-blur-sm">
                  {item.category_name}
                </span>
                {item.title && <span className="mt-2 text-sm font-semibold text-paper">{item.title}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Лайтбокс */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-md animate-fadeUp"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-paper/80">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-goldsoft">
              {lightbox! + 1} / {filtered.length} · {current.category_name}
            </p>
            <button onClick={close} className="icon-btn !border-white/15 !text-paper/80 hover:!text-paper" aria-label="Закрыть">
              <X size={20} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-20" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              src={current.image_path}
              alt={current.title || current.category_name}
              className="max-h-full max-w-full rounded-xl object-contain shadow-soft"
            />
            <button
              onClick={() => step(-1)}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-paper/80 transition-all hover:bg-white/10 hover:text-paper sm:left-4"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-paper/80 transition-all hover:bg-white/10 hover:text-paper sm:right-4"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {current.title && (
            <p className="px-6 pb-5 pt-2 text-center text-sm font-medium text-paper/75" onClick={(e) => e.stopPropagation()}>
              {current.title}
            </p>
          )}
        </div>
      )}
    </>
  );
}
