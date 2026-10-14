import {notFound} from 'next/navigation';
import {posts,metadataFor} from '../../../../server-data';
import LegacyRedirect from '../../../../legacy-redirect';
export const dynamicParams=false;
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return metadataFor('Блог питомника','/blog/'+slug+'/')}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!posts.some(p=>p.slug===slug))notFound();return <LegacyRedirect href={'/blog/'+slug+'/'}/>}
