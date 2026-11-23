import type { Metadata } from 'next';
import PortfolioManager from '@/components/admin/PortfolioManager';
import { getCategories, getPortfolio } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Портфолио' };

export default function AdminPortfolioPage() {
  const categories = getCategories();
  const items = getPortfolio();
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-golddeep">Раздел</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Портфолио</h1>
      <p className="mt-1 text-sm text-mute">Фотографии для сайта и категории, по которым они показываются.</p>
      <div className="mt-6">
        <PortfolioManager categories={categories} items={items} />
      </div>
    </div>
  );
}
