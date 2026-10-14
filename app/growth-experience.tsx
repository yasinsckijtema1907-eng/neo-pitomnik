'use client';

import {useState,type RefObject} from 'react';
import {ArrowDown,ArrowRight} from 'lucide-react';
import {SiteImage,SiteLink} from './site-elements';
import {TreeScene} from './tree-scene';

const stages=[
 {title:'Семечко',copy:'Маленькое начало большой истории.'},
 {title:'Первый росток',copy:'Свет, почва и бережная забота дают начало новой жизни.'},
 {title:'Молодое дерево',copy:'Новые ветви, крепкие корни и свой характер.'},
 {title:'Взрослое дерево',copy:'Часть вашего сада. На многие годы вперёд.'},
];
export type GrowthProps={stage:number;seekGrowth:(stage:number,smooth?:boolean)=>void;growth:RefObject<HTMLElement|null>;seed:RefObject<HTMLDivElement|null>;progress:RefObject<HTMLDivElement|null>;trees:RefObject<(HTMLDivElement|null)[]>;growthProgress:RefObject<number>};

export function GrowthExperience({stage,seekGrowth,growth,seed,progress,trees,growthProgress}:GrowthProps) {
 const [treeReady,setTreeReady]=useState(false);
 return <section id="growth" className="growth-section botanical-studio" ref={growth} aria-labelledby="growth-title"><div className="growth-sticky">
  <div className="growth-copy"><p className="eyebrow">01 / ЖИВАЯ ИСТОРИЯ</p><h2 id="growth-title">Из семечка —<br/>{' '}<em>в ваш сад.</em></h2><p className="growth-intro">Прокрутите страницу.<br/>{' '}И наблюдайте, как рождается дерево.</p><div className="growth-stages">{stages.map((s,i)=><button key={s.title} className={stage===i?'active':stage>i?'passed':''} onClick={e=>seekGrowth(i,e.detail!==0)} aria-label={'Показать стадию: '+s.title} aria-current={stage===i?'step':undefined}><span>0{i+1}</span>{s.title}<ArrowRight size={17}/></button>)}</div><SiteLink className="text-button" href="#collections">Выбрать своё растение <ArrowDown size={17}/></SiteLink></div>
  <div className={'growth-visual'+(treeReady?' native-tree-ready':'')}><span className="growth-marker">НЭО / ЖИВОЕ НАСЛЕДИЕ</span><div className="tree-stage"><div className="growth-ground"/><div className="seed-scene tree-fallback" ref={seed}><span className="seed-kernel"/><span className="seed-wing"/></div>{['tree-sprout-poster-4k.webp','tree-young-poster-4k.webp','tree-mature-poster-4k.webp'].map((file,i)=><div key={file} className="tree-frame tree-fallback" ref={el=>{trees.current[i]=el}}><SiteImage src={'/assets/trees/'+file} alt="" aria-hidden="true" loading="eager" width={2160} height={3840}/></div>)}<TreeScene progress={growthProgress} stage={stage} onReady={setTreeReady} onExplore={()=>seekGrowth(3)}/></div><div className="growth-caption" aria-live="polite"><span>0{stage+1} / 04</span><div><h3>{stages[stage].title}</h3><p>{stages[stage].copy}</p></div></div><div className="growth-progress"><div ref={progress}/></div><span className="growth-footnote">От первого ростка — к большому саду.</span></div>
 </div></section>;
}
