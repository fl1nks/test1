import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginForm from './LoginForm';
import Aperture from '@/components/site/Aperture';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Вход' };

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin');

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-paper">
          <Aperture className="mx-auto h-14 w-14 text-goldsoft" />
          <h1 className="mt-5 font-display text-3xl font-extrabold">Админ-панель</h1>
          <p className="mt-1 text-sm text-paper/60">Управление сайтом фотографа Ольги Курденковой</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
