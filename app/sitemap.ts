export const dynamic='force-static';
import {siteUrl} from './site-path';
import {novPlus} from './nov-shop-tools';
import type {MetadataRoute} from 'next';
import {products,categories,posts} from './server-data';
import {catalogPagePath,catalogPageSize,productPath,serviceData} from './site-types';
export default function sitemap():MetadataRoute.Sitemap {
 const catalogPages=Array.from({length:Math.ceil(products.length/catalogPageSize)},(_,i)=>catalogPagePath(i+1));
 const paths=['/','/o-nas/','/uslugi/','/sale/','/blog/','/kontakty/',...(novPlus?['/pokupatelyam/']:[]),
  ...catalogPages,...categories.map(c=>c.path),...products.map(productPath),...serviceData.map(s=>'/uslugi/'+s.slug+'/'),
  ...posts.map(p=>new URL(p.sourceUrl).pathname)];
 return paths.map(p=>({url:siteUrl(p),changeFrequency:p.startsWith('/product')?'weekly':'monthly',priority:p==='/'?1:p==='/shop/'?.9:.7}));
}
