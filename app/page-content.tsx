'use client';

import {ArrowRight, ArrowUpRight, ChevronRight, Leaf, MapPin, TreePine} from 'lucide-react';
import {SiteImage, SiteLink} from './site-elements';
import navigation from './data/navigation.json';
import original from './data/original.json';
import {asset, productPath, serviceData, type Category, type Post, type Product} from './site-types';

type Crumb={label:string;href?:string};
export function Breadcrumbs({items=[]}:{items?:Crumb[]}) {
 return <nav className="breadcrumbs" aria-label="Хлебные крошки">
  <SiteLink href="/">Главная</SiteLink>
  {items.map((item,i)=><span key={i}>
   <ChevronRight size={11}/>
   {item.href?<SiteLink href={item.href}>{item.label}</SiteLink>:<span aria-current="page">{item.label}</span>}
  </span>)}
 </nav>;
}

export function PageIntro({title,eyebrow,description,items=[]}:{
 title:string;eyebrow:string;description?:string;items?:Crumb[];
}) {
 return <div className="page-intro">
  <Breadcrumbs items={items}/>
  <div>
   <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
   {description&&<p>{description}</p>}
  </div>
 </div>;
}

export function CategorySidebar({category}:{category?:Category}) {
 return <aside className="catalog-sidebar" aria-label="Категории">
  <SiteLink className={!category?'current':''} href="/shop/">Все растения <ArrowUpRight size={14}/></SiteLink>
  {navigation.map(g=><details key={g.path} open={g.name===category?.group}>
   <summary>
    <SiteLink className={category?.isGroup&&category.name===g.name?'current':''} href={g.path}>{g.name}<span>{g.count}</span></SiteLink>
    <ChevronRight size={12}/>
   </summary>
   <nav aria-label={g.name}>{g.children.map(c=><SiteLink key={c.path} className={category?.path===c.path?'current':''}
    href={c.path}>{c.name}<span>{c.count}</span></SiteLink>)}</nav>
  </details>)}
  <SiteLink className="sidebar-sale" href="/sale/">Распродажа <ArrowUpRight size={14}/></SiteLink>
 </aside>;
}

export function ServiceCards() {
 return <section className="original-services section-pad" aria-label="Услуги питомника">
  {serviceData.map((service,i)=>{
   const href='/uslugi/'+service.slug+'/';
   return <article key={service.slug}>
    <SiteLink className="original-service-photo" href={href} aria-label={service.name}>
     <SiteImage src={asset(service.image)!} alt="" loading={i===0?'eager':'lazy'}/>
    </SiteLink>
    <div>
     <p className="eyebrow">0{i+1} / УСЛУГИ</p>
     <h2><SiteLink href={href}>{service.name}</SiteLink></h2>
     <p>{service.description}</p>
     <SiteLink className="nov-text-link" href={href}>Об услуге <span className="nov-arrow"><ArrowUpRight size={19}/></span></SiteLink>
    </div>
   </article>;
  })}
 </section>;
}

export function ServiceDetail({slug,onConsult}:{slug:string;onConsult:(goal:string)=>void}) {
 const service=serviceData.find(item=>item.slug===slug)!;
 return <>
  <PageIntro title={service.name} eyebrow="УСЛУГИ ПИТОМНИКА" items={[{label:'Услуги',href:'/uslugi/'},{label:service.name}]}/>
  <section className="service-detail section-pad">
   <div className="service-detail-photo"><SiteImage src={asset(service.image)!} alt={service.name}/></div>
   <div>
    <p className="service-detail-description">{service.description}</p>
    <div className="service-request-tip"><span>Что важно рассказать</span><p>{service.prompt}</p></div>
    <button className="button" type="button" onClick={()=>onConsult(service.name)}>Оставить заявку <ArrowUpRight size={18}/></button>
   </div>
  </section>
 </>;
}

export function Article({post,onConsult}:{post:Post;onConsult:(goal:string)=>void}) {
 return <>
  <PageIntro title={post.title} eyebrow="БЛОГ ПИТОМНИКА" items={[{label:'Блог',href:'/blog/'},{label:post.title}]}/>
  <article className="article-layout section-pad">
   <div className="article-content">
    {post.image&&<SiteImage className="original-article-cover" src={asset(post.image)!} alt=""/>}
    {post.blocks.map((block,i)=>{
     if(block.type==='ul'||block.type==='ol'){
      const List=block.type;
      return <List key={i}>{block.items?.map((item,j)=><li key={j}>{item}</li>)}</List>;
     }
     const Tag=block.type==='h2'||block.type==='h3'||block.type==='blockquote'?block.type:'p';
     return <Tag key={i}>{block.text}</Tag>;
    })}
    <SiteLink className="text-button" href="/blog/">Все статьи <ArrowRight size={16}/></SiteLink>
   </div>
   <aside className="article-aside">
    <TreePine size={34} strokeWidth={1}/>
    <h3>Туи для живой изгороди</h3>
    <SiteLink className="button" href="/product-category/hvoynye/tui-hvoynye/">Посмотреть туи <ArrowUpRight size={16}/></SiteLink>
    <button className="text-button" type="button" onClick={()=>onConsult('Растения для живой изгороди')}>
     Помощь агронома <ArrowRight size={15}/>
    </button>
   </aside>
  </article>
 </>;
}

export function ContactLocation() {
 return <section className="contact-location section-pad">
  <div>
   <p className="eyebrow">КАК НАС НАЙТИ</p>
   <h2>Питомник в Падиково</h2>
   <p><MapPin size={18}/> {original.contacts.address}</p>
   <SiteLink className="button" href="https://yandex.ru/maps/?text=Московская%20область%20Падиково%20Полевая%2034" target="_blank" rel="noreferrer">
    Построить маршрут <ArrowUpRight size={18}/>
   </SiteLink>
  </div>
  <SiteImage src="/assets/editorial/nursery-about-1.webp" alt="Питомник НЭО в Падиково"/>
 </section>;
}

export function ProductRecommendations({products,title='Растения из этого раздела'}:{products:Product[];title?:string}) {
 if(!products.length)return null;
 return <section className="recommendations section-pad">
  <div className="section-heading"><h2>{title}</h2><SiteLink className="text-button" href="/shop/">Весь каталог <ArrowUpRight size={17}/></SiteLink></div>
  <div className="recommendation-grid">{products.map(p=><SiteLink key={p.id} href={productPath(p)}>
   <div>{p.image?<SiteImage src={asset(p.image)!} alt={p.name} loading="lazy"/>:<Leaf size={55} strokeWidth={1}/>}</div>
   <h3>{p.name}</h3><span>{p.priceText} <ArrowUpRight size={15}/></span>
  </SiteLink>)}</div>
 </section>;
}
