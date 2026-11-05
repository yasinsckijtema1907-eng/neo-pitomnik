'use client';

import {ArrowDown, ArrowRight, ArrowUpRight, MapPin, ShoppingBag} from 'lucide-react';
import {AboutTeam} from './about-team';
import {Breadcrumbs} from './page-content';
import {SiteImage, SiteLink} from './site-elements';
import {sitePath} from './site-path';
import {novPlus} from './nov-shop-tools';
import {asset, money, productPath, type Post, type Product} from './site-types';
import original from './data/original.json';

type Consult = (goal?: string) => void;
const panels = [
 {file:'conifers', title:'Хвойные растения', href:'/product-category/hvoynye/'},
 {file:'deciduous', title:'Лиственные деревья', href:'/product-category/listvennye/'},
 {file:'flowers', title:'Цветы и кустарники', href:'/product-category/cvety-i-kustarniki/'},
 {file:'fruit', title:'Плодовые', href:'/product-category/plodovye/'},
];

function PointerArrow() {
 return <span className="nov-arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.45}/></span>;
}

export function GardenPanorama() {
 return <section className="nov-home-hero" aria-labelledby="hero-title">
   <h1 className="sr-only" id="hero-title">Новъ — питомник растений</h1>
   <nav className="nov-map" aria-label="Категории растений на панораме сада">
    {panels.map((panel,i)=>{
     const src='/assets/garden-map/'+panel.file;
     return <SiteLink className="nov-map-panel" key={panel.file} href={panel.href} aria-label={panel.title+' — открыть раздел'}>
      <SiteImage className="nov-map-photo" src={src+'.webp'} srcSet={sitePath(src+'-472.webp')+' 472w, '+sitePath(src+'.webp')+' 1207w'} sizes="(max-width: 760px) 50vw, 25vw" alt="" width={1207} height={2048} fetchPriority={i<2?'high':'auto'} decoding="async"/>
      <span className="nov-map-label">
       <span><small>0{i+1} / КАТАЛОГ</small><strong>{panel.title}</strong></span>
       <PointerArrow/>
      </span>
      <span className="nov-map-detail" aria-hidden="true">Открыть раздел</span>
     </SiteLink>;
    })}
   </nav>
   <div className="nov-map-note">
    <span><MapPin size={13} strokeWidth={1.6}/> Падиково, Московская область</span>
    <div>
     {novPlus&&<SiteLink href="#plant-picker">Подбор по задаче <ArrowDown size={15}/></SiteLink>}
     <SiteLink href="#growth">Как растёт дерево <ArrowDown size={15}/></SiteLink>
    </div>
   </div>
 </section>;
}

export function OriginalConsultation({onConsult}:{onConsult:Consult}) {
 return <section className="original-consult section-pad" aria-labelledby="consultation-heading">
  <div>
   <p className="eyebrow">КОНСУЛЬТАЦИЯ АГРОНОМА</p>
   <h2 id="consultation-heading">{original.home.consultationTitle}</h2>
   <p>{original.home.consultationText}</p>
  </div>
  <button className="button" type="button" onClick={()=>onConsult()}>
   Заказать консультацию <ArrowUpRight size={18}/>
  </button>
 </section>;
}

export function OriginalOffers({products,onAdd,home=false}:{
 products:Product[];
 onAdd:(product:Product)=>void;
 home?:boolean;
}) {
 const offers=home?original.sale.filter(offer=>original.home.offers.includes(offer.id)):original.sale;
 return <section className="original-offers section-pad" aria-labelledby="offers-heading">
   <div className="section-heading">
    <div>
     <p className="eyebrow">{original.home.offersSubtitle}</p>
     <h2 id="offers-heading">{original.home.offersTitle}</h2>
    </div>
    {home&&<SiteLink className="nov-text-link" href="/sale/">Вся распродажа <PointerArrow/></SiteLink>}
   </div>
   <div className="original-offer-grid">
    {offers.map(offer=>{
     const product=products.find(p=>p.id===offer.id);
     if(!product)return null;
     const href=productPath(product);
     return <article className="original-offer" key={product.id}>
      <SiteLink className="original-offer-photo" href={href} aria-label={product.name}>
       {product.image&&<SiteImage src={asset(product.image)!} alt="" loading="lazy"/>}
       <span className="original-discount">{offer.variable?'До ':''}−{offer.discount}%</span>
       <PointerArrow/>
      </SiteLink>
      <div className="original-offer-copy">
       <h3><SiteLink href={href}>{product.name}</SiteLink></h3>
       <p className="original-price">
        <strong>{product.priceText}</strong>
        {product.regularPrice&&<del>{money(product.regularPrice)}</del>}
       </p>
       {product.variants.length||!product.inStock?
        <SiteLink className="text-button" href={href}>Выбрать параметры <ArrowRight size={17}/></SiteLink>:
        <button className="text-button" type="button" onClick={()=>onAdd(product)} aria-label={'В корзину: '+product.name}>
         В корзину <ShoppingBag size={16}/>
        </button>}
      </div>
     </article>;
    })}
   </div>
 </section>;
}

export function NovAboutPage({onConsult}:{onConsult:Consult}) {
 const [history,approach]=original.about;
 return <>
   <div className="nov-about-top section-pad">
    <Breadcrumbs items={[{label:'О нас'}]}/>
    <SiteLink href="#team" className="text-button">Наша команда <ArrowDown size={16}/></SiteLink>
   </div>
   <figure className="nov-about-photo">
    <SiteImage src="/assets/editorial/nursery-about-1.webp" width={1920} height={541} alt="Фотография питомника «Новъ»" fetchPriority="high"/>
   </figure>
   <section className="nov-about-story section-pad" aria-labelledby="nov-about-title">
    <div><p className="eyebrow">О НАС</p><h1 id="nov-about-title">{history.title.replace(' наша',' — наша')}</h1></div>
    <p>{history.text}</p>
   </section>
   <figure className="nov-about-photo">
    <SiteImage src="/assets/editorial/nursery-about-2.webp" width={1920} height={409} alt="Команда питомника «Новъ»" loading="lazy"/>
   </figure>
   <section className="nov-about-story section-pad" aria-labelledby="nov-approach-title">
    <div>
     <p className="eyebrow">НЕО ПИТОМНИК</p>
     <h2 id="nov-approach-title">{approach.title}</h2>
     <SiteLink className="nov-text-link" href="/uslugi/">Посмотреть услуги <PointerArrow/></SiteLink>
    </div>
    <p>{approach.text.replace(/^«|»$/g,'')}</p>
   </section>
   <AboutTeam/>
   <OriginalConsultation onConsult={onConsult}/>
 </>;
}

const dateLabel = new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Moscow'});
export function NovJournal({posts}:{posts:Post[]}) {
 return <section className="nov-journal-page section-pad">
  <Breadcrumbs items={[{label:'Блог'}]}/>
  <div className="nov-journal-intro"><div><p className="eyebrow">ПИТОМНИК НОВЪ</p><h1>Блог</h1></div></div>
  <div className="nov-article-list">{posts.map(post=>{
   const href=new URL(post.sourceUrl).pathname;
   return <article key={post.id}>
    <SiteLink className="nov-article-photo" href={href} aria-label={post.title}>{post.image&&<SiteImage src={asset(post.image)!} alt=""/>}</SiteLink>
    <div>
     <p className="nov-article-date">
      <time dateTime={post.date.slice(0,10)}>{dateLabel.format(new Date(post.date.slice(0,10)))}</time>
      {post.modified&&<span>Обновлено <time dateTime={post.modified.slice(0,10)}>{dateLabel.format(new Date(post.modified.slice(0,10)))}</time></span>}
     </p>
     <h2><SiteLink href={href}>{post.title}</SiteLink></h2>
     <p>{post.excerpt}</p>
     <SiteLink className="nov-text-link" href={href}>Читать дальше <PointerArrow/></SiteLink>
    </div>
   </article>;
  })}</div>
 </section>;
}
