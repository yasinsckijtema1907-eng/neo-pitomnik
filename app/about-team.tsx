import {SiteImage} from './site-elements';
import original from './data/original.json';

export function AboutTeam() {
 const team=original.about[2];
 return <section id="team" className="about-team section-pad" aria-labelledby="team-title">
  <div className="section-heading">
   <div><p className="eyebrow">ПИТОМНИК НОВЪ</p><h2 id="team-title">{team.title}</h2></div>
   <p className="team-intro">{team.text}</p>
  </div>
  <div className="team-gallery">
   {[1,2,3,4,5,6].map(i=>{
    const isDirector=i===2;
    const compact=[1,2,4].includes(i);
    return <figure key={i}>
     <SiteImage src={'/assets/team/team-'+i+'.webp'} alt={isDirector?'Сергей Ефременко':'Сотрудник питомника «Новъ»'}
      width={compact?768:1236} height={compact?811:1306} loading="lazy"/>
     {isDirector&&<figcaption><span>Сергей Ефременко</span><span>ДИРЕКТОР</span></figcaption>}
    </figure>;
   })}
  </div>
 </section>;
}
