import {siteUrl,sitePath} from './site-path';
export const dynamic='force-static';
import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:[sitePath('/api/'),sitePath('/korzina/')]},sitemap:siteUrl('/sitemap.xml')}}
