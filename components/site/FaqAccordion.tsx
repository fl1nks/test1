'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

const ITEMS = [
  {
    q: 'Где проходит съёмка?',
    a: 'В студии «Свет» (ул. Ленина, 12), на природе и городских локациях, у вас дома — а ещё на вашей свадьбе, в офисе или магазине. Подскажу по локациям под ваш образ и свет на конкретный день.',
  },
  {
    q: 'Как быстро вы отдаёте фотографии?',
    a: 'Превью для соцсетей — в течение 1–3 дней, полная серия с цветокоррекцией — за 2–4 недели. Свадебный день: экспресс-подборка в течение 2–3 дней, основная галерея — за 3–4 недели.',
  },
  {
    q: 'Можно ли перенести дату съёмки?',
    a: 'Да, без проблем: просто предупредите не позднее чем за 3 дня до съёмки — перенесём на любой удобный день. Предоплата при переносе сохраняется.',
  },
  {
    q: 'Вы выезжаете за пределы Кемерова?',
    a: 'Конечно. Выезд по городу — бесплатно, до 50 км от города — 20 ₽/км, область и командировки по России — по договорённости (проезд и, при необходимости, проживание обсуждаются отдельно).',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/[0.08] overflow-hidden rounded-2xl border border-ink/10 bg-white">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-sand/40"
            >
              <span className="font-display text-[17px] font-bold leading-snug">{item.q}</span>
              <Plus
                size={20}
                strokeWidth={2.2}
                className={`shrink-0 text-golddeep transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-mute">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
