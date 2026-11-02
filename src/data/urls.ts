// URL helpers: internal synapse:// pages, typed input to URL, and search engines.

export type TrackerLevel = 'standard' | 'strict' | 'off';
export type UrlKind = 'internal' | 'external';

export const INTERNAL: Record<string, string> = {
  newtab: 'New tab',
  search: 'Search',
  graph: 'Research graph',
  library: 'Library',
  settings: 'Settings',
  workspaces: 'Workspaces',
  restore: 'Restore session',
  privacy: 'Privacy and security',
};

export const ENGINES = {
  google: { name: 'Google', url: 'https://www.google.com/search?q=' },
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  ddg: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
};

/** Host plus path without a trailing slash; identifies "the same page" across visits. */
export function siteKey(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.host.replace(/^www\./, '') + (parsed.pathname.replace(/\/+$/, '') || '');
  } catch {
    return String(url);
  }
}

export function kindOf(url: string): UrlKind {
  return /^synapse:\/\//i.test(url) ? 'internal' : 'external';
}

export function internalName(url: string): string {
  return String(url).replace(/^synapse:\/\//i, '').split(/[?#/]/)[0].toLowerCase();
}

export function queryOf(url: string): string {
  try {
    return new URLSearchParams(url.split('?')[1] || '').get('q') || '';
  } catch {
    return '';
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** The host without "www.", used to group favicons and top sites. */
export function domainOf(url: string): string {
  return hostOf(url).replace(/^www\./, '');
}

/** A page title until the real one arrives from the page. */
export function titleFor(url: string): string {
  if (kindOf(url) === 'internal') {
    const name = internalName(url);
    if (name === 'search') return 'Search: ' + queryOf(url);
    return INTERNAL[name] || name;
  }
  return domainOf(url);
}

export interface Resolved {
  url: string;
  upgraded: boolean;
}

/** Turns whatever was typed into a URL: an address, an internal page, or a search. */
export function resolve(input: string): Resolved | null {
  const value = String(input || '').trim();
  if (!value) return null;
  if (/^synapse:\/\//i.test(value)) {
    return { url: internalName(value) === 'search' ? value : 'synapse://' + internalName(value), upgraded: false };
  }
  const isLocal = /^(http:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:\d+)?([/?#].*)?$/i.test(value);
  if (/^http:\/\//i.test(value)) {
    return isLocal ? { url: value, upgraded: false } : { url: 'https://' + value.slice(7), upgraded: true };
  }
  if (/^(https|file|about|view-source):/i.test(value)) return { url: value, upgraded: false };
  if (/^localhost(:\d+)?([/?#].*)?$/i.test(value)) return { url: 'http://' + value, upgraded: false };
  if (!/\s/.test(value) && /^[\w-]+(\.[\w-]+)+(:\d+)?([/?#].*)?$/.test(value)) {
    return { url: 'https://' + value, upgraded: false };
  }
  return { url: 'synapse://search?q=' + encodeURIComponent(value), upgraded: false };
}
