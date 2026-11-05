import {notFound} from 'next/navigation';
import {metadataFor, products, renderSite} from '../../../server-data';
import {catalogPagePath, catalogPageSize} from '../../../site-types';

type Props={params:Promise<{page:string}>};
const pageCount=Math.ceil(products.length/catalogPageSize);
export const dynamicParams=false;
export const dynamic='force-static';

export function generateStaticParams() {
 return Array.from({length:pageCount-1},(_,i)=>({page:String(i+2)}));
}

export async function generateMetadata({params}:Props) {
 const page=Number((await params).page);
 return metadataFor('Каталог растений, страница '+page,catalogPagePath(page));
}

export default async function Page({params}:Props) {
 const page=Number((await params).page);
 if(!Number.isInteger(page)||page<2||page>pageCount)notFound();
 return renderSite({view:'catalog',catalogPage:page});
}
