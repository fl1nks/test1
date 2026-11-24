import type { Metadata } from 'next';
import PortfolioGrid from '@/components/site/PortfolioGrid';
import { getCategories, getPortfolio } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Портфолио',
  description:
    'Портфолио фотографа Ольги Курденковой: свадьбы, семейные и love story съёмки, портреты. Фильтр по категориям, полные фото без стоков.',
};

export default function PortfolioPage() {
  const items = getPortfolio();
  const categories = getCategories();

  return (
    <>
      <section className="border-b border-ink/[0.08] bg-sand/50 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="container-x">
          <p className="kicker">Портфолио</p>
          <h1 className="display-h mt-4 text-5xl sm:text-6xl">
            Мои <span className="accent-i">работы</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
            Каждое фото — из реальной съёмки, без стоков и постановочных чудес.
            Выберите категорию: свадьба, семья, love story или портрет.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <PortfolioGrid items={items} categories={categories} />
        </div>
      </section>
    </>
  );
}
