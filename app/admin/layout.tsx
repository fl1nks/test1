export const metadata = { title: { template: '%s · Админ-панель', default: 'Админ-панель' }, robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F2EFE9] font-sans text-ink antialiased">{children}</div>;
}
