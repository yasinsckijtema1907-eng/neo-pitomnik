import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('Услуги для вашего сада','/uslugi/','Посадка растений, ландшафтные работы, сервисный уход, пересадка крупномеров, газон, автополив и консультация агронома.');
export default function Page(){return renderSite({view:'services'})}
