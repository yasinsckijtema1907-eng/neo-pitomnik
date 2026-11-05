import {notFound} from 'next/navigation';
import {renderSite,metadataFor,posts} from '../../server-data';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){
 const {slug}=await params;
 const post=posts.find(item=>item.slug===slug);
 if(!post)notFound();
 return metadataFor(post.title,new URL(post.sourceUrl).pathname,post.excerpt);
}
export default async function Page({params}:Props){const {slug}=await params;const post=posts.find(x=>x.slug===slug);if(!post)notFound();return renderSite({view:'article',post})}

export const dynamicParams=false;
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}
