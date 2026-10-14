import type {AnchorHTMLAttributes, ImgHTMLAttributes} from 'react';
import {sitePath} from './site-path';
export function SiteLink({href,...props}:AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props} href={href?sitePath(href):href}/>}
export function SiteImage({src,...props}:ImgHTMLAttributes<HTMLImageElement>){return <img {...props} src={typeof src==='string'?sitePath(src):src}/>}
