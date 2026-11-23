import type { Metadata } from 'next';
import ServicesManager from '@/components/admin/ServicesManager';
import { getServices } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Услуги' };

export default function AdminServicesPage() {
  const services = getServices();
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-golddeep">Раздел</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Услуги и цены</h1>
      <div className="mt-6">
        <ServicesManager services={services} />
      </div>
    </div>
  );
}
