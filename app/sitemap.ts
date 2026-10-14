export const dynamic='force-static';
import {siteUrl} from './site-path';
import type {MetadataRoute} from 'next';
import {products,categories,posts} from './server-data';
import {productPath,serviceData} from './site-types';
export default function sitemap():MetadataRoute.Sitemap{return [...new Set(['/', '/shop/','/o-nas/','/uslugi/','/sale/','/blog/','/kontakty/',...categories.map(c=>c.path),...products.map(productPath),...serviceData.map(s=>'/uslugi/'+s.slug+'/'),...posts.map(p=>'/blog/'+p.slug+'/')])].map(p=>({url:siteUrl(p),changeFrequency:p.startsWith('/product')?'weekly':'monthly',priority:p==='/'?1:p==='/shop/'?.9:.7}))}
