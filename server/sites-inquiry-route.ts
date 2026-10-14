import {env} from 'cloudflare:workers';
import source from '../public/catalog.json';
type Binding={prepare:(sql:string)=>{bind:(...args:unknown[])=>{first:<T=Record<string,unknown>>()=>Promise<T|null>;run:()=>Promise<unknown>}}};
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
  try{
    const origin=request.headers.get('origin');
    if(origin&&origin!==new URL(request.url).origin)return reply({error:'Отправьте заявку со страницы питомника.'},403);
    if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Некорректный формат заявки.'},415);
    const raw=await request.text();if(raw.length>24000)return reply({error:'Заявка слишком большая.'},413);
    let body;try{body=JSON.parse(raw)}catch{return reply({error:'Проверьте данные заявки.'},400)}
    if(!body||typeof body!=='object'||Array.isArray(body))return reply({error:'Проверьте данные заявки.'},400);
    const text=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
    if(body.website)return reply({error:'Не удалось отправить заявку.'},400);
    const name=text(body.name,80),contact=text(body.contact,160),goal=text(body.goal,180),budget=text(body.budget,80),message=text(body.message,1800),id=text(body.requestId,36);
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return reply({error:'Обновите страницу и повторите отправку.'},400);
    if(name.length<2||!goal||body.consent!==true)return reply({error:'Укажите имя и подтвердите согласие на обработку заявки.'},400);
    const isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact),digits=contact.replace(/\D/g,'');
    if(!isEmail&&(!/^[+()\d\s-]+$/.test(contact)||digits.length<10||digits.length>15))return reply({error:'Укажите корректный телефон или email.'},400);
    if(!Array.isArray(body.items)||body.items.length>50)return reply({error:'Выберите не более 50 позиций.'},400);
    const items=[];
    for(const item of body.items){
      const product=source.products.find(p=>p.id===item.id);if(!product||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>1000)return reply({error:'Проверьте выбранные растения и количество.'},400);
      const variant=item.variantId?product.variants.find(v=>v.id===item.variantId):null;
      if((item.variantId&&!variant)||(product.variants.length&&!variant))return reply({error:'Выберите размер для каждого растения.'},400);
      items.push({id:product.id,name:product.name,variantId:variant?.id||null,size:variant?.label||'',quantity:item.quantity,price:variant?variant.price:product.price,sourceUrl:product.url});
    }
    const db=(env as unknown as {DB:Binding}).DB;if(!db)return reply({error:'Форма временно недоступна. Позвоните питомнику: +7 968 780-92-92.'},503);
    const existing=await db.prepare('SELECT reference FROM inquiries WHERE id=?').bind(id).first<{reference:string}>();if(existing)return reply({reference:existing.reference});
    const canonicalContact=isEmail?contact.toLowerCase():digits;
    const recent=await db.prepare('SELECT COUNT(*) AS count FROM inquiries WHERE contact=? AND created_at>?').bind(canonicalContact,new Date(Date.now()-86400000).toISOString()).first<{count:number}>();
    if((recent?.count||0)>=5)return reply({error:'Вы уже отправили несколько заявок. По срочному вопросу позвоните нам.'},429);
    const reference='NEO-'+id.slice(0,8).toUpperCase();
    await db.prepare('INSERT INTO inquiries (id,reference,created_at,name,contact,goal,budget,message,selection_json,status) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,reference,new Date().toISOString(),name,canonicalContact,goal,budget,message,JSON.stringify(items),'new').run();
    return reply({reference},201);
  }catch{return reply({error:'Не удалось сохранить заявку. Попробуйте ещё раз или позвоните питомнику.'},503)}
}
