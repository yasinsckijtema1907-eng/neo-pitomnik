import {notFound} from 'next/navigation';
import {novPlus} from '../nov-shop-tools';
import {metadataFor,renderSite} from '../server-data';

export const metadata=metadataFor('Как заказать растения','/pokupatelyam/','Как выбрать размер, подготовить заявку и согласовать получение растений из питомника.');
export default function Page(){
 if(!novPlus)notFound();
 return renderSite({view:'buyer'});
}
