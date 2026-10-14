import {sitePath,siteUrl} from './site-path';
import type { Metadata } from 'next';
import './globals.css';
import './multipage.css';
export const metadata: Metadata = {
  title: 'НЭО Питомник — ваш будущий сад начинается здесь',
  description: 'Растения из собственного питомника: хвойные, лиственные, плодовые и цветущие кустарники. Подбор агронома, посадка и уход за садом. Истра, Падиково.',
  metadataBase: new URL(siteUrl('/')),
  openGraph: { title: 'НЭО Питомник — растения для вашего сада', description: 'Старинные традиции в новых формах. Каталог растений, помощь агронома и ландшафтные услуги.', locale: 'ru_RU', type: 'website' },
  icons: { icon: sitePath('/favicon.svg') },
};
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="ru"><head><link rel="stylesheet" href={sitePath("/assets/fonts/fonts.css")}/></head><body>{children}</body></html>; }
