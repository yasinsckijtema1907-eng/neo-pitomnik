import {renderSite,metadataFor} from '../server-data';
export const metadata={...metadataFor('Корзина','/korzina/'),robots:{index:false,follow:false}};
export default function Page(){return renderSite({view:'selection'})}
