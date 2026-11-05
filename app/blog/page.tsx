import {renderSite,metadataFor,posts} from '../server-data';
export const metadata=metadataFor('Блог','/blog/','Статьи питомника «Новъ» о выборе растений и уходе за садом.');
export default function Page(){return renderSite({view:'blog',posts})}
