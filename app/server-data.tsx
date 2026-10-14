import {siteUrl} from './site-path';
import type {Metadata} from 'next';
import Garden from './garden';
import data from '../public/catalog.json';
import journal from '../public/blog.json';
import navigation from './data/navigation.json';
import {type Product,type Post,type Catalog,type Category,type SiteProps,productPath} from './site-types';
export const products=data.products as Product[];
export const posts=journal.posts as Post[];
export const categories:Category[]=navigation.flatMap(g=>[{name:g.name,group:g.name,path:g.path,isGroup:true},...g.children.map(c=>({name:c.name,group:g.name,path:c.path,isGroup:false}))]);
const clientCatalog:Catalog={count:data.count,products:products.map(p=>({id:p.id,name:p.name,group:p.group,category:p.category,categories:p.categories,price:p.price,priceText:p.priceText,image:p.image,images:p.images,description:'',details:'',url:p.url,variants:p.variants,attributes:p.attributes,inStock:p.inStock,isLegacyOffer:p.isLegacyOffer,regularPrice:p.regularPrice}))};
export function renderSite(props:SiteProps){return <Garden {...props} initialCatalog={clientCatalog}/>;}
export function metadataFor(title:string,pathname:string,description?:string):Metadata{return {title:title+' — НЭО Питомник',description:description||'Растения из собственного питомника, подбор агронома, посадка и уход за садом. Истра, Падиково.',alternates:{canonical:siteUrl(pathname)},openGraph:{title:title+' — НЭО Питомник',url:siteUrl(pathname),description:description||'Старинные традиции в новых формах. Растения и услуги для вашего сада.'}}}
export function getProduct(slug:string){return products.find(p=>productPath(p)==='/product/'+slug+'/')}
