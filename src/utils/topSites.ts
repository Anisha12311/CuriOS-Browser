import { domainOf, kindOf } from '../data/urls';
import type { HistoryEntry } from '../state/types';

export interface TopSite {
  domain: string;
  url: string;
  visits: number;
}

/** The most-visited sites in a workspace, each linking to the site's home page. */
export function topSites(history: HistoryEntry[], wsId: string, limit = 8): TopSite[] {
  const siteByDomain = new Map<string, TopSite>();
  history.forEach(entry => {
    if (entry.ws !== wsId || kindOf(entry.url) !== 'external') return;
    const domain = domainOf(entry.url);
    if (!domain) return;
    const site = siteByDomain.get(domain);
    if (site) site.visits += 1;
    else {
      let url = entry.url;
      try {
        url = new URL(entry.url).origin;
      } catch {
        // Keep the visited URL.
      }
      siteByDomain.set(domain, { domain, url, visits: 1 });
    }
  });
  return [...siteByDomain.values()].sort((a, b) => b.visits - a.visits).slice(0, limit);
}
