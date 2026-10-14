export type Variant={id:number;label:string;attributes:Record<string,string>;price:number|null;priceText:string;inStock:boolean};
export type Product={id:number;name:string;group?:string;category:string;categories?:string[];price:number|null;priceText:string;image:string|null;images:string[];description:string;details:string;url:string;variants:Variant[];attributes?:{name:string;values:string[]}[];inStock:boolean;isLegacyOffer?:boolean;regularPrice?:number|null};
export type Catalog={products:Product[];count:number};
export type Category={name:string;group:string;path:string;isGroup:boolean};
export type Post={id:number;slug:string;title:string;date:string;excerpt:string;image:string|null;sourceUrl:string;blocks:{type:string;text?:string;items?:string[]}[]};
export type View='home'|'catalog'|'category'|'sale'|'product'|'about'|'services'|'service'|'blog'|'article'|'contacts'|'selection';
export type SiteProps={view?:View;initialCatalog?:Catalog;category?:Category;product?:Product;posts?:Post[];post?:Post;serviceSlug?:string};
export const productPath=(p:Product)=>new URL(p.url).pathname;
export const money=(n:number)=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
export const asset=(src:string|null)=>src?'/'+src.replace(/^\//,''):null;
export const serviceData=[
 {slug:'posadka-rasteniy',name:'Посадка растений',description:'Сажаем на совесть: только адаптированный материал из собственных российских полей и питомника.',image:'garden-1.webp',prompt:'Какие растения и в каком количестве нужно посадить? Укажите местоположение участка и пожелания по срокам.'},
 {slug:'landshaftnye-raboty',name:'Ландшафтные работы',description:'Профессиональное благоустройство участков любой сложности. Полный комплекс ландшафтных работ под ключ.',image:'garden-3.webp',prompt:'Расскажите о площади участка, существующих посадках и о том, каким вы хотите видеть будущий сад.'},
 {slug:'servisnyy-uhod',name:'Сервисный уход за садом',description:'Комплексное обслуживание от наших агрономов. Гарантируем безупречный вид участка.',image:'garden-2.webp',prompt:'Укажите площадь сада, основные растения и задачи по уходу, с которыми нужна помощь.'},
 {slug:'peresadka-krupnomerov',name:'Пересадка крупномеров',description:'Безопасное перемещение и посадка взрослых деревьев любой сложности. Гарантируем лёгкую адаптацию и приживаемость в нашем климате.',image:'garden-1.webp',prompt:'Какие деревья нужно пересадить? Укажите примерную высоту, количество и расстояние до нового места.'},
 {slug:'rulonnyy-gazon',name:'Устройство рулонного газона',description:'Профессиональная укладка рулонного газона в сжатые сроки. Идеальный изумрудный газон за один день.',image:'garden-4.webp',prompt:'Расскажите о площади будущего газона, состоянии почвы и наличии полива на участке.'},
 {slug:'planirovanie-uchastka',name:'Планирование участка',description:'Профессиональное планирование территории от идеи до технического плана. Индивидуальные решения для участков любой сложности.',image:'garden-2.webp',prompt:'Укажите размер участка и зоны, которые хотите предусмотреть: посадки, отдых, дорожки, газон.'},
 {slug:'obrabotka-sada',name:'Обработка сада',description:'Комплексная диагностика и лечение деревьев от любых видов угроз. Экспертная обработка садов сертифицированными препаратами.',image:'garden-3.webp',prompt:'Какие растения требуют внимания? Опишите заметные изменения и когда они появились.'},
 {slug:'avtopoliv',name:'Монтаж автополива',description:'Инженерный подбор и монтаж систем полива от наших специалистов. Настраиваем автономные системы любой сложности.',image:'garden-4.webp',prompt:'Расскажите о площади полива, источнике воды и зонах сада, для которых нужна система.'},
 {slug:'konsultaciya-agronoma',name:'Консультация агронома',description:'Профессиональный разбор состояния вашего участка от опытного агронома. Индивидуальный подход к особенностям вашего сада.',image:'garden-2.webp',prompt:'Расскажите о своём участке и вопросах по растениям, почве, посадке или уходу.'},
];
