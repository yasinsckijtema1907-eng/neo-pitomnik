import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('О питомнике','/o-nas/','История НЕО ПИТОМНИКА, собственные поля и команда специалистов. Восемь лет заботы о растениях и садах.');
export default function Page(){return renderSite({view:'about'})}
