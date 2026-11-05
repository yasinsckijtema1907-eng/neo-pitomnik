'use client';

import type {RefObject} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Download,Leaf,MapPin,Plus,Truck,X} from 'lucide-react';
import {PageIntro} from './page-content';
import {SiteImage,SiteLink} from './site-elements';
import {asset,catalogPagePath,money,type Product} from './site-types';
import {deliveryGoal,fitsPurpose,lowestPrice,matchingOptions,novPlus,purposes,isPurpose,type Purpose} from './nov-shop-tools';
import original from './data/original.json';

type Consult = (goal?:string)=>void;

export function PlantPicker({products,onConsult}:{products:Product[];onConsult:Consult}) {
 return <section className="nov-picker section-pad" id="plant-picker" aria-labelledby="picker-title">
  <div className="nov-picker-intro">
   <p className="eyebrow">ПОДБОР ПО ЗАДАЧЕ</p><h2 id="picker-title">Что хотите<br/><em>посадить?</em></h2>
   <p>Начните с идеи. Мы собрали подходящие растения из каталога, чтобы вам было проще сравнить сорта и цены.</p>
   <div className="nov-picker-actions">
    <button className="text-button" type="button" onClick={()=>onConsult()}>Обсудить с агрономом <ArrowUpRight size={17}/></button>
    <SiteLink className="text-button" href="/pokupatelyam/">Как заказать <ArrowRight size={17}/></SiteLink>
   </div>
  </div>
  <div className="nov-picker-choices">{purposes.map(p=>{
   const matches=products.filter(product=>fitsPurpose(product,p.id));
   const price=lowestPrice(matches);
   return <SiteLink key={p.id} className="nov-picker-choice" href={'/shop/?purpose='+p.id+'#catalog'}>
    <SiteImage src={p.image} alt="" loading="lazy" width={95} height={82}/>
    <span><strong>{p.title}</strong><small>{p.description}</small></span>
    <span className="nov-picker-price">{price!==null?'от '+money(price):'Цена по запросу'}</span>
    <span className="nov-arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.45}/></span>
   </SiteLink>;
  })}</div>
 </section>;
}

export type CatalogFilters={
 height:string; container:string; minimum:string; budget:string; size:string; purpose:Purpose|'';
};
export const initialCatalogFilters:CatalogFilters={height:'',container:'',minimum:'',budget:'',size:'',purpose:''};

export function CatalogTools({filters,sizes,onChange,onClear}:{
 filters:CatalogFilters; sizes:string[];
 onChange:(filters:CatalogFilters)=>void; onClear:()=>void;
}) {
 const {height,container,minimum,budget,size,purpose}=filters;
 return <div className="nov-catalog-tools">
  <div className="original-filter-fields">
   <label>Высота<select value={height} onChange={e=>onChange({...filters,height:e.target.value})}>
    <option value="">Любая высота</option>{original.filters.height.map(value=><option key={value}>{value}</option>)}
   </select></label>
   <label>Объём контейнера<select value={container} onChange={e=>onChange({...filters,container:e.target.value})}>
    <option value="">Любой контейнер</option>{original.filters.container.map(value=><option key={value}>{value}</option>)}
   </select></label>
   <fieldset>
    <legend>Цена, ₽</legend>
    <div>
     <input type="number" inputMode="numeric" min={0} step="any" placeholder="От" aria-label="Цена от, ₽"
      value={minimum} onChange={e=>onChange({...filters,minimum:e.target.value})}/>
     <input type="number" inputMode="numeric" min={0} step="any" placeholder="До" aria-label="Цена до, ₽"
      value={budget} onChange={e=>onChange({...filters,budget:e.target.value})}/>
    </div>
   </fieldset>
  </div>
  {novPlus&&<div className="original-filter-fields original-filter-plus">
   <label>Задача<select value={purpose} onChange={e=>onChange({...filters,purpose:isPurpose(e.target.value)?e.target.value:''})}>
    <option value="">Любая задача</option>{purposes.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
   </select></label>
   <label>Размер из каталога<select value={size} onChange={e=>onChange({...filters,size:e.target.value})}>
    <option value="">Любой размер</option>{sizes.map(value=><option key={value}>{value}</option>)}
   </select></label>
  </div>}
  {(Object.values(filters).some(Boolean)||novPlus)&&<div className="nov-filter-actions">
   {Object.values(filters).some(Boolean)&&<button className="text-button" type="button" onClick={onClear}>Сбросить фильтры <X size={14}/></button>}
   {novPlus&&<SiteLink className="text-button" href="/price-list.csv" download="nov-pitomnik-price.csv">Скачать прайс <Download size={16}/></SiteLink>}
  </div>}
 </div>;
}

export function CatalogPager({page,pages,staticLinks,onPage}:{
 page:number;pages:number;staticLinks:boolean;onPage:(page:number)=>void;
}) {
 const visible=Array.from({length:pages},(_,i)=>i+1).filter(n=>n===1||n===pages||Math.abs(n-page)<=1);
 const control=(n:number,label:string,child:React.ReactNode)=>staticLinks?
  <SiteLink aria-label={label} aria-current={n===page?'page':undefined} href={catalogPagePath(n)+'#catalog-results'}>{child}</SiteLink>:
  <button type="button" aria-label={label} aria-current={n===page?'page':undefined} onClick={()=>onPage(n)}>{child}</button>;
 return <nav className="original-pagination" aria-label="Страницы каталога">
  {page>1&&control(page-1,'Предыдущая страница',<ArrowLeft size={18}/>)}
  {visible.map((n,i)=><span key={n}>
   {i>0&&n>visible[i-1]+1&&<span aria-hidden="true">…</span>}
   {control(n,'Страница '+n,n)}
  </span>)}
  {page<pages&&control(page+1,'Следующая страница',<ArrowRight size={18}/>)}
 </nav>;
}

type PreviewProps={
 dialog:RefObject<HTMLDialogElement|null>; product:Product|null; variantId:number|null;
 budget:string;minimum:string;size:string;onVariant:(id:number|null)=>void;onAdd:(p:Product)=>void;onConsult:Consult;
};
export function ProductPreview({dialog,product,variantId,budget,minimum,size,onVariant,onAdd,onConsult}:PreviewProps) {
 const options=product?matchingOptions(product,budget,size,minimum):[];
 const variants=product?.variants.filter(v=>options.some(o=>o.variantId===v.id))||[];
 const variant=variants.find(v=>v.id===variantId);
 const price=product&&(budget||size||minimum)?lowestPrice([product],budget,size,minimum):null;
 return <dialog ref={dialog} className="form-dialog nov-preview-dialog" aria-label="Быстрый просмотр растения" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
  <button type="button" className="dialog-close" aria-label="Закрыть быстрый просмотр" onClick={()=>dialog.current?.close()}><X size={24}/></button>
  {product&&<div className="nov-preview-grid">
   {product.image?<SiteImage src={asset(product.image)!} alt={product.name}/>:<div className="plant-placeholder"><Leaf size={48}/><span>Фото уточним в питомнике</span></div>}
   <div>
    <p className="eyebrow">{product.category}</p><h2>{product.name}</h2>
    <p className="nov-preview-price">{variant?variant.price===null?'Цена по запросу':money(variant.price):price!==null?'от '+money(price):product.priceText||'Цена по запросу'}</p>
    {variants.length>0&&<label className="field"><span>Размер / вариант растения</span><select value={variantId??''} onChange={e=>onVariant(e.target.value?Number(e.target.value):null)}><option value="">Выберите вариант</option>{variants.map(v=><option key={v.id} value={v.id}>{v.label} · {v.price===null?'цена по запросу':money(v.price)}</option>)}</select></label>}
    <p className="fine-print">Наличие и итоговую стоимость уточним при согласовании заявки.</p>
    <button type="button" className="button full" disabled={product.variants.length>0&&!variant} onClick={()=>onAdd(product)}>Добавить в заявку <Plus size={19}/></button>
    <div className="nov-preview-actions"><SiteLink className="text-button" href={new URL(product.url).pathname}>Карточка растения <ArrowUpRight size={16}/></SiteLink><button className="text-button" type="button" onClick={()=>onConsult('Вопрос о растении: '+product.name)}>Задать вопрос <ArrowRight size={15}/></button></div>
   </div>
  </div>}
 </dialog>;
}

const purchaseSteps=[
 ['Выберите растения','Откройте каталог, укажите нужный размер и добавьте растения в заявку. Если не знаете, что подойдёт, начните с консультации.'],
 ['Подготовьте заявку','Укажите контакт и коротко опишите задачу. Сайт подготовит письмо с выбранными позициями. Отправьте его из своей почты.'],
 ['Согласуйте детали','Менеджер уточнит наличие, размеры и стоимость. Обсудите, как получить растения и нужна ли помощь с посадкой.'],
];
const questions=[
 ['Как узнать, есть ли нужный размер?','Откройте карточку растения и посмотрите варианты. Текущее наличие и итоговую цену уточнит менеджер по вашей заявке.'],
 ['Что нужно для расчёта доставки и посадки?','Укажите населённый пункт, растения и количество. Если нужна посадка, добавьте эту информацию и сообщите, есть ли ограничения для подъезда к участку.'],
 ['Можно приехать посмотреть растения?','Питомник находится в Падиково, на Полевой улице, 34. Перед визитом позвоните, чтобы уточнить время и наличие нужных растений.'],
 ['Что делать, если я ещё не выбрал растения?','Расскажите агроному о вашем участке, освещении, желаемых посадках и бюджете. Можно начать с подборок для изгороди, цветущих композиций и плодового сада.'],
];

export function BuyerGuide({onConsult}:{onConsult:Consult}) {
 return <>
  <PageIntro title="От выбора до посадки." eyebrow="КАК ЗАКАЗАТЬ" description="Выберите растения, подготовьте заявку и уточните у питомника наличие и условия получения." items={[{label:'Как заказать'}]}/>
  <section className="nov-order section-pad" aria-labelledby="order-steps">
   <h2 id="order-steps">Три шага <em>к вашему саду.</em></h2>
   <ol>{purchaseSteps.map(([title,copy],i)=><li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
   <div className="nov-order-links"><SiteLink className="button" href="/shop/">Перейти в каталог <ArrowUpRight size={18}/></SiteLink><SiteLink className="text-button" href="/price-list.csv" download="nov-pitomnik-price.csv">Скачать прайс <Download size={18}/></SiteLink></div>
  </section>
  <section className="nov-delivery section-pad" id="delivery" aria-labelledby="delivery-title">
   <div><p className="eyebrow">ПОЛУЧЕНИЕ РАСТЕНИЙ</p><h2 id="delivery-title">Приехать<br/><em>или заказать доставку.</em></h2></div>
   <div className="nov-delivery-options">
    <article><MapPin size={27} strokeWidth={1.4}/><h3>Визит в питомник</h3><p>Московская область, Истра, деревня Падиково, Полевая, 34. Позвоните перед поездкой, чтобы уточнить наличие.</p><SiteLink className="text-button" href="/kontakty/">Контакты и маршрут <ArrowUpRight size={16}/></SiteLink></article>
    <article><Truck size={27} strokeWidth={1.4}/><h3>Доставка и посадка</h3><p>Расскажите, куда привезти растения, сколько их и нужна ли посадка. Сроки и стоимость согласует менеджер.</p><button type="button" className="text-button" onClick={()=>onConsult(deliveryGoal)}>Запросить расчёт <ArrowUpRight size={16}/></button></article>
   </div>
  </section>
  <section className="nov-faq section-pad" aria-labelledby="faq-title">
   <div><p className="eyebrow">ВОПРОСЫ ПОКУПАТЕЛЕЙ</p><h2 id="faq-title">Частые <em>вопросы.</em></h2></div>
   <div>{questions.map(([question,answer])=><details key={question}><summary>{question}<Plus size={19} aria-hidden="true"/></summary><p>{answer}</p></details>)}</div>
  </section>
 </>;
}
