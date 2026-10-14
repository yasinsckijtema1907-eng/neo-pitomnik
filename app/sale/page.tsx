import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('Распродажа растений','/sale/','Предложения исходного каталога питомника НЭО. Выберите растение и уточните условия и наличие при согласовании заявки.');
export default function Page(){return renderSite({view:'sale'})}
