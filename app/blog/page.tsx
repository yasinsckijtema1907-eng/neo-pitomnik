import {renderSite,metadataFor,posts} from '../server-data';
export const metadata=metadataFor('Блог питомника','/blog/','Советы питомника НЭО: выбор растений и идеи для вашего сада.');
export default function Page(){return renderSite({view:'blog',posts})}
