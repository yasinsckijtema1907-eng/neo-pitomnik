'use client';
import {useEffect} from 'react';
import {SiteLink} from './site-elements';
import {sitePath} from './site-path';
export default function LegacyRedirect({href}:{href:string}){useEffect(()=>{window.location.replace(sitePath(href))},[href]);return <main className="section-pad"><h1>Статья питомника</h1><SiteLink href={href}>Открыть статью</SiteLink></main>}
