import type {Product} from './site-types';

export const novPlus = process.env.NEXT_PUBLIC_NURSERY_EDITION === 'plus';

export const purposes = [
 {id:'hedge',title:'Живая изгородь',description:'Туи Смарагд и Брабант для посадки в ряд',image:'/assets/garden-map/conifers-472.webp'},
 {id:'bloom',title:'Цветущий акцент',description:'Гортензии, сирень и спиреи',image:'/assets/garden-map/flowers-472.webp'},
 {id:'orchard',title:'Плодовый сад',description:'Плодовые деревья и ягодные кустарники',image:'/assets/garden-map/fruit-472.webp'},
] as const;

export type Purpose = typeof purposes[number]['id'];
export const isPurpose = (value:string|null):value is Purpose => purposes.some(p=>p.id===value);
export const deliveryGoal = 'Доставка и посадка';

export function fitsPurpose(product:Product,purpose:Purpose|'') {
 if (!purpose) return true;
 if (product.isLegacyOffer) return false;
 if (purpose==='orchard') return product.group==='Плодовые';
 if (purpose==='bloom') return /^(гортензи|сирень|спире)/iu.test(product.name);
 return product.group==='Хвойные' && product.category==='Туи' &&
  /смарагд|брабант/iu.test(product.name) && !/формирован|чупа|бочки|шар/iu.test(product.name);
}

type SizeEntry = [string,string];
type CatalogOption = {variantId:number|null; price:number|null; sizes:string[]};
const sizeEntry = ([name,value]:SizeEntry) => {
 const v = value.trim().replace(/\s+/g,' ').replace(/(\d)\s*[-–—]\s*(?=\d)/g,'$1–');
 if (!v || !/рост|высот|размер|контейнер/iu.test(name)) return '';
 if (/контейнер/iu.test(name)) return 'Контейнер '+v;
 return /^\d+(?:[.,]\d+)?(?:–\d+(?:[.,]\d+)?)?$/.test(v)?v+' см':v;
};
export function catalogOptions(product:Product):CatalogOption[] {
 const attrs=product.attributes||[];
 if (!product.variants.length) {
  return [{variantId:null,price:product.price,sizes:attrs.flatMap(a=>a.values.map(v=>sizeEntry([a.name,v]))).filter(Boolean)}];
 }
 const inherited=Object.fromEntries(attrs.filter(a=>a.values.length===1).map(a=>[a.name,a.values[0]]));
 return product.variants.map(variant=>({
  variantId:variant.id, price:variant.price,
  sizes:Object.entries({...inherited,...variant.attributes}).map(sizeEntry).filter(Boolean)
 }));
}
export function matchingOptions(product:Product,budget:string,size:string) {
 return catalogOptions(product).filter(option=>
  (!budget || (option.price!==null && option.price<=Number(budget))) &&
  (!size || option.sizes.includes(size))
 );
}
export function lowestPrice(products:Product[],budget='',size='') {
 const values=products.flatMap(p=>matchingOptions(p,budget,size)).flatMap(o=>o.price!==null&&o.price>0?[o.price]:[]);
 return values.length?Math.min(...values):null;
}
