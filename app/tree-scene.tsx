'use client';

import {useEffect,useRef,useState,type RefObject} from 'react';
import {RotateCcw,RotateCw} from 'lucide-react';
import type {Group,Material,Mesh,MeshStandardMaterial,Texture,WebGLRenderer} from 'three';
import {sitePath} from './site-path';

type Props={progress:RefObject<number>;stage:number;onReady?:(ready:boolean)=>void;onExplore?:()=>void};

// The source models contain genuine 4096px PBR maps. Phone visitors begin
// with native 4K renders; their optional interactive model uses smaller maps.
export function TreeScene({progress,stage,onReady,onExplore}:Props) {
 const host=useRef<HTMLDivElement>(null),angle=useRef(.4),pointer=useRef<{id:number;x:number;angle:number}|null>(null);
 const [ready,setReady]=useState(false),[mobileEnabled,setMobileEnabled]=useState(false),[mobile,setMobile]=useState(false),[unavailable,setUnavailable]=useState(false);
 const showNative=ready&&(!mobile||stage===3);
 useEffect(()=>{onReady?.(showNative)},[showNative,onReady]);
 useEffect(()=>{const media=matchMedia('(max-width: 760px)');setMobile(media.matches);const update=()=>setMobile(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let disposed=false,active=false,started=false,frame=0,renderer:WebGLRenderer|undefined,resizeObserver:ResizeObserver|undefined;
  let cleanupScene=()=>{};
  setReady(false);onReady?.(false);setUnavailable(false);
  if(matchMedia('(max-width: 760px)').matches&&!mobileEnabled)return;
  const start=async()=>{
   const [THREE,{GLTFLoader},{MeshoptDecoder},{RoomEnvironment}]=await Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/libs/meshopt_decoder.module.js'),import('three/addons/environments/RoomEnvironment.js')]);
   if(disposed)return;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{if(!disposed)setUnavailable(true);return;}
   renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
   renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
   renderer.domElement.setAttribute('aria-label','Объёмное хвойное дерево');renderer.domElement.setAttribute('role','img');element.appendChild(renderer.domElement);
   const scene=new THREE.Scene(),world=new THREE.Group();scene.add(world);
   const studio=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.04);scene.environment=environment.texture;scene.environmentIntensity=.55;studio.dispose();pmrem.dispose();
   const camera=new THREE.PerspectiveCamera(30,1,.1,70);camera.position.set(.35,3.15,12.4);camera.lookAt(0,3.08,0);
   scene.add(new THREE.HemisphereLight(0xf4f1db,0x8b9c8a,1.9));
   const key=new THREE.DirectionalLight(0xfff0d5,3.1);key.position.set(-4,8,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=8;key.shadow.camera.bottom=-4;key.shadow.camera.near=.5;key.shadow.camera.far=24;key.shadow.normalBias=.025;key.shadow.bias=-.0002;scene.add(key);
   const fill=new THREE.DirectionalLight(0xc9dbd5,1.45);fill.position.set(4,4,-2);scene.add(fill);
   const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({color:0x050f0a,opacity:.1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.receiveShadow=true;scene.add(floor);
   const contactCanvas=document.createElement('canvas');contactCanvas.width=contactCanvas.height=256;const contactContext=contactCanvas.getContext('2d')!,contactGradient=contactContext.createRadialGradient(128,128,6,128,128,124);contactGradient.addColorStop(0,'rgba(255,255,255,.9)');contactGradient.addColorStop(.4,'rgba(255,255,255,.3)');contactGradient.addColorStop(1,'rgba(255,255,255,0)');contactContext.fillStyle=contactGradient;contactContext.fillRect(0,0,256,256);const contactTexture=new THREE.CanvasTexture(contactCanvas),contact=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.8),new THREE.MeshBasicMaterial({color:0x142d21,map:contactTexture,transparent:true,opacity:.15,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-.015;scene.add(contact);
   const seedGroup=new THREE.Group(),seedMaterial=new THREE.MeshStandardMaterial({color:0x916941,roughness:.87});
   const kernel=new THREE.Mesh(new THREE.SphereGeometry(.15,24,16),seedMaterial);kernel.scale.set(.7,1.5,.65);kernel.rotation.z=-.24;seedGroup.add(kernel);
   const wing=new THREE.Mesh(new THREE.SphereGeometry(.24,20,12),new THREE.MeshStandardMaterial({color:0xcbb48b,roughness:.94,transparent:true,opacity:.76}));wing.scale.set(.42,1.6,.055);wing.position.set(.12,.44,0);wing.rotation.z=-.35;kernel.castShadow=true;wing.castShadow=true;seedGroup.add(wing);seedGroup.scale.setScalar(1.6);world.add(seedGroup);
   const sprout=new THREE.Group(),sproutMaterial=new THREE.MeshStandardMaterial({color:0x69863d,roughness:.9});
   const stem=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.74,12),sproutMaterial);stem.position.y=.37;sprout.add(stem);
   for(let i=0;i<7;i++){const needle=new THREE.Mesh(new THREE.ConeGeometry(.028,.42,5),sproutMaterial);needle.position.set(Math.cos(i*2.4)*.15,.75,Math.sin(i*2.4)*.15);needle.rotation.set(Math.sin(i*2.4)*.8,0,-Math.cos(i*2.4)*.8);sprout.add(needle);}
   world.add(sprout);
   let young:Group|undefined,adult:Group|undefined,realSprout:Group|undefined,lastProgress=-1,lastAngle=NaN,lastSize='',renderDirty=true;
   const groups:Group[]=[];
   const fades=new Map<Material,{value:number}>();
   const prepare=(object:Group,height:number)=>{
    const box=new THREE.Box3().setFromObject(object),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
    const factor=height/size.y;object.scale.multiplyScalar(factor);object.position.set(-center.x*factor,-box.min.y*factor,-center.z*factor);
    const wrapper=new THREE.Group();wrapper.add(object);world.add(wrapper);groups.push(wrapper);
    const cloned=new Map<Material,Material>();
    object.traverse(node=>{if((node as Mesh).isMesh){const mesh=node as Mesh;mesh.castShadow=true;mesh.receiveShadow=false;const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];const next=materials.map(raw=>{if(cloned.has(raw))return cloned.get(raw)!;const material=raw.clone() as MeshStandardMaterial;material.dithering=true;material.alphaToCoverage=true;if(material.alphaTest>0)material.alphaTest=Math.min(material.alphaTest,.12);Object.values(material).forEach(value=>{if(value&&typeof value==='object'&&(value as Texture).isTexture)(value as Texture).anisotropy=renderer!.capabilities.getMaxAnisotropy()});material.side=THREE.DoubleSide;material.shadowSide=THREE.DoubleSide;const fade={value:1};fades.set(material,fade);material.onBeforeCompile=shader=>{shader.uniforms.uGrowFade=fade;shader.fragmentShader='uniform float uGrowFade;\n'+shader.fragmentShader.replace('#include <alphatest_fragment>','#include <alphatest_fragment>\nfloat growNoise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));\nif (growNoise > uGrowFade) discard;');};cloned.set(raw,material);return material;});mesh.material=Array.isArray(mesh.material)?next:next[0];}});
    return wrapper;
   };
   const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
   const isPhone=matchMedia('(max-width: 760px)').matches;
   const modelPromise=loader.loadAsync(sitePath(isPhone?'/assets/trees/fir-adult-mobile.glb':'/assets/trees/conifer-growth-4k.glb')).then(gltf=>{if(disposed){disposeObject(gltf.scene);return;}if(isPhone){adult=prepare(gltf.scene,6.25);}else{const adultNode=gltf.scene.getObjectByName('adult-tree'),youngNode=gltf.scene.getObjectByName('young-tree'),sproutNode=gltf.scene.getObjectByName('sprout-tree');if(!adultNode||!youngNode)throw new Error('Incomplete tree scene');adult=prepare(adultNode as Group,6.25);young=prepare(youngNode as Group,4);if(sproutNode)realSprout=prepare(sproutNode as Group,2);}renderDirty=true;setReady(true);});
   function disposeObject(object:Group){
    const materials=new Set<Material>(),textures=new Set<Texture>();object.traverse(node=>{if((node as Mesh).isMesh){const mesh=node as Mesh;mesh.geometry.dispose();(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(material=>materials.add(material));}});
    materials.forEach(material=>{Object.values(material).forEach(value=>{if(value&&typeof value==='object'&&(value as Texture).isTexture)textures.add(value as Texture)});material.dispose()});textures.forEach(texture=>{const source=texture.source?.data as {close?:()=>void}|undefined;if(typeof source?.close==='function')source.close();texture.dispose()});
   }
   const size=()=>{if(!renderer||disposed)return;const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;const next=width+':'+height;if(next===lastSize)return;lastSize=next;renderer.setPixelRatio(Math.min(devicePixelRatio||1,isPhone?1.5:2,3840/Math.max(width,height)));renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();renderDirty=true;};
   const fadeGroup=(object:Group,alpha:number)=>{object.visible=alpha>0;object.traverse(node=>{if((node as Mesh).isMesh){const mesh=node as Mesh;mesh.castShadow=alpha>.6;(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(material=>{const fade=fades.get(material);if(fade)fade.value=alpha;});}});};
   resizeObserver=new ResizeObserver(size);resizeObserver.observe(element);size();
   const render=()=>{
    if(disposed)return;frame=requestAnimationFrame(render);if(!active||document.visibilityState!=='visible'||!renderer)return;
    const p=matchMedia('(prefers-reduced-motion: reduce)').matches||isPhone?1:Math.max(0,Math.min(1,progress.current));
    if(p===lastProgress&&angle.current===lastAngle&&!renderDirty)return;
    lastProgress=p;lastAngle=angle.current;renderDirty=false;const framing=THREE.MathUtils.smoothstep(p,.22,.82),focus=.9+2.18*framing;camera.position.set(.35,focus+.07,8.8+3.6*framing);camera.lookAt(0,focus,0);world.rotation.y=angle.current+(isPhone?0:p*.22);
    seedGroup.visible=p<.2;seedGroup.position.set(0,.32+Math.max(0,1-p/.17)*1.45,0);seedGroup.rotation.z=(1-Math.min(1,p/.17))*.3;
    sprout.visible=!realSprout&&p>=.18&&p<.46;sprout.scale.setScalar(.8+Math.max(0,(p-.18)/.28)*1.35);
    if(realSprout){fadeGroup(realSprout,Math.max(0,Math.min(1,(p-.18)/.07))*Math.max(0,Math.min(1,(.5-p)/.07)));realSprout.scale.setScalar(.7+Math.min(1,Math.max(0,(p-.18)/.27))*.6);}
    if(young){fadeGroup(young,Math.max(0,Math.min(1,(p-.42)/.08))*Math.max(0,Math.min(1,(.77-p)/.08)));young.scale.setScalar(.65+Math.min(1,Math.max(0,(p-.42)/.32))*.38);}
    if(adult){fadeGroup(adult,Math.max(0,Math.min(1,(p-.68)/.09)));adult.scale.setScalar(.87+Math.min(1,Math.max(0,(p-.7)/.28))*.13);}
    renderer.render(scene,camera);
   };render();
   cleanupScene=()=>{resizeObserver?.disconnect();groups.forEach(disposeObject);disposeObject(seedGroup);disposeObject(sprout);floor.geometry.dispose();(floor.material as Material).dispose();contact.geometry.dispose();(contact.material as Material).dispose();contactTexture.dispose();environment.dispose();renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove();};
   modelPromise.catch(()=>{if(!disposed){setUnavailable(true);setReady(false);}});
   renderer.domElement.addEventListener('webglcontextlost',()=>{if(!disposed){setUnavailable(true);setReady(false);}});
  };
  const observer=new IntersectionObserver(entries=>{active=entries.some(entry=>entry.isIntersecting);if(active&&!started){started=true;start().catch(()=>{if(!disposed)setUnavailable(true)});}},{rootMargin:'600px 0px'});observer.observe(element);
  return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);cleanupScene();onReady?.(false)};
 },[progress,mobileEnabled,mobile]);
 return <>
  <div ref={host} className={'tree-webgl'+(showNative?' tree-ready':'')} data-ready={showNative} onPointerDown={e=>{if(!showNative||!e.isPrimary||e.button!==0)return;pointer.current={id:e.pointerId,x:e.clientX,angle:angle.current};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(pointer.current?.id===e.pointerId)angle.current=pointer.current.angle+(e.clientX-pointer.current.x)*.006}} onPointerUp={e=>{if(pointer.current?.id===e.pointerId){pointer.current=null;e.currentTarget.releasePointerCapture(e.pointerId)}}} onPointerCancel={()=>{pointer.current=null}}/>
  {showNative?<div className="tree-controls"><button aria-label="Повернуть дерево влево" onClick={()=>{angle.current-=Math.PI/8}}><RotateCcw size={16}/></button><span>Рассмотрите со всех сторон</span><button aria-label="Повернуть дерево вправо" onClick={()=>{angle.current+=Math.PI/8}}><RotateCw size={16}/></button></div>:mobile&&!mobileEnabled&&!unavailable?<button className="tree-enable" onClick={()=>{onExplore?.();setMobileEnabled(true)}}>Рассмотреть дерево <RotateCw size={15}/></button>:null}
 </>;
}
