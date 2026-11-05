'use client';

import type {RefObject} from 'react';
import {ArrowRight, ArrowUpRight, Menu, Plus, Search, ShoppingBag, X} from 'lucide-react';
import {SiteImage, SiteLink} from './site-elements';
import {GardenPanorama, OriginalConsultation, OriginalOffers} from './nov-editorial';
import {PlantPicker} from './nov-commerce';
import {novPlus} from './nov-shop-tools';
import {GrowthExperience} from './growth-experience';
import navigation from './data/navigation.json';
import original from './data/original.json';
import type {Product, View} from './site-types';

type Consult=(goal?:string)=>void;
const links=original.navigation;
const supportLinks=[
 ['Контакты','/kontakty/'],
 ...(novPlus?[['Как заказать','/pokupatelyam/']]:[]),
];
const activePath:Partial<Record<View,string>>={
 home:'/', about:'/o-nas/', catalog:'/shop/', category:'/shop/', product:'/shop/', sale:'/sale/',
 services:'/uslugi/', service:'/uslugi/', blog:'/blog/', article:'/blog/',
};

export function PremiumHeader({view,quantity,menuOpen,setMenuOpen,scrolled,onConsult}:{
 view:View; quantity:number; menuOpen:boolean; setMenuOpen:(open:boolean)=>void; scrolled:boolean; onConsult:Consult;
}) {
 const active=activePath[view];
 return <header className={'site-header original-header'+(scrolled?' compact':'')} onKeyDown={e=>{if(e.key==='Escape')setMenuOpen(false)}}>
  <SiteLink href="#top" className="skip-link">Перейти к содержанию</SiteLink>
  <SiteLink href="/" className="brand" aria-label="НЭО Питомник — главная">
   <SiteImage className="brand-original" src="/assets/original-logo.png" width={590} height={200} alt=""/>
  </SiteLink>
  <nav className="desktop-nav" aria-label="Главная навигация">
   {links.map(([label,href])=>href==='/shop/'?
    <div className="nav-catalog" key={href}>
     <SiteLink href={href} aria-current={active===href?'page':undefined}>{label} <Plus size={11}/></SiteLink>
     <div className="mega-menu">
      <SiteLink className="mega-all" href="/shop/">Весь каталог <ArrowUpRight size={20}/></SiteLink>
      <div>{navigation.filter(g=>g.children.length).map(g=><section key={g.path}>
       <SiteLink href={g.path}>{g.name}</SiteLink>
       {g.children.map(c=><SiteLink href={c.path} key={c.path}>{c.name}</SiteLink>)}
      </section>)}</div>
      <SiteLink className="mega-sale" href="/sale/">Распродажа <ArrowRight size={16}/></SiteLink>
     </div>
    </div>:<SiteLink key={href} href={href} aria-current={active===href?'page':undefined}>{label}</SiteLink>)}
  </nav>
  <div className="header-actions">
   <SiteLink className="selection-button" href="/korzina/" aria-label={'Корзина, растений: '+quantity}>
    <ShoppingBag size={21} strokeWidth={1.5}/>{quantity>0&&<span>{quantity}</span>}
   </SiteLink>
   <SiteLink className="original-icon-link" href="/shop/#plant-search" aria-label="Поиск растений">
    <Search size={22} strokeWidth={1.5}/>
   </SiteLink>
   <button className="menu-button" type="button" aria-controls="mobile-menu" aria-expanded={menuOpen}
    aria-label={menuOpen?'Закрыть меню':'Открыть меню'} onClick={()=>setMenuOpen(!menuOpen)}>
    {menuOpen?<X size={24}/>:<Menu size={24}/>}
   </button>
  </div>
  {menuOpen&&<nav id="mobile-menu" className="mobile-nav" aria-label="Меню питомника">
   {[...links,...supportLinks].map(([label,href],i)=><SiteLink key={href} href={href} onClick={()=>setMenuOpen(false)}>
    <span>{String(i+1).padStart(2,'0')}</span>{label}<ArrowUpRight size={20}/>
   </SiteLink>)}
   <button className="button" type="button" onClick={()=>onConsult()}>Заказать консультацию <ArrowUpRight size={18}/></button>
   <SiteLink className="mobile-phone" href={original.contacts.phones[0][1]}>{original.contacts.phones[0][0]}</SiteLink>
  </nav>}
 </header>;
}

type GrowthRefs={
 growth:RefObject<HTMLElement|null>; seed:RefObject<HTMLDivElement|null>; progress:RefObject<HTMLDivElement|null>;
 trees:RefObject<(HTMLDivElement|null)[]>; growthProgress:RefObject<number>;
};
export function PremiumHome({products,onConsult,onAdd,stage,seekGrowth,growth,seed,progress,trees,growthProgress}:{
 products:Product[]; onConsult:Consult; onAdd:(product:Product)=>void;
 stage:number; seekGrowth:(stage:number,smooth?:boolean)=>void;
}&GrowthRefs) {
 return <>
  <GardenPanorama/>
  <OriginalConsultation onConsult={onConsult}/>
  <OriginalOffers products={products} onAdd={onAdd} home/>
  <GrowthExperience stage={stage} seekGrowth={seekGrowth} growth={growth} seed={seed}
   progress={progress} trees={trees} growthProgress={growthProgress}/>
  {novPlus&&<PlantPicker products={products} onConsult={onConsult}/>}
 </>;
}

export function PremiumFooter({onConsult}:{onConsult:Consult}) {
 const {address,phones,email,social}=original.contacts;
 return <footer className="premium-footer original-footer">
  <div className="footer-grid">
   <div className="original-footer-identity">
    <SiteLink href="/" aria-label="НЭО Питомник — главная">
     <SiteImage src="/assets/original-logo.png" width={590} height={200} alt="НЭО"/>
    </SiteLink>
    <p>Старинные традиции в новых формах</p>
   </div>
   <nav aria-label="Разделы сайта">
    {[...links,...supportLinks].map(([label,href])=><SiteLink key={href} href={href}>{label}</SiteLink>)}
   </nav>
   <div className="footer-address">
    <span className="eyebrow light">АДРЕС ПИТОМНИКА</span>
    <p>{address}</p>
    <SiteLink className="text-button light-text" href="/kontakty/">Как нас найти <ArrowUpRight size={16}/></SiteLink>
   </div>
   <div className="footer-contact">
    {phones.map(([label,href])=><SiteLink key={href} href={href}>{label}</SiteLink>)}
    <SiteLink href={'mailto:'+email}>{email}</SiteLink>
    <div className="original-footer-social">
     {social.map(([label,href])=><SiteLink key={href} href={href} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={14}/></SiteLink>)}
    </div>
   </div>
  </div>
  <div className="footer-bottom">
   <span>NEO-PITOMNIK.RU 2026 © Все права защищены</span>
   <button className="text-button" type="button" onClick={()=>onConsult()}>Заказать консультацию <ArrowUpRight size={15}/></button>
   <SiteLink href="#top">Наверх <ArrowUpRight size={15}/></SiteLink>
  </div>
 </footer>;
}

export function PlantDescription({text}:{text:string}) {
 const paragraphs=text.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  .split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const blocks:{kind:'p'|'h'|'list';content:string[]}[]=[];
 paragraphs.forEach((p,i)=>{
  if(/^[●•]/.test(p)){
   const last=blocks[blocks.length-1];
   if(last?.kind==='list')last.content.push(p.replace(/^[●•]\s*/,''));
   else blocks.push({kind:'list',content:[p.replace(/^[●•]\s*/,'')]});
  }else blocks.push({kind:i>0&&p.length<75&&!/[.!?:;]$/.test(p)?'h':'p',content:[p]});
 });
 return <>{blocks.map((b,i)=>b.kind==='list'?<ul key={i}>{b.content.map((p,j)=><li key={j}>{p}</li>)}</ul>:
  b.kind==='h'?<h3 key={i}>{b.content[0]}</h3>:<p key={i}>{b.content[0]}</p>)}</>;
}
