import type { Metadata } from 'next';
import SettingsForm from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Контакты и тексты' };

export default function AdminSettingsPage() {
  const settings = getSettings();
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-golddeep">Раздел</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Контакты и тексты сайта</h1>
      <p className="mt-1 text-sm text-mute">
        Имя, подзаголовки, контакты и зона выезда — всё это можно поменять здесь без программиста.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
