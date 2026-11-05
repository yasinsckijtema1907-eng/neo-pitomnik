import {renderSite,metadataFor} from './server-data';
export const metadata=metadataFor('Новъ — Старинные традиции в новых формах','/');
export default function Page() { return renderSite({view:'home'}); }
