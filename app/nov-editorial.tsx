'use client';

import {ArrowDown,ArrowRight,ArrowUpRight,MapPin,Sprout} from 'lucide-react';
import {AboutTeam} from './about-team';
import {Breadcrumbs} from './page-content';
import {SiteImage,SiteLink} from './site-elements';
import {sitePath} from './site-path';
import {novPlus} from './nov-shop-tools';
import {asset,type Post} from './site-types';

type Consult = (goal?: string) => void;
const panels = [
 {file:'conifers', title:'Хвойные', detail:'Ели, сосны, туи и можжевельники', href:'/product-category/hvoynye/'},
 {file:'deciduous', title:'Лиственные деревья', detail:'Деревья с выразительной кроной', href:'/product-category/listvennye/'},
 {file:'flowers', title:'Цветы и кустарники', detail:'Растения для цветущих композиций', href:'/product-category/cvety-i-kustarniki/'},
 {file:'fruit', title:'Плодовые', detail:'Деревья и кустарники для урожая', href:'/product-category/plodovye/'},
] as const;

function PointerArrow({diagonal=false}:{diagonal?:boolean}) {
 const Arrow=diagonal?ArrowUpRight:ArrowRight;
 return <span className="nov-arrow" aria-hidden="true"><Arrow size={20} strokeWidth={1.45}/></span>;
}

export function GardenPanorama({onConsult}:{onConsult:Consult}) {
 return <section className="nov-home-hero" aria-labelledby="hero-title">
   <div className="nov-hero-intro">
    <div>
     <p className="eyebrow nov-location"><MapPin size={14} strokeWidth={1.5}/> ПАДИКОВО, МОСКОВСКАЯ ОБЛАСТЬ</p>
     <h1 id="hero-title">Сад начинается<br/>{' '}<em>с растения.</em></h1>
    </div>
    <div className="nov-hero-copy">
     <p>Выращиваем растения в собственном питомнике. Поможем выбрать их для вашего участка и позаботимся о посадке.</p>
     <div><SiteLink className="button" href="/shop/">Смотреть каталог <ArrowUpRight size={18}/></SiteLink><button className="text-button" type="button" onClick={()=>onConsult()}>Совет агронома <ArrowRight size={16}/></button></div>
    </div>
   </div>
   <nav className="nov-map" aria-label="Категории растений на панораме сада">
    {panels.map((panel,i)=>{
     const src='/assets/garden-map/'+panel.file;
     return <SiteLink className="nov-map-panel" key={panel.file} href={panel.href} aria-label={panel.title+' — открыть раздел'}>
      <SiteImage className="nov-map-photo" src={src+'.webp'} srcSet={sitePath(src+'-472.webp')+' 472w, '+sitePath(src+'.webp')+' 1207w'} sizes="(max-width: 760px) 47vw, (min-width: 1920px) 440px, 23vw" alt="" width={1207} height={2048} fetchPriority={i<2?'high':'auto'} decoding="async"/>
      <span className="nov-map-detail">{panel.detail}</span>
      <span className="nov-map-label"><span><small>0{i+1} / КОЛЛЕКЦИЯ</small><strong>{panel.title}</strong></span><PointerArrow diagonal/></span>
     </SiteLink>;
    })}
   </nav>
   <div className="nov-map-note"><span>Выберите раздел на фотографии</span><div>{novPlus&&<SiteLink href="#plant-picker">Подбор по задаче <ArrowDown size={15}/></SiteLink>}<SiteLink href="#growth">Как растёт дерево <ArrowDown size={15}/></SiteLink></div></div>
 </section>;
}

export function NurseryTeaser() {
 return <section className="nov-nursery section-pad" id="nursery" aria-labelledby="nov-nursery-heading">
   <figure className="nov-nursery-photo">
    <SiteImage src="/assets/editorial/nursery-about-1.webp" alt="Сотрудник питомника среди растений" width={1920} height={541} loading="lazy"/>
    <figcaption><MapPin size={14}/> Питомник в Падиково</figcaption>
   </figure>
   <div>
    <p className="eyebrow">ПИТОМНИК / ЛЮДИ И РАСТЕНИЯ</p>
    <h2 id="nov-nursery-heading">Здесь растёт<br/><em>ваш будущий сад.</em></h2>
    <p>За каждым растением — работа команды. Мы выращиваем посадочный материал, помогаем выбрать размер и подбираем растения под условия участка.</p>
    <SiteLink className="nov-text-link" href="/o-nas/">Познакомиться с питомником <PointerArrow/></SiteLink>
   </div>
 </section>;
}

export function NovAboutPage({onConsult}:{onConsult:Consult}) {
 return <>
   <section className="nov-about-hero section-pad" aria-labelledby="nov-about-title">
    <Breadcrumbs items={[{label:'Питомник'}]}/>
    <div className="nov-about-intro">
     <div><p className="eyebrow">О ПИТОМНИКЕ</p><h1 id="nov-about-title">От своих полей —<br/>{' '}<em>до вашего сада.</em></h1></div>
     <div><p>Мы выращиваем растения и помогаем с каждым следующим шагом: от выбора саженца до посадки и ухода за садом.</p><SiteLink href="/kontakty/" className="button">Приехать в питомник <ArrowUpRight size={19}/></SiteLink><SiteLink href="#team" className="text-button">Наша команда <ArrowDown size={16}/></SiteLink></div>
    </div>
    <figure className="nov-about-photo"><SiteImage src="/assets/editorial/nursery-about-1.webp" width={1920} height={541} alt="Питомник растений НЭО в Падиково" fetchPriority="high"/><figcaption><span>01 / СОБСТВЕННЫЙ ПИТОМНИК</span><span>ИСТРА · ПАДИКОВО</span></figcaption></figure>
   </section>
   <section className="nov-history section-pad" aria-labelledby="nov-history-title">
    <div><p className="eyebrow">НАШИ КОРНИ</p><h2 id="nov-history-title">С десяти соток<br/><em>началась история.</em></h2></div>
    <div><p>Первым питомником стал небольшой семейный участок в Смоленской области. Основатель вырос в семье фермера и с детства знал, сколько внимания требует работа с землёй.</p><p>Сегодня у питомника собственные поля и команда: менеджеры, ландшафтные дизайнеры и агроном-фитопатолог. Мы помогаем выбрать растения и собрать из них сад, который подходит вашему участку.</p></div>
   </section>
   <AboutTeam/>
   <section className="nov-nursery-outro section-pad">
    <Sprout size={35} strokeWidth={1.1} aria-hidden="true"/>
    <div><p className="eyebrow">С ЧЕГО НАЧАТЬ</p><h2>Расскажите <em>о вашем участке.</em></h2><p>Задайте вопрос агроному или посмотрите, чем команда может помочь с посадкой и уходом.</p></div>
    <div><button className="button" type="button" onClick={()=>onConsult('Подбор растений')}>Подобрать растения <ArrowUpRight size={18}/></button><SiteLink className="text-button" href="/uslugi/">Услуги питомника <ArrowRight size={16}/></SiteLink></div>
   </section>
 </>;
}

export function NovJournalFeature() {
 return <section className="nov-journal-feature section-pad" aria-labelledby="nov-journal-feature-title">
  <div><p className="eyebrow">ЖУРНАЛ ПИТОМНИКА</p><h2 id="nov-journal-feature-title">Чтобы сад<br/><em>радовал дольше.</em></h2><SiteLink className="nov-text-link" href="/blog/">Читать журнал <PointerArrow/></SiteLink></div>
  <SiteLink className="nov-journal-card" href="/blog/kak-vybrat-tuyu-dlya-zhivoy-izgorodi/">
   <SiteImage src="/assets/editorial/blog-267.webp" alt="" loading="lazy"/>
   <span><small>ВЫБОР РАСТЕНИЙ</small><strong>Как выбрать тую для живой изгороди?</strong><PointerArrow diagonal/></span>
  </SiteLink>
 </section>;
}

export function NovJournal({posts}:{posts:Post[]}) {
 return <section className="nov-journal-page section-pad">
  <Breadcrumbs items={[{label:'Журнал'}]}/>
  <div className="nov-journal-intro"><div><p className="eyebrow">СОВЕТЫ ПИТОМНИКА</p><h1>Журнал <em>о саде.</em></h1></div><p>Как выбрать растения для своего участка и на что обратить внимание перед посадкой.</p></div>
  <div className="nov-article-list">{posts.map(post=><article key={post.id}>
   <SiteLink className="nov-article-photo" href={'/blog/'+post.slug+'/'} aria-label={post.title}>{post.image&&<SiteImage src={asset(post.image)!} alt=""/>}</SiteLink>
   <div><p className="eyebrow">ВЫБОР РАСТЕНИЙ</p><h2><SiteLink href={'/blog/'+post.slug+'/'}>{post.title}</SiteLink></h2><p>{post.blocks.find(b=>b.type==='p')?.text||post.excerpt}</p><SiteLink className="nov-text-link" href={'/blog/'+post.slug+'/'}>Читать статью <PointerArrow/></SiteLink></div>
  </article>)}</div>
 </section>;
}
