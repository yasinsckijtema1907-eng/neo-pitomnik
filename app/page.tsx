import {renderSite,metadataFor} from './server-data';
export const metadata=metadataFor('Искусство живого сада','/');
export default function Page() { return renderSite({view:'home'}); }
