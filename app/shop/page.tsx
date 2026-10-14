import {renderSite,metadataFor} from '../server-data';
export const metadata=metadataFor('Каталог растений','/shop/','Полный каталог из 188 товаров: хвойные, лиственные, плодовые, цветы и кустарники. Выберите сорт и размер, отправьте заявку питомнику.');
export default function Page(){return renderSite({view:'catalog'})}
