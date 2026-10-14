import {notFound} from 'next/navigation';
import {renderSite,metadataFor} from '../../server-data';
import {serviceData} from '../../site-types';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const s=serviceData.find(x=>x.slug===slug);return metadataFor(s?.name||'Услуга питомника','/uslugi/'+slug+'/',s?.description)}
export default async function Page({params}:Props){const {slug}=await params;if(!serviceData.some(x=>x.slug===slug))notFound();return renderSite({view:'service',serviceSlug:slug})}

export const dynamicParams=false;
export function generateStaticParams(){return serviceData.map(s=>({slug:s.slug}))}
