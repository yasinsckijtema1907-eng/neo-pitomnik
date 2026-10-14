import {notFound} from 'next/navigation';
import {renderSite,metadataFor,posts} from '../../server-data';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const p=posts.find(x=>x.slug===slug);return metadataFor(p?.title||'Статья питомника','/blog/'+slug+'/',p?.blocks.find(b=>b.type==='p')?.text)}
export default async function Page({params}:Props){const {slug}=await params;const post=posts.find(x=>x.slug===slug);if(!post)notFound();return renderSite({view:'article',post})}

export const dynamicParams=false;
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}
