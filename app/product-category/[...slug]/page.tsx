import {notFound} from 'next/navigation';
import {renderSite,metadataFor,categories} from '../../server-data';
type Props={params:Promise<{slug:string[]}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const category=categories.find(c=>c.path==='/product-category/'+slug.join('/')+'/');return metadataFor(category?.name||'Категория растений',category?.path||'/shop/')}
export default async function Page({params}:Props){const {slug}=await params;const category=categories.find(c=>c.path==='/product-category/'+slug.join('/')+'/');if(!category)notFound();return renderSite({view:'category',category})}

export const dynamicParams=false;
export function generateStaticParams(){return categories.map(c=>({slug:c.path.split('/').filter(Boolean).slice(1)}))}
