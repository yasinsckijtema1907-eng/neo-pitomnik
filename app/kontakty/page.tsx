import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('Контакты питомника','/kontakty/','Питомник НЭО: Московская область, округ Истра, Падиково, Полевая улица, 34. Телефон +7 968 780-92-92.');
export default function Page(){return renderSite({view:'contacts'})}
