export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://yasinsckijtema1907-eng.github.io';
export function sitePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || (basePath && (path === basePath || path.startsWith(basePath + '/')))) return path;
  return basePath + path;
}
export function siteUrl(path: string) { return siteOrigin + sitePath(path); }
