import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('О нас','/o-nas/','История питомника «Новъ», собственные поля и команда.');
export default function Page(){return renderSite({view:'about'})}
