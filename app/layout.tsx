import {sitePath,siteUrl} from './site-path';
import type { Metadata } from 'next';
import './premium.css';
import './refined.css';
import './nov-editions.css';
import {novPlus} from './nov-shop-tools';
export const metadata: Metadata = {
  title: 'Новъ — НЭО Питомник',
  robots: novPlus?{index:false,follow:true}:undefined,
  description: 'Растения из собственного питомника: хвойные, лиственные, плодовые и цветущие кустарники. Подбор агронома, посадка и уход за садом. Истра, Падиково.',
  metadataBase: new URL(siteUrl('/')),
  openGraph: { title: 'Новъ — растения для вашего сада', description: 'Старинные традиции в новых формах. Каталог растений, помощь агронома и ландшафтные услуги.', locale: 'ru_RU', type: 'website' },
  icons: { icon: sitePath('/favicon.svg') },
};
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="ru"><head><link rel="stylesheet" href={sitePath("/assets/fonts/fonts.css")}/></head><body>{children}</body></html>; }
