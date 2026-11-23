import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <p className="kicker !text-goldsoft before:!bg-goldsoft/50">Ошибка 404</p>
      <h1 className="mt-6 font-display text-6xl font-black leading-none sm:text-8xl">
        Кадр <span className="accent-i !text-goldsoft">уплыл</span>
      </h1>
      <p className="mt-6 max-w-md text-paper/70">
        Такой страницы нет — возможно, ссылка устарела или в адресе опечатка.
      </p>
      <Link href="/" className="btn-gold mt-10">Вернуться на главную</Link>
    </main>
  );
}
