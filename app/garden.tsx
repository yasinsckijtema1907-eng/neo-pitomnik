'use client';
import {SiteLink,SiteImage} from './site-elements';
import {sitePath} from './site-path';
import {NovAboutPage,NovJournal,OriginalConsultation,OriginalOffers} from './nov-editorial';
import {BuyerGuide,CatalogPager,CatalogTools,initialCatalogFilters,ProductPreview,type CatalogFilters} from './nov-commerce';
import {catalogOptions,deliveryGoal,fitsPurpose,isPurpose,lowestPrice,matchingOptions,novPlus} from './nov-shop-tools';
import {PremiumHeader,PremiumHome,PremiumFooter,PlantDescription} from './premium-experience';
import {useState,useEffect,useRef,useMemo} from 'react';
import {flushSync} from 'react-dom';
import navigation from './data/navigation.json';
import original from './data/original.json';
import {asset,catalogPageSize,money,productPath,serviceData,type Catalog,type Product,type SiteProps} from './site-types';
import {Breadcrumbs,PageIntro,CategorySidebar,ServiceCards,ServiceDetail,Article,ContactLocation,ProductRecommendations} from './page-content';
import {ArrowUpRight,ArrowRight,Search,Plus,Minus,X,Leaf,Phone,Mail,Check,ChevronDown,ShoppingBag} from 'lucide-react';
type Item={key:string;id:number;variantId:number|null;name:string;size:string;quantity:number;price:number|null;image:string|null};
const plain=(s:string)=>s?.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim()||'';
const shortDescription=(s:string)=>{const paragraphs=plain(s).split(/\n\s*\n/);return (paragraphs.find(p=>p.length>90)||paragraphs[0]||'').split(/(?<=[.!?])\s+/).slice(0,2).join(' ')};
const plural=(n:number,one:string,few:string,many:string)=>n%10===1&&n%100!==11?one:n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?few:many;

export default function Garden({view='home',initialCatalog,category,product,posts=[],post,serviceSlug,catalogPage=1}:SiteProps){
 const isHome=view==='home',isCatalog=view==='catalog'||view==='category';

 const [catalog,setCatalog]=useState<Catalog|null>(initialCatalog||null),[loadError,setLoadError]=useState(false);
 const [query,setQuery]=useState(''),[sort,setSort]=useState('source'),[page,setPage]=useState(catalogPage);
 const [filters,setFilters]=useState(initialCatalogFilters);
 const [menuOpen,setMenuOpen]=useState(false),[items,setItems]=useState<Item[]>([]),[loadedSaved,setLoadedSaved]=useState(false);
 const [selected,setSelected]=useState<Product|null>(product||null),[variantId,setVariantId]=useState<number|null>(null),[galleryIndex,setGalleryIndex]=useState(0);
 const [formGoal,setFormGoal]=useState('Подбор растений'),[submitted,setSubmitted]=useState(''),[sending,setSending]=useState(false),[formError,setFormError]=useState('');
 const [requestDraft,setRequestDraft]=useState('');
 const [toast,setToast]=useState(''),[stage,setStage]=useState(0),[scrolled,setScrolled]=useState(false);
 const productDialog=useRef<HTMLDialogElement>(null),listDialog=useRef<HTMLDialogElement>(null),formDialog=useRef<HTMLDialogElement>(null);
 const growthProgress=useRef(0);
 const growth=useRef<HTMLElement>(null),seed=useRef<HTMLDivElement>(null),progress=useRef<HTMLDivElement>(null),trees=useRef<(HTMLDivElement|null)[]>([]);
 const reduced=useRef(false),requestId=useRef(''),toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{
  const controller=new AbortController();if(!initialCatalog)fetch(sitePath('/catalog.json'),{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>setCatalog(data as Catalog)).catch(e=>{if(e.name!=='AbortError')setLoadError(true)});
  try{const saved=JSON.parse(localStorage.getItem('neo-garden-selection')||'[]');if(Array.isArray(saved))setItems(saved.filter(x=>x&&typeof x.id==='number'&&typeof x.key==='string'&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=1000).slice(0,50));}catch{}
  setLoadedSaved(true);return()=>{controller.abort();if(toastTimer.current)clearTimeout(toastTimer.current)};
 },[]);
 useEffect(()=>{if(loadedSaved)try{localStorage.setItem('neo-garden-selection',JSON.stringify(items))}catch{}},[items,loadedSaved]);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let pending=false,lastStage=-1;
  function update(){pending=false;reduced.current=media.matches;setScrolled(window.scrollY>24);const section=growth.current;if(!section)return;
   const headerHeight=window.innerWidth<=760?72:84;const max=Math.max(1,section.offsetHeight-window.innerHeight+headerHeight),p=media.matches?1:Math.max(0,Math.min(1,(window.scrollY-section.offsetTop+headerHeight)/max));
   growthProgress.current=p;
   const step=p<.21?0:p<.47?1:p<.74?2:3;if(step!==lastStage){lastStage=step;setStage(step)}
   if(progress.current)progress.current.style.transform=`scaleX(${Math.max(.005,p)})`;
   if(seed.current){seed.current.style.opacity=String(Math.max(0,Math.min(1,(.25-p)/.10)));seed.current.style.transform=media.matches?'none':`translateY(${-90*(1-Math.min(1,p/.16))}px) rotate(${-25*(1-Math.min(1,p/.16))}deg)`;}
   const fades=[Math.max(0,Math.min(1,(p-.18)/.10))*Math.max(0,Math.min(1,(.51-p)/.10)),Math.max(0,Math.min(1,(p-.42)/.10))*Math.max(0,Math.min(1,(.78-p)/.10)),Math.max(0,Math.min(1,(p-.68)/.13))];
   trees.current.forEach((el,i)=>{if(el){el.style.opacity=String(fades[i]);el.style.transform=media.matches?'none':`translateY(${10*(1-fades[i])}px) scale(${.95+.05*fades[i]})`;}});
  }
  const onScroll=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);media.addEventListener('change',onScroll);update();
  return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);media.removeEventListener('change',onScroll)};
 },[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>{x.classList.add('reveal-ready');observer.observe(x)});return()=>observer.disconnect()},[catalog,view]);
 function showToast(text:string){setToast(text);if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3000)}
 function openForm(goal='Подбор растений'){listDialog.current?.close();productDialog.current?.close();flushSync(()=>{setFormGoal(goal);setSubmitted('');setFormError('');setMenuOpen(false)});requestId.current=crypto.randomUUID();formDialog.current?.showModal()}
 function openProduct(p:Product){flushSync(()=>{setSelected(p);setVariantId(null);setGalleryIndex(0)});productDialog.current?.showModal()}
 useEffect(()=>{
  if(!isCatalog)return;
  if(window.location.hash==='#plant-search')document.getElementById('plant-search')?.focus({preventScroll:true});
  if(!novPlus)return;
  const value=new URLSearchParams(window.location.search).get('purpose');
  if(isPurpose(value))setFilters({...initialCatalogFilters,purpose:value});
 },[isCatalog]);
 const products=useMemo(()=>catalog?.products||[],[catalog]);
 const catalogScope=useMemo(()=>category?
  products.filter(p=>p.group===category.group&&(category.isGroup||p.categories?.includes(category.name))):products,
 [products,category]);
 const sizes=useMemo(()=>novPlus&&isCatalog?[...new Set(catalogScope.flatMap(p=>catalogOptions(p).flatMap(o=>o.sizes)))].sort((a,b)=>a.localeCompare(b,'ru',{numeric:true})):[],[catalogScope,isCatalog]);
 const {height,container,minimum,budget,size,purpose}=filters;
 const hasPriceOrSize=Boolean(budget||minimum||size);
 function catalogPrice(p:Product){return hasPriceOrSize?lowestPrice([p],budget,size,minimum):p.price}
 const filtered=useMemo(()=>{
  if(!isCatalog)return [];
  const q=query.toLowerCase().replace(/ё/g,'е').trim();
  const term=(p:Product,name:string,value:string)=>!value||p.attributes?.some(a=>a.name===name&&a.values.includes(value));
  const list=catalogScope.filter(p=>
   term(p,'Высота',height)&&term(p,'Объём контейнера',container)&&fitsPurpose(p,purpose)&&
   (!hasPriceOrSize||matchingOptions(p,budget,size,minimum).length>0)&&
   (p.name+' '+p.category).toLowerCase().replace(/ё/g,'е').includes(q));
  if(sort==='price-asc')list.sort((a,b)=>(catalogPrice(a)??Infinity)-(catalogPrice(b)??Infinity));
  else if(sort==='price-desc')list.sort((a,b)=>(catalogPrice(b)??-1)-(catalogPrice(a)??-1));
  else if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  return list;
 },[isCatalog,catalogScope,query,sort,height,container,purpose,budget,size,minimum,hasPriceOrSize]);
 const activeFilters=Boolean(query.trim())||Object.values(filters).some(Boolean);
 const pageCount=Math.max(1,Math.ceil(filtered.length/catalogPageSize));
 const shownPage=Math.min(page,pageCount);
 const pageOffset=(shownPage-1)*catalogPageSize;
 const shownProducts=filtered.slice(pageOffset,pageOffset+catalogPageSize);
 function changeCatalogFilters(next:CatalogFilters){
  setFilters(next);
  setPage(1);
  if(next.purpose===purpose)return;
  const url=new URL(window.location.href);
  if(next.purpose)url.searchParams.set('purpose',next.purpose);
  else url.searchParams.delete('purpose');
  window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
 }
 function priceLabel(p:Product){
  const price=catalogPrice(p);
  if(price===null)return 'Цена по запросу';
  return hasPriceOrSize?(p.variants.length?'от ':'')+money(price):p.priceText||money(price);
 }
 function addProduct(p:Product){if(items.length>=50){showToast('В заявке можно выбрать до 50 разных позиций');return}const v=p.variants.find(v=>v.id===variantId);if(p.variants.length&&!v){showToast('Сначала выберите размер растения');return}const key=p.id+':'+(v?.id||''),size=v?.label||p.attributes?.map(a=>a.values?.join(', ')).filter(Boolean).join(' · ')||'';setItems(old=>{if(old.find(x=>x.key===key))return old.map(x=>x.key===key?{...x,quantity:Math.min(1000,x.quantity+1)}:x);if(old.length>=50)return old;return [...old,{key,id:p.id,variantId:v?.id||null,name:p.name,size,quantity:1,price:v?v.price:p.price,image:p.image}]});productDialog.current?.close();showToast('Растение добавлено в вашу заявку')}
 function seekGrowth(s:number,smooth=true){const el=growth.current;if(!el)return;const headerHeight=window.innerWidth<=760?72:84;window.scrollTo({top:el.offsetTop-headerHeight+(el.offsetHeight-window.innerHeight+headerHeight)*[.12,.35,.60,.96][s],behavior:reduced.current||!smooth?'instant':'smooth'})}
 async function submitForm(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const values=new FormData(e.currentTarget);setFormError('');
  const name=String(values.get('name')||'').trim(),contact=String(values.get('contact')||'').trim();
  const digits=contact.replace(/\D/g,'');
  if(name.length<2||values.get('consent')!=='on'){setFormError('Укажите имя и подтвердите согласие на обработку заявки.');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)&&(!/^[+()\d\s-]+$/.test(contact)||digits.length<10||digits.length>15)){setFormError('Укажите корректный телефон или email.');return}
  const lines=['Заявка с сайта НЭО Питомника','', 'Имя: '+name,'Контакт для ответа: '+contact,'Задача: '+formGoal,'Бюджет: '+values.get('budget'),'','Выбранные растения:',...items.map(x=>x.name+(x.size?' — '+x.size:'')+'; количество: '+x.quantity+'; '+(x.price===null?'цена по запросу':money(x.price*x.quantity))),items.length?'':'Растения пока не выбраны.','','Комментарий: '+(values.get('message')||'—'),'','Наличие, размеры и итоговую стоимость прошу подтвердить.'];
  const draft=lines.join('\n');setRequestDraft(draft);setSubmitted('mailto:admin@neo-pitomnik.ru?subject='+encodeURIComponent('Заявка на растения — '+name)+'&body='+encodeURIComponent(draft));
 }

 const selectedVariant=selected?.variants.find(v=>v.id===variantId),total=items.reduce((sum,x)=>sum+(x.price||0)*x.quantity,0),quantity=items.reduce((sum,x)=>sum+x.quantity,0);

 return <>
 <PremiumHeader view={view} quantity={quantity} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} onConsult={openForm}/>
 <main id="top" className={'site-main view-'+view}>
 {isHome&&<PremiumHome products={products} onConsult={openForm} onAdd={addProduct} stage={stage}
  seekGrowth={seekGrowth} growth={growth} seed={seed} progress={progress} trees={trees} growthProgress={growthProgress}/>}
 {view==='sale'&&<>
  <PageIntro title="Распродажа" eyebrow="КАТАЛОГ РАСТЕНИЙ" items={[{label:'Распродажа'}]}/>
  <OriginalOffers products={products} onAdd={addProduct}/>
 </>}
 {isCatalog&&<>
  <PageIntro title={category?.name||'Каталог растений'} eyebrow="НЕО ПИТОМНИК"
   items={[{label:'Каталог растений',href:category?'/shop/':undefined},...(category?[{label:category.name}]:[])]}/>
  <div className="catalog-layout">
   <CategorySidebar category={category}/>
   <div className="catalog-main">
    <section className="catalog-section section-pad" id="catalog" aria-label="Растения">
     <div className="catalog-toolbar">
      <div className="search-sort">
       <label className="search"><Search size={18}/>
        <input id="plant-search" aria-label="Поиск по каталогу" placeholder="Название растения или сорт"
         value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}}/>
        {query&&<button type="button" aria-label="Очистить поиск" onClick={()=>{setQuery('');setPage(1)}}><X size={16}/></button>}
       </label>
       <label className="sort-select"><span className="sr-only">Сортировать по</span>
        <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1)}}>
         <option value="source">Исходная сортировка</option>
         <option value="price-asc">По возрастанию цены</option>
         <option value="price-desc">По убыванию цены</option>
         <option value="name">По названию</option>
        </select>
        <ChevronDown size={16}/>
       </label>
      </div>
      <CatalogTools filters={filters} sizes={sizes} onChange={changeCatalogFilters}
       onClear={()=>changeCatalogFilters(initialCatalogFilters)}/>
     </div>
     <div className="catalog-result-line" id="catalog-results">
      <span>{category?.name||'Все растения'}</span>
      <span aria-live="polite">{!catalog?'Загружаем каталог…':filtered.length?
       `Показано ${pageOffset+1}–${pageOffset+shownProducts.length} из ${filtered.length}`:'Подходящих позиций нет'}</span>
     </div>
     {loadError?<div className="empty-state">
      <Leaf/><h3>Каталог пока недоступен</h3>
      <SiteLink className="button" href="https://neo-pitomnik.ru/shop/" target="_blank" rel="noreferrer">
       Открыть исходный каталог <ArrowUpRight size={17}/>
      </SiteLink>
     </div>:<div className="product-grid">
      {!catalog?Array.from({length:4},(_,i)=><div key={i} className="product-skeleton"/>):
       shownProducts.map(p=><article className="product-card" key={p.id}>
        <SiteLink className="product-image" href={productPath(p)} aria-label={'Подробнее: '+p.name}>
         {p.image?<SiteImage src={asset(p.image)!} alt="" loading="lazy"/>:
          <div className="plant-placeholder"><Leaf size={54} strokeWidth={.65}/><span>Фото уточним в питомнике</span></div>}
         <span className="product-tag">{p.isLegacyOffer?'Распродажа':p.category}</span>
         <span className="image-arrow"><ArrowUpRight size={20}/></span>
        </SiteLink>
        <div className="product-information">
         <SiteLink className="product-name" href={productPath(p)}>{p.name}</SiteLink>
         <p className="product-size">{p.variants.length?
          p.variants.length+' '+plural(p.variants.length,'вариант','варианта','вариантов'):
          p.attributes?.[0]?.values.join(' / ')||p.group||p.category}</p>
         <div className="product-bottom">
          <span>{priceLabel(p)}</span>
          <SiteLink className="product-select-link" href={productPath(p)} aria-label={'Выбрать '+p.name}><Plus size={20}/></SiteLink>
         </div>
         {novPlus&&<button type="button" className="nov-preview-button" onClick={()=>openProduct(p)}
          aria-label={'Быстрый просмотр: '+p.name}>Быстрый просмотр <ArrowUpRight size={13}/></button>}
        </div>
       </article>)}
     </div>}
     {catalog&&filtered.length===0&&<div className="empty-state">
      <Search size={30}/><h3>Подходящих растений не найдено</h3>
      {activeFilters?
       <button className="button" type="button" onClick={()=>{setQuery('');changeCatalogFilters(initialCatalogFilters)}}>
        Сбросить поиск и фильтры <ArrowRight size={17}/>
       </button>:
       <SiteLink className="button" href="/shop/">Открыть каталог <ArrowRight size={17}/></SiteLink>}
     </div>}
     {pageCount>1&&<CatalogPager page={shownPage} pages={pageCount}
      staticLinks={view==='catalog'&&!activeFilters&&sort==='source'} onPage={next=>{
       setPage(next);
       document.getElementById('catalog-results')?.scrollIntoView({behavior:'instant'});
      }}/>}
     <p className="catalog-note">Наличие и стоимость выбранного размера питомник подтверждает при согласовании заявки.</p>
    </section>
   </div>
  </div>
  <OriginalConsultation onConsult={openForm}/>
 </>}

 {view==='product'&&selected&&<><div className="product-breadcrumbs"><Breadcrumbs items={[{label:'Каталог',href:'/shop/'},{label:selected.group||'Растения',href:navigation.find(x=>x.name===selected.group)?.path},{label:selected.name}]}/></div><section className="product-page section-pad"><div className="product-detail-layout"><div className="detail-gallery">{selected.images?.length?<><SiteImage src={asset(selected.images[galleryIndex]||selected.image)!} alt={selected.name}/>{selected.images.length>1&&<div className="gallery-thumbs">{selected.images.map((src,i)=><button key={src} className={galleryIndex===i?'active':''} onClick={()=>setGalleryIndex(i)} aria-label={'Фото '+(i+1)} aria-pressed={galleryIndex===i}><SiteImage src={asset(src)!} alt=""/></button>)}</div>}</>:<div className="plant-placeholder"><Leaf size={80} strokeWidth={.7}/><span>Фотографию уточним в питомнике</span></div>}</div><div className="detail-copy"><p className="eyebrow">{selected.group||selected.category}</p><h1>{selected.name}</h1>{selected.isLegacyOffer&&<p className="offer-note">Распродажа</p>}<div className="detail-price">{selectedVariant?selectedVariant.price===null?'Цена по запросу':selectedVariant.priceText||money(selectedVariant.price):selected.price===null?'Цена по запросу':selected.priceText||money(selected.price)}{!selectedVariant&&selected.regularPrice&&selected.price!==null&&selected.regularPrice>selected.price&&<del>{money(selected.regularPrice)}</del>}</div><p className="detail-description">{shortDescription(selected.description)||'Подберём размер и расскажем об особенностях этого растения при согласовании заявки.'}</p>{selected.variants.length>0&&<label className="field"><span>Размер / вариант растения</span><select value={variantId||''} onChange={e=>setVariantId(Number(e.target.value)||null)}><option value="">Выберите вариант</option>{selected.variants.map(v=><option key={v.id} value={v.id}>{v.label}{v.price!==null?' · '+money(v.price):' · цена по запросу'}{!v.inStock?' · наличие уточняется':''}</option>)}</select></label>}{selected.attributes?.length?<div className="detail-attributes">{selected.attributes.map(a=><div key={a.name}><span>{a.name}</span><b>{a.values?.join(' / ')}</b></div>)}</div>:null}<button className="button full" onClick={()=>addProduct(selected)} disabled={selected.variants.length>0&&!variantId}>Добавить в заявку <Plus size={18}/></button><button className="text-button detail-consult" onClick={()=>openForm('Вопрос о растении: '+selected.name)}>Спросить агронома <ArrowUpRight size={17}/></button></div></div></section><section className="product-description-block section-pad"><div><p className="eyebrow">РАСТЕНИЕ В ВАШЕМ САДУ</p><h2>Описание <em>и особенности.</em></h2></div><div className="plant-long-description">{selected.details||selected.description?<PlantDescription text={selected.details||selected.description}/>:<p>Агроном расскажет об особенностях этого растения и подходящих условиях при согласовании заявки.</p>}</div></section><ProductRecommendations products={products.filter(p=>p.id!==selected.id&&p.group===selected.group&&p.image).slice(0,4)}/></>}
 {view==='about'&&<NovAboutPage onConsult={openForm}/>}
 {novPlus&&view==='buyer'&&<BuyerGuide onConsult={openForm}/>}
 {view==='services'&&<>
  <PageIntro title="Услуги" eyebrow="НЕО ПИТОМНИК" items={[{label:'Услуги'}]}/>
  <ServiceCards/>
  <OriginalConsultation onConsult={openForm}/>
 </>}
 {view==='service'&&serviceSlug&&<ServiceDetail slug={serviceSlug} onConsult={openForm}/>}
 {view==='blog'&&<NovJournal posts={posts}/>}
 {view==='article'&&post&&<Article post={post} onConsult={openForm}/>}
 {view==='contacts'&&<>
  <PageIntro title="Контакты" eyebrow="НЕО ПИТОМНИК" items={[{label:'Контакты'}]}/>
  <ContactLocation/>
  <section className="contact-section section-pad" id="contacts">
   <div className="contact-heading">
    <p className="eyebrow light">НЕО ПИТОМНИК</p><h2>Связаться с питомником</h2>
    <button className="button cream" type="button" onClick={()=>openForm()}>Заказать консультацию <ArrowUpRight size={18}/></button>
   </div>
   <div className="contact-info">
    <div><Phone size={20} strokeWidth={1.3}/><div>
     <span className="eyebrow light">ТЕЛЕФОНЫ</span>
     <SiteLink className="main-phone" href={original.contacts.phones[0][1]}>{original.contacts.phones[0][0]}</SiteLink>
     <div className="extra-phones">{original.contacts.phones.slice(1).map(([name,href])=><SiteLink key={href} href={href}>{name}</SiteLink>)}</div>
    </div></div>
    <div><Mail size={20} strokeWidth={1.3}/><div>
     <span className="eyebrow light">ЭЛЕКТРОННАЯ ПОЧТА</span>
     <SiteLink href={'mailto:'+original.contacts.email}>{original.contacts.email} <ArrowUpRight size={16}/></SiteLink>
     <div className="social-links">{original.contacts.social.map(([label,href])=><SiteLink key={href} href={href} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={14}/></SiteLink>)}</div>
    </div></div>
   </div>
  </section>
 </>}
 {view==='selection'&&<section className="selection-page section-pad"><Breadcrumbs items={[{label:'Корзина'}]}/><p className="eyebrow">НЕО ПИТОМНИК</p><h1>Корзина</h1>{!loadedSaved?<p className="selection-loading">Загружаем выбранные растения…</p>:<>{items.length?<><div className="selection-items">{items.map(x=><div className="selection-item" key={x.key}>{x.image?<SiteImage src={asset(x.image)!} alt={x.name}/>:<Leaf className="list-placeholder"/>}<div><b>{x.name}</b><span>{x.size||'Размер уточним'}</span><strong>{x.price===null?'Цена по запросу':money(x.price*x.quantity)}</strong><div className="quantity-control"><button aria-label={'Уменьшить количество '+x.name} disabled={x.quantity<=1} onClick={()=>setItems(old=>old.map(y=>y.key===x.key?{...y,quantity:y.quantity-1}:y))}><Minus size={13}/></button><span>{x.quantity}</span><button aria-label={'Увеличить количество '+x.name} disabled={x.quantity>=1000} onClick={()=>setItems(old=>old.map(y=>y.key===x.key?{...y,quantity:y.quantity+1}:y))}><Plus size={13}/></button></div></div><button className="remove-item" aria-label={'Убрать '+x.name} onClick={()=>setItems(old=>old.filter(y=>y.key!==x.key))}><X size={18}/></button></div>)}</div><div className="selection-total"><span>Предварительная стоимость</span><b>{money(total)}{items.some(x=>x.price===null)&&' + позиции по запросу'}</b></div><p className="fine-print">Это список для заявки. Размеры, наличие, посадку и доставку согласуем с вами отдельно.</p><button className="button full" onClick={()=>openForm('Заявка на выбранные растения')}>Оформить заявку <ArrowRight size={18}/></button></>:<div className="empty-state"><ShoppingBag size={38} strokeWidth={1}/><h3>Здесь будет ваш сад</h3><p>Выберите растения в каталоге<br/>или начните с консультации.</p><SiteLink className="button full" href="/shop/">К растениям <ArrowRight size={17}/></SiteLink><button className="text-button" onClick={()=>openForm()}>Помочь с выбором <ArrowUpRight size={16}/></button></div>}</>}</section>}
 </main>
 <PremiumFooter onConsult={openForm}/>
 {novPlus&&isCatalog&&<ProductPreview dialog={productDialog} product={selected} variantId={variantId} budget={budget} minimum={minimum} size={size} onVariant={setVariantId} onAdd={addProduct} onConsult={openForm}/> }
 <dialog ref={formDialog} className="form-dialog" aria-label="Заявка в питомник" onClick={e=>{if(e.target===e.currentTarget&&!sending)formDialog.current?.close()}} onCancel={e=>{if(sending)e.preventDefault()}}><button className="dialog-close" aria-label="Закрыть форму заявки" disabled={sending} onClick={()=>formDialog.current?.close()}><X/></button>{submitted?<div className="form-success" role="status"><div className="success-icon"><Mail size={32}/></div><p className="eyebrow">ПЕРВЫЙ ШАГ К ВАШЕМУ САДУ</p><h2>Письмо <em>готово.</em></h2><p>Откройте письмо и отправьте его из своей почты, чтобы питомник получил заявку.</p><SiteLink className="button full" href={submitted}>Открыть письмо с заявкой <ArrowUpRight size={17}/></SiteLink><button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(requestDraft);showToast('Текст заявки скопирован')}catch{showToast('Не удалось скопировать. Откройте письмо с заявкой.')}}}>Скопировать текст заявки</button><p className="fine-print">Получатель: admin@neo-pitomnik.ru<br/>Если вопрос срочный: <SiteLink href="tel:+79687809292">+7 968 780-92-92</SiteLink></p><button className="button outlined full" onClick={()=>formDialog.current?.close()}>Продолжить знакомство <ArrowRight size={17}/></button></div>:<><p className="eyebrow">НАЧНЁМ С ВАШЕЙ ИДЕИ</p><h2>Каким будет<br/><em>ваш сад?</em></h2><p className="form-intro">Оставьте контакты и расскажите о задаче.<br/>Поможем выбрать следующий шаг.</p><form onSubmit={submitForm}><label className="field"><span>Как к вам обращаться</span><input name="name" autoComplete="name" placeholder="Ваше имя" minLength={2} maxLength={80} required/></label><label className="field"><span>Телефон или email</span><input name="contact" autoComplete="email" placeholder="+7 999 123-45-67 или email" maxLength={160} required/></label><div className="form-double"><label className="field"><span>Что вас интересует</span><select value={formGoal} onChange={e=>setFormGoal(e.target.value)}>{[...new Set(['Подбор растений','Заявка на выбранные растения','Ландшафтный проект',...serviceData.map(s=>s.name),formGoal])].map(x=><option key={x}>{x}</option>)}</select></label><label className="field"><span>Бюджет</span><select name="budget"><option>Пока не определён</option><option>До 30 000 ₽</option><option>30 000 – 100 000 ₽</option><option>100 000 – 300 000 ₽</option><option>От 300 000 ₽</option></select></label></div><label className="field"><span>{formGoal===deliveryGoal?'Детали доставки и посадки':'Расскажите о вашем участке'} <small>необязательно</small></span><textarea name="message" rows={3} maxLength={1800} placeholder={formGoal===deliveryGoal?'Населённый пункт, растения, количество, нужна ли посадка…':'Размер участка, какие растения нравятся, нужна ли посадка…'}/></label><label className="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off"/></label>{items.length>0&&<div className="form-items"><ShoppingBag size={17}/><span>В заявке: {quantity} растений · {items.length} позиций</span></div>}<label className="consent"><input type="checkbox" name="consent" required/><span>Согласен на обработку имени, контакта и содержания заявки для ответа на обращение.</span></label><p className="form-error" role="alert">{formError}</p><button className="button full" type="submit" disabled={sending}>{sending?'Сохраняем заявку…':'Подготовить заявку'}{!sending&&<ArrowUpRight size={18}/>}</button><p className="fine-print">Питомник получит заявку после отправки письма из вашей почты.</p></form></>}</dialog>
 <div className={'toast'+(toast?' show':'')} role="status" aria-live="polite">{toast&&<><Check size={18}/>{toast}<SiteLink href="/korzina/">Посмотреть <ArrowUpRight size={15}/></SiteLink></>}</div>
 </>;
}
