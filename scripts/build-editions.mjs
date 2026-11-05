import {spawnSync} from 'node:child_process';
import {existsSync,mkdtempSync,readFileSync,realpathSync,renameSync,rmdirSync,writeFileSync} from 'node:fs';
import {dirname,isAbsolute,join,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=realpathSync(fileURLToPath(new URL('..',import.meta.url)));
const out=join(root,'out');
const base=process.env.NEXT_PUBLIC_BASE_PATH||'/neo-pitomnik';
const origin=process.env.NEXT_PUBLIC_SITE_ORIGIN||'https://yasinsckijtema1907-eng.github.io';
const plus=base+'/plus';
const stage=mkdtempSync(join(root,'.pages-editions-'));
const owner=join(stage,'owner');
const catalog=JSON.parse(readFileSync(join(root,'public/catalog.json'),'utf8'));

function checked(path){
 const resolved=existsSync(path)?realpathSync(path):join(realpathSync(dirname(path)),path.split(sep).at(-1));
 const rel=relative(root,resolved);
 if(!rel||rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw Error('Path outside the project: '+path);
 return resolved;
}

function build(edition,basePath){
 const result=spawnSync(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{
  cwd:root,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SITE_ORIGIN:origin,NEXT_PUBLIC_BASE_PATH:basePath,NEXT_PUBLIC_NURSERY_EDITION:edition}
 });
 if(result.error)throw result.error;
 if(result.status!==0)throw Error('The '+edition+' build failed');
}

function csvCell(value){
 const text=String(value??'');
 const safe=/^[=+@\-\t\r]/u.test(text)?"'"+text:text;
 return '"'+safe.replaceAll('"','""')+'"';
}
function priceList(){
 const rows=[['Растение','Раздел','Размер / вариант','Цена, ₽','Карточка']];
 for(const p of catalog.products){
  const options=p.variants.length?p.variants:[{label:(p.attributes||[]).map(a=>a.name+': '+a.values.join(', ')).join(' · '),price:p.price}];
  for(const option of options)rows.push([p.name,p.group||p.category,option.label,option.price,origin+plus+new URL(p.url).pathname]);
 }
 return '\ufeff'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
}

try{
 build('owner',base);
 renameSync(checked(out),checked(owner));
 build('plus',plus);
 writeFileSync(join(checked(out),'price-list.csv'),priceList(),'utf8');
 renameSync(checked(out),checked(join(owner,'plus')));
 renameSync(checked(owner),checked(out));
 rmdirSync(checked(stage));
 writeFileSync(join(checked(out),'.nojekyll'),'');
 for(const route of ['index.html','shop/index.html','o-nas/index.html','blog/index.html','plus/index.html','plus/shop/index.html','plus/o-nas/index.html','plus/pokupatelyam/index.html','plus/price-list.csv']){
  if(!existsSync(join(out,route)))throw Error('Missing export: '+route);
 }
 console.log('Both GitHub Pages editions are ready:',origin+base+'/',origin+plus+'/');
}catch(error){
 console.error(error);
 console.error('Partial build artifacts, if any, were left in '+stage);
 process.exitCode=1;
}
