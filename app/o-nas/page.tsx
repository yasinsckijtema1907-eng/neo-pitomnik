import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('О питомнике','/o-nas/','История питомника, собственные поля и команда. Выращиваем растения и помогаем с посадкой и уходом.');
export default function Page(){return renderSite({view:'about'})}
