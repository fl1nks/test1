import type { Metadata, Viewport } from 'next';
import '@fontsource/playfair-display/cyrillic-400.css';
import '@fontsource/playfair-display/cyrillic-400-italic.css';
import '@fontsource/playfair-display/cyrillic-500.css';
import '@fontsource/playfair-display/cyrillic-600.css';
import '@fontsource/playfair-display/cyrillic-700.css';
import '@fontsource/playfair-display/cyrillic-800.css';
import '@fontsource/playfair-display/cyrillic-800-italic.css';
import '@fontsource/playfair-display/cyrillic-900.css';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-400-italic.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/latin-800.css';
import '@fontsource/playfair-display/latin-900.css';
import '@fontsource/cormorant-garamond/cyrillic-400-italic.css';
import '@fontsource/cormorant-garamond/cyrillic-500-italic.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/inter/cyrillic-400.css';
import '@fontsource/inter/cyrillic-500.css';
import '@fontsource/inter/cyrillic-600.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ольга Руденкова — фотограф в Новосибирске',
    template: '%s · Ольга Руденкова — фотограф',
  },
  description:
    'Профессиональная фотосъёмка в Новосибирске: свадьбы, семьи, love story, портреты, предметная и имиджевая съёмка для бизнеса. Портфолио, цены, удобная запись онлайн.',
  keywords: ['фотограф', 'фотограф Новосибирск', 'свадебный фотограф', 'семейная фотосессия', 'предметная съёмка', 'репортажная съёмка'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Ольга Руденкова — фотограф',
    title: 'Ольга Руденкова — фотограф в Новосибирске',
    description: 'Свадьбы, семьи, love story, портреты и коммерческая съёмка. Портфолио, цены, запись онлайн.',
    images: ['/images/hero.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#201D1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
