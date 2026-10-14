import {notFound} from 'next/navigation';
import {renderSite,metadataFor,getProduct,products} from '../../server-data';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const product=getProduct(slug);return metadataFor(product?.name||'Растение','/product/'+slug+'/',product?product.name+'. '+product.priceText+'. Выберите размер растения и отправьте заявку питомнику НЭО.':undefined)}
export default async function Page({params}:Props){const {slug}=await params;const product=getProduct(slug);if(!product)notFound();return renderSite({view:'product',product})}

export const dynamicParams=false;
export function generateStaticParams(){return products.map(p=>({slug:new URL(p.url).pathname.split('/').filter(Boolean).at(-1)!}))}
