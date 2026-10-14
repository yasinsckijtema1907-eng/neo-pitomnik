import {renderSite,metadataFor} from './server-data';
export const metadata=metadataFor('Ваш будущий сад начинается здесь','/');
export default function Page() { return renderSite({view:'home'}); }
