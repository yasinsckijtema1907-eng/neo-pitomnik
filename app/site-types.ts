import original from './data/original.json';

export type Variant={id:number;label:string;attributes:Record<string,string>;price:number|null;priceText:string;inStock:boolean};
export type Product={id:number;name:string;group?:string;category:string;categories?:string[];price:number|null;priceText:string;image:string|null;images:string[];description:string;details:string;url:string;variants:Variant[];attributes?:{name:string;values:string[]}[];inStock:boolean;isLegacyOffer?:boolean;regularPrice?:number|null};
export type Catalog={products:Product[];count:number};
export type Category={name:string;group:string;path:string;isGroup:boolean};
export type Post={id:number;slug:string;title:string;date:string;modified?:string;excerpt:string;image:string|null;sourceUrl:string;blocks:{type:string;text?:string;items?:string[]}[]};
export type View='home'|'catalog'|'category'|'sale'|'product'|'about'|'services'|'service'|'blog'|'article'|'contacts'|'selection'|'buyer';
export type SiteProps={view?:View;initialCatalog?:Catalog;category?:Category;product?:Product;posts?:Post[];post?:Post;serviceSlug?:string;catalogPage?:number};
export const productPath=(p:Product)=>new URL(p.url).pathname;
export const catalogPagePath=(page:number)=>page===1?'/shop/':'/shop/page/'+page+'/';
export const catalogPageSize=12;
export const money=(n:number)=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
export const asset=(src:string|null)=>src?'/'+src.replace(/^\//,''):null;
const servicePrompts:Record<string,string>={
 'posadka-rasteniy':'Какие растения и в каком количестве нужно посадить? Укажите местоположение участка и пожелания по срокам.',
 'servisnyy-uhod':'Укажите площадь сада, основные растения и задачи по уходу.',
 'landshaftnye-raboty':'Расскажите о площади участка, существующих посадках и о том, каким вы хотите видеть сад.',
 'peresadka-krupnomerov':'Какие деревья нужно пересадить? Укажите высоту, количество и расстояние до нового места.',
 'rulonnyy-gazon':'Расскажите о площади будущего газона, состоянии почвы и наличии полива.',
 'planirovanie-uchastka':'Укажите размер участка и зоны, которые хотите предусмотреть.',
 'obrabotka-sada':'Какие растения требуют внимания? Опишите изменения и когда они появились.',
 'avtopoliv':'Расскажите о площади полива, источнике воды и нужных зонах.',
 'konsultaciya-agronoma':'Расскажите об участке и вопросах по растениям, почве, посадке или уходу.',
};
export const serviceData=original.services.map(service=>({...service,prompt:servicePrompts[service.slug]}));
