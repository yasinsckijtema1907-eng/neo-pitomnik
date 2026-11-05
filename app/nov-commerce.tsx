'use client';

import type {RefObject} from 'react';
import {ArrowRight,ArrowUpRight,Download,Leaf,MapPin,Plus,Truck,X} from 'lucide-react';
import {PageIntro} from './page-content';
import {SiteImage,SiteLink} from './site-elements';
import {asset,money,type Product} from './site-types';
import {deliveryGoal,fitsPurpose,lowestPrice,matchingOptions,purposes,isPurpose,type Purpose} from './nov-shop-tools';

type Consult = (goal?:string)=>void;

export function PlantPicker({products,onConsult}:{products:Product[];onConsult:Consult}) {
 return <section className="nov-picker section-pad" id="plant-picker" aria-labelledby="picker-title">
  <div className="nov-picker-intro">
   <p className="eyebrow">ПОДБОР ПО ЗАДАЧЕ</p><h2 id="picker-title">Что хотите<br/><em>посадить?</em></h2>
   <p>Начните с идеи. Мы собрали подходящие растения из каталога, чтобы вам было проще сравнить сорта и цены.</p>
   <button className="text-button" type="button" onClick={()=>onConsult()}>Обсудить с агрономом <ArrowUpRight size={17}/></button>
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

type CatalogToolsProps={
 purpose:Purpose|'';
 budget:string;
 size:string;
 sizes:string[];
 onPurpose:(value:Purpose|'')=>void;
 onBudget:(value:string)=>void;
 onSize:(value:string)=>void;
 onClear:()=>void;
};
export function CatalogTools({purpose,budget,size,sizes,onPurpose,onBudget,onSize,onClear}:CatalogToolsProps) {
 return <div className="nov-catalog-tools">
  <div className="nov-filter-fields">
   <label><span>Задача</span><select value={purpose} onChange={e=>onPurpose(isPurpose(e.target.value)?e.target.value:'')}><option value="">Любая задача</option>{purposes.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
   <label><span>Цена за растение</span><select value={budget} onChange={e=>onBudget(e.target.value)}><option value="">Любая цена</option>{[5000,10000,25000,50000,100000].map(value=><option key={value} value={value}>До {money(value)}</option>)}</select></label>
   <label><span>Размер из каталога</span><select value={size} onChange={e=>onSize(e.target.value)}><option value="">Любой размер</option>{sizes.map(value=><option key={value}>{value}</option>)}</select></label>
  </div>
  <div className="nov-filter-actions">
   {(purpose||budget||size)&&<button className="text-button" type="button" onClick={onClear}>Сбросить фильтры <X size={14}/></button>}
   <SiteLink className="text-button" href="/price-list.csv" download="nov-pitomnik-price.csv">Скачать прайс <Download size={16}/></SiteLink>
  </div>
 </div>;
}

type PreviewProps={
 dialog:RefObject<HTMLDialogElement|null>; product:Product|null; variantId:number|null;
 budget:string;size:string;onVariant:(id:number|null)=>void;onAdd:(p:Product)=>void;onConsult:Consult;
};
export function ProductPreview({dialog,product,variantId,budget,size,onVariant,onAdd,onConsult}:PreviewProps) {
 const options=product?matchingOptions(product,budget,size):[];
 const variants=product?.variants.filter(v=>options.some(o=>o.variantId===v.id))||[];
 const variant=variants.find(v=>v.id===variantId);
 const price=product&&(budget||size)?lowestPrice([product],budget,size):null;
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
