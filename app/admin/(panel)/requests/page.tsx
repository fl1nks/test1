import type { Metadata } from 'next';
import RequestsList from '@/components/admin/RequestsList';
import { getRequests, countByStatus } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Заявки' };

export default function AdminRequestsPage() {
  const requests = getRequests();
  const counts = countByStatus();

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-golddeep">Раздел</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Заявки с сайта</h1>
      <p className="mt-1 text-sm text-mute">
        {counts.new > 0
          ? `Новых заявок: ${counts.new}. Отвечайте в Telegram или телефоном — контакт указан в каждой заявке.`
          : 'Новых заявок нет. Все обращения обработаны.'}
      </p>
      <div className="mt-6">
        <RequestsList requests={requests} />
      </div>
    </div>
  );
}
