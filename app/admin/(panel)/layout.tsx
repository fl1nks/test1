import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getSettings, countByStatus } from '@/lib/queries';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect('/admin/login');
  const s = getSettings();
  const counts = countByStatus();

  return (
    <AdminShell newCount={counts.new} photographerName={s.photographer_name || 'Фотограф'}>
      {children}
    </AdminShell>
  );
}
