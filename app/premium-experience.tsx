'use client';

import type {RefObject} from 'react';
import {ArrowDown,ArrowRight,ArrowUpRight,Leaf,Menu,Plus,ShoppingBag,X} from 'lucide-react';
import {SiteImage,SiteLink} from './site-elements';
import {GardenPanorama,NurseryTeaser,NovJournalFeature} from './nov-editorial';
import {PlantPicker} from './nov-commerce';
import {novPlus} from './nov-shop-tools';
import {GrowthExperience} from './growth-experience';
import navigation from './data/navigation.json';
import {asset,productPath,serviceData,type Product,type View} from './site-types';

type Consult=(goal?:string)=>void;
const links=[['Главная','/'],['Питомник','/o-nas/'],['Каталог','/shop/'],['Услуги','/uslugi/'],['Журнал','/blog/'],...(novPlus?[['Как заказать','/pokupatelyam/']]:[]),['Контакты','/kontakty/']];

export function PremiumHeader({view,quantity,menuOpen,setMenuOpen,scrolled,onConsult}:{view:View;quantity:number;menuOpen:boolean;setMenuOpen:(open:boolean)=>void;scrolled:boolean;onConsult:Consult}) {
 const active=view==='catalog'||view==='category'||view==='product'||view==='sale'?'/shop/':view==='about'?'/o-nas/':view==='services'||view==='service'?'/uslugi/':view==='blog'||view==='article'?'/blog/':view==='contacts'?'/kontakty/':view==='buyer'?'/pokupatelyam/':view==='home'?'/':'';
 return <header className={'site-header'+(scrolled?' compact':'')} onKeyDown={e=>{if(e.key==='Escape')setMenuOpen(false)}}>
  <SiteLink href="#top" className="skip-link">Перейти к содержанию</SiteLink>
  <SiteLink href="/" className="brand" aria-label="НЭО Питомник — главная"><SiteImage className="brand-original" src="/assets/original-logo.png" width={590} height={200} alt=""/></SiteLink>
  <nav className="desktop-nav" aria-label="Главная навигация">{links.map(([label,href])=>href==='/shop/'?<div className="nav-catalog" key={href}><SiteLink href={href} aria-current={active===href?'page':undefined}>{label} <Plus size={11}/></SiteLink><div className="mega-menu"><SiteLink className="mega-all" href="/shop/">Весь каталог · 188 позиций <ArrowUpRight size={20}/></SiteLink><div>{navigation.filter(x=>x.children.length).map(g=><section key={g.path}><SiteLink href={g.path}>{g.name}</SiteLink>{g.children.map(c=><SiteLink href={c.path} key={c.path}>{c.name}</SiteLink>)}</section>)}</div><SiteLink className="mega-sale" href="/sale/">Предложения питомника <ArrowRight size={16}/></SiteLink></div></div>:<SiteLink key={href} href={href} aria-current={active===href?'page':undefined}>{label}</SiteLink>)}</nav>
  <div className="header-actions"><SiteLink className="header-phone" href="tel:+79687809292">+7 968 780-92-92</SiteLink><SiteLink className="selection-button" href="/korzina/" aria-label={'Ваша заявка, растений: '+quantity}><ShoppingBag size={21} strokeWidth={1.4}/>{quantity>0&&<span>{quantity}</span>}</SiteLink><button className="button header-cta" onClick={()=>onConsult()}>Обсудить сад <ArrowUpRight size={17}/></button><button className="menu-button" aria-controls="mobile-menu" aria-expanded={menuOpen} aria-label={menuOpen?'Закрыть меню':'Открыть меню'} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
  {menuOpen&&<nav id="mobile-menu" className="mobile-nav" aria-label="Мобильная навигация">{[...links,['Предложения','/sale/'],['Моя заявка','/korzina/']].map(([label,href],i)=><SiteLink key={href} href={href}><span>0{i+1}</span>{label}<ArrowUpRight size={20}/></SiteLink>)}<button className="button" onClick={()=>onConsult()}>Помощь с выбором <ArrowUpRight size={18}/></button><SiteLink className="mobile-phone" href="tel:+79687809292">+7 968 780-92-92</SiteLink></nav>}
 </header>;
}

export function PremiumProductCard({product:p}:{product:Product}) {
 return <article className="product-card"><SiteLink className="product-image" href={productPath(p)} aria-label={'Подробнее: '+p.name}>{p.image?<SiteImage src={asset(p.image)!} alt={p.name} loading="lazy" width={540} height={650}/>:<div className="plant-placeholder"><Leaf size={54} strokeWidth={.8}/><span>Фотографию уточним в питомнике</span></div>}<span className="product-tag">{p.category}</span><span className="image-arrow"><ArrowUpRight size={22}/></span></SiteLink><div className="product-information"><SiteLink className="product-name" href={productPath(p)}>{p.name}</SiteLink><p className="product-size">{p.variants.length?'Несколько размеров на выбор':p.group||'Растение из каталога'}</p><div className="product-bottom"><span>{p.priceText||'Цена по запросу'}</span><SiteLink className="product-select-link" href={productPath(p)} aria-label={'Выбрать '+p.name}><Plus size={19}/></SiteLink></div></div></article>;
}

type GrowthRefs={growth:RefObject<HTMLElement|null>;seed:RefObject<HTMLDivElement|null>;progress:RefObject<HTMLDivElement|null>;trees:RefObject<(HTMLDivElement|null)[]>;growthProgress:RefObject<number>};
export function PremiumHome({products,onConsult,stage,seekGrowth,growth,seed,progress,trees,growthProgress}:{products:Product[];onConsult:Consult;stage:number;seekGrowth:(stage:number,smooth?:boolean)=>void}&GrowthRefs) {
 const picks=[2735,2753,2618,2653].map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>!!p);
 return <>
  <GardenPanorama onConsult={onConsult}/>
  <GrowthExperience stage={stage} seekGrowth={seekGrowth} growth={growth} seed={seed} progress={progress} trees={trees} growthProgress={growthProgress}/>
  {novPlus&&<PlantPicker products={products} onConsult={onConsult}/>}
  <NurseryTeaser/>
  <section id="collections" className="home-selection section-pad"><div className="section-heading reveal"><div><p className="eyebrow">ВЫБОР ДЛЯ ВАШЕГО САДА</p><h2>Будущие <em>акценты.</em></h2></div><SiteLink className="text-button" href="/shop/">Все 188 позиций <ArrowUpRight size={19}/></SiteLink></div><div className="product-grid">{picks.map(p=><PremiumProductCard key={p.id} product={p}/>)}</div><p className="catalog-note">Выберите размер растения в его карточке. Наличие и стоимость согласуем перед заказом.</p></section>

  <section id="services" className="home-services section-pad"><div className="service-editorial"><div><p className="eyebrow">03 / ЗАБОТА О ВАШЕМ САДЕ</p><h2>Продуман<br/>до <em>последнего<br/>листочка.</em></h2><p>От идеи и первых посадок до регулярного ухода. Всё, что нужно вашему саду, — в руках одной команды.</p><SiteLink className="text-button" href="/uslugi/">Все 9 услуг <ArrowUpRight size={19}/></SiteLink></div><SiteImage src="/assets/garden-3.webp" alt="Сад с декоративными растениями — фотография исходного сайта" loading="lazy" width={900} height={650}/></div><div className="service-rows">{serviceData.slice(0,3).map((s,i)=><SiteLink key={s.slug} href={'/uslugi/'+s.slug+'/'}><span>0{i+1}</span><h3>{s.name}</h3><p>{s.description}</p><ArrowUpRight size={27}/></SiteLink>)}</div></section>
  <NovJournalFeature/>
 </>;
}

export function PremiumFooter({onConsult}:{onConsult:Consult}) {
 return <footer className="premium-footer"><div className="footer-invitation"><p className="eyebrow light">ВАШ САД НАЧИНАЕТСЯ С РАЗГОВОРА</p><div><h2>Давайте создадим<br/><em>что-то живое.</em></h2><button className="footer-circle" onClick={()=>onConsult()} aria-label="Обсудить мой сад"><ArrowUpRight size={48} strokeWidth={1}/></button></div><p>Расскажите о вашем участке.<br/>Поможем найти растения с вашим характером.</p></div><div className="footer-grid"><SiteLink href="/" className="footer-brand">НЭО<span>ПИТОМНИК РАСТЕНИЙ</span></SiteLink><nav aria-label="Разделы сайта">{[...links,['Предложения','/sale/'],['Моя заявка','/korzina/']].map(([label,href])=><SiteLink key={href} href={href}>{label}</SiteLink>)}</nav><div className="footer-address"><span className="eyebrow light">ПРИЕЗЖАЙТЕ</span><p>Московская область, Истра,<br/>Падиково, Полевая, 34</p><SiteLink className="text-button light-text" href="/kontakty/">Как нас найти <ArrowUpRight size={17}/></SiteLink></div><div className="footer-contact"><SiteLink href="tel:+79687809292">+7 968 780-92-92</SiteLink><SiteLink href="mailto:admin@neo-pitomnik.ru">admin@neo-pitomnik.ru</SiteLink><SiteLink href="https://t.me/Neo_Pitomnik" target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={15}/></SiteLink></div></div><div className="footer-bottom"><span>© 2026 НЭО Питомник</span><span>Старинные традиции в новых формах</span><SiteLink href="#top">Наверх <ArrowUpRight size={15}/></SiteLink></div></footer>;
}

export function PlantDescription({text}:{text:string}) {
 const paragraphs=text.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const blocks:{kind:'p'|'h'|'list';content:string[]}[]=[];
 paragraphs.forEach((p,i)=>{
  if(/^[●•]/.test(p)){const last=blocks[blocks.length-1];if(last?.kind==='list')last.content.push(p.replace(/^[●•]\s*/,''));else blocks.push({kind:'list',content:[p.replace(/^[●•]\s*/,'')]});}
  else blocks.push({kind:i>0&&p.length<75&&!/[.!?:;]$/.test(p)?'h':'p',content:[p]});
 });
 return <>{blocks.map((b,i)=>b.kind==='list'?<ul key={i}>{b.content.map((p,j)=><li key={j}>{p}</li>)}</ul>:b.kind==='h'?<h3 key={i}>{b.content[0]}</h3>:<p key={i}>{b.content[0]}</p>)}</>;
}
