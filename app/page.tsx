import {renderSite,metadataFor} from './server-data';
export const metadata=metadataFor('Новъ — растения для вашего сада','/');
export default function Page() { return renderSite({view:'home'}); }
