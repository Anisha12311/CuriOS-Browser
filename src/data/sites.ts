// Demo websites, URL resolving and the tracker model (ported from the Synapse HTML).

export type TrackerTier = 1 | 2;
export interface Tracker {
  host: string;
  kind: string;
  tier: TrackerTier;
}
export interface Section {
  h?: string;
  p: string;
}
export interface Site {
  host: string;
  path: string;
  name: string;
  color: string;
  title: string;
  feature?: "location" | "notify";
  trackers: Tracker[];
  sections: Section[];
  links: [string, string][];
  url: string;
}
export type TrackerLevel = "standard" | "strict" | "off";

const tr = (host: string, kind: string, tier: TrackerTier): Tracker => ({ host, kind, tier });
const T_A = [
  tr("metrics.adnet-demo.test", "analytics", 1),
  tr("pixel.sharebar-demo.test", "social", 1),
  tr("fp.devicegraph-demo.test", "fingerprinting", 2),
];
const T_B = [tr("beacon.adnet-demo.test", "advertising", 1), tr("fp.devicegraph-demo.test", "fingerprinting", 2)];
const T_C = [tr("metrics.adnet-demo.test", "analytics", 1)];

const RAW: Omit<Site, "url">[] = [
  {
    host: "wetlands.example.org", path: "/carbon-storage", name: "Wetlands Primer", color: "#0E7C66",
    title: "How coastal wetlands store carbon", feature: "location", trackers: T_A,
    sections: [
      { p: "Tidal marshes and mangroves build soil layer by layer as plants die back and sediment settles." },
      { p: "Waterlogged soils slow decomposition, which keeps carbon locked in for long periods." },
      { p: "Where drainage or disturbance exposes that soil to air, some of the stored carbon can return to the atmosphere." },
      { h: "Measuring what is stored", p: "Researchers estimate stored carbon by taking cores of soil and measuring how much of each layer is organic. The method matters, so read how samples are taken before you compare numbers from different studies." },
    ],
    links: [["Soil sampling methods", "https://soil-methods.example.org/sampling"], ["Blue carbon: an overview of coastal habitats", "https://bluecarbon.example.org/overview"], ["Sediment accretion basics", "https://coastal-lab.example.edu/accretion"]],
  },
  {
    host: "bluecarbon.example.org", path: "/overview", name: "Blue Carbon Network", color: "#55606E",
    title: "Blue carbon: an overview of coastal habitats", trackers: T_B,
    sections: [
      { p: "Blue carbon is the carbon stored in coastal and marine ecosystems such as mangroves, seagrass meadows and salt marsh." },
      { p: "These habitats gather carbon in their soils far more slowly than they can lose it, so protecting an intact habitat is usually worth more than restoring a damaged one." },
      { p: "Losses can be fast once a marsh is drained or cleared." },
      { h: "Where the data comes from", p: "Most national estimates combine field measurements with maps of habitat extent. The field measurements are collected with the methods described on the sampling pages." },
    ],
    links: [["How coastal wetlands store carbon", "https://wetlands.example.org/carbon-storage"], ["Tidal marsh dataset", "https://data.example.gov/tidal-marsh"], ["Mangrove inventory report", "https://reports.example.org/mangrove"]],
  },
  {
    host: "soil-methods.example.org", path: "/sampling", name: "Soil Methods Library", color: "#2F5FD0",
    title: "Soil sampling methods", trackers: T_C,
    sections: [
      { p: "Core samples are taken at fixed depth intervals so results can be compared between sites." },
      { p: "The stored-carbon figure depends on how deep you sample. A shallow core can miss carbon that is buried deeper, and a very deep core can mix in older material." },
      { h: "Common choices", p: "Most surveys choose a standard depth, record compaction, and dry and weigh each layer before measuring its organic fraction. Always note which choice a study made." },
    ],
    links: [["Core sampling field guide", "https://fieldguides.example.org/coring"], ["Tidal marsh dataset", "https://data.example.gov/tidal-marsh"], ["How coastal wetlands store carbon", "https://wetlands.example.org/carbon-storage"]],
  },
  {
    host: "data.example.gov", path: "/tidal-marsh", name: "Open Coastal Data", color: "#9A5B05",
    title: "Tidal marsh dataset", feature: "notify", trackers: T_B,
    sections: [
      { p: "Survey records for tidal marsh sites, with core depth and organic carbon fraction for each layer." },
      { p: "Records can be downloaded as CSV or queried by region. Each row describes one layer of one core." },
      { h: "Fields", p: "site_id, region, core_depth_cm, layer_thickness_cm, organic_carbon_fraction, collected_on." },
    ],
    links: [["Soil sampling methods", "https://soil-methods.example.org/sampling"], ["Blue carbon: an overview of coastal habitats", "https://bluecarbon.example.org/overview"]],
  },
  {
    host: "coastal-lab.example.edu", path: "/accretion", name: "Coastal Lab", color: "#8A3FA0",
    title: "Sediment accretion basics", trackers: T_C,
    sections: [
      { p: "Accretion is the rate at which a marsh surface builds upward." },
      { p: "It varies with tidal range and sediment supply. A marsh that builds up faster than sea level rises can keep its elevation." },
      { p: "Slow accretion means less new soil, and so less new carbon, each year." },
    ],
    links: [["How coastal wetlands store carbon", "https://wetlands.example.org/carbon-storage"], ["Core sampling field guide", "https://fieldguides.example.org/coring"]],
  },
  {
    host: "fieldguides.example.org", path: "/coring", name: "Field Guides", color: "#0E7C66",
    title: "Core sampling field guide", trackers: T_C,
    sections: [
      { p: "Mark the plot, clear surface litter, and drive the corer straight down to avoid compressing the layers." },
      { p: "Record the depth the corer reached and the depth of soil that came back. The difference tells you how much the core was compressed." },
      { h: "Packing", p: "Seal each section, label it with the site and depth, and keep it cool until it can be dried and weighed." },
    ],
    links: [["Soil sampling methods", "https://soil-methods.example.org/sampling"], ["Mangrove inventory report", "https://reports.example.org/mangrove"]],
  },
  {
    host: "reports.example.org", path: "/mangrove", name: "Coastal Reports", color: "#55606E",
    title: "Mangrove inventory report", trackers: T_A,
    sections: [
      { p: "This report describes how mangrove extent and condition are mapped and how field plots are chosen to represent each region." },
      { p: "Plot selection is stratified by habitat condition so that degraded areas are not under-represented." },
    ],
    links: [["Blue carbon: an overview of coastal habitats", "https://bluecarbon.example.org/overview"], ["Core sampling field guide", "https://fieldguides.example.org/coring"]],
  },
  {
    host: "docs.example.com", path: "/chapter-3", name: "Shared Docs", color: "#2F5FD0",
    title: "Chapter 3 draft", trackers: [],
    sections: [
      { p: "Chapter 3 compares how different studies measure stored carbon and why their figures are not always comparable." },
      { p: "Open question: do drained marshes lose carbon faster than the sampling-depth difference alone would explain?" },
    ],
    links: [["Soil sampling methods", "https://soil-methods.example.org/sampling"], ["Sediment accretion basics", "https://coastal-lab.example.edu/accretion"]],
  },
  {
    host: "rail.example.org", path: "/timetable", name: "Regional Rail", color: "#9A5B05",
    title: "Rail timetable", trackers: T_C,
    sections: [
      { p: "Morning and evening departures are listed by route. Check the platform on the day of travel." },
      { p: "Weekend services run less often, so plan connections with extra time." },
    ],
    links: [["Guesthouse options near the station", "https://stays.example.com/guesthouses"]],
  },
  {
    host: "stays.example.com", path: "/guesthouses", name: "Stays", color: "#55606E",
    title: "Guesthouse options near the station", trackers: T_A,
    sections: [
      { p: "Small guesthouses near the station, sorted by distance on foot." },
      { p: "Cancellation terms differ by listing, so read them before booking." },
    ],
    links: [["Rail timetable", "https://rail.example.org/timetable"]],
  },
];

export const SITES: Site[] = RAW.map((s) => ({ ...s, url: "https://" + s.host + s.path }));

const INDEX: Record<string, Site> = {};
const HOSTS: Record<string, Site> = {};

export function siteKey(u: string): string {
  try {
    const x = new URL(u);
    return x.host.replace(/^www\./, "") + (x.pathname.replace(/\/+$/, "") || "");
  } catch {
    return String(u);
  }
}
SITES.forEach((s) => {
  INDEX[siteKey(s.url)] = s;
  if (!HOSTS[s.host]) HOSTS[s.host] = s;
});

export function siteFor(u: string): Site | null {
  const k = siteKey(u);
  if (INDEX[k]) return INDEX[k];
  try {
    return HOSTS[new URL(u).host.replace(/^www\./, "")] || null;
  } catch {
    return null;
  }
}

export const INTERNAL: Record<string, string> = {
  newtab: "New tab", search: "Search", graph: "Research graph", library: "Library", settings: "Settings",
  workspaces: "Workspaces", restore: "Restore session", privacy: "Privacy and security",
};

export type UrlKind = "internal" | "site" | "external";

export function kindOf(u: string): UrlKind {
  if (/^synapse:\/\//i.test(u)) return "internal";
  return siteKey(u) in INDEX ? "site" : "external";
}
export function internalName(u: string): string {
  return String(u).replace(/^synapse:\/\//i, "").split(/[?#/]/)[0].toLowerCase();
}
export function queryOf(u: string): string {
  try {
    return new URLSearchParams(u.split("?")[1] || "").get("q") || "";
  } catch {
    return "";
  }
}
export function titleFor(u: string): string {
  if (kindOf(u) === "internal") {
    const n = internalName(u);
    if (n === "search") return "Search: " + queryOf(u);
    return INTERNAL[n] || n;
  }
  const s = INDEX[siteKey(u)];
  if (s) return s.title;
  return hostOf(u);
}
export function hostOf(u: string): string {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
}
export function siteColor(url: string): string {
  return siteFor(url)?.color ?? "#AEB6C2";
}

export const ENGINES = {
  ddg: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
  google: { name: "Google", url: "https://www.google.com/search?q=" },
};

export interface Resolved {
  url: string;
  upgraded: boolean;
}

// Turn whatever was typed into a URL.
export function resolve(input: string): Resolved | null {
  const v = String(input || "").trim();
  if (!v) return null;
  if (/^synapse:\/\//i.test(v)) {
    return { url: internalName(v) === "search" ? v : "synapse://" + internalName(v), upgraded: false };
  }
  if (/^http:\/\//i.test(v)) return { url: "https://" + v.slice(7), upgraded: true };
  if (/^https:\/\//i.test(v)) return { url: v, upgraded: false };
  if (!/\s/.test(v) && /^[\w-]+(\.[\w-]+)+(:\d+)?([/?#].*)?$/.test(v)) return { url: "https://" + v, upgraded: false };
  return { url: "synapse://search?q=" + encodeURIComponent(v), upgraded: false };
}

export function searchSites(q: string): Site[] {
  const words = String(q).toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const out: { site: Site; score: number }[] = [];
  SITES.forEach((s) => {
    const hay = (s.title + " " + s.host + " " + s.name + " " + s.sections.map((x) => (x.h || "") + " " + x.p).join(" ")).toLowerCase();
    let score = 0;
    words.forEach((w) => {
      if (s.title.toLowerCase().includes(w)) score += 5;
      if (s.host.includes(w)) score += 3;
      if (hay.includes(w)) score += 1;
    });
    if (score) out.push({ site: s, score });
  });
  return out.sort((a, b) => b.score - a.score).map((o) => o.site);
}

export function isBlocked(t: Tracker, level: TrackerLevel): boolean {
  if (level === "off") return false;
  return level === "strict" ? true : t.tier === 1;
}

function escapeHtml(text: string): string {
  const entityByChar: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, (char) => entityByChar[char]);
}

/** The markup of a demo site, rendered inside a sandboxed iframe. Links and selections are posted to the parent. */
export function siteHtml(site: Site, level: TrackerLevel): string {
  const body = site.sections.map((s) => (s.h ? `<h2>${escapeHtml(s.h)}</h2>` : "") + `<p>${escapeHtml(s.p)}</p>`).join("");
  const links = site.links.length
    ? "<h2>Related</h2><ul>" + site.links.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join("") + "</ul>"
    : "";
  const third = site.trackers.length
    ? '<div class="third"><b>Third-party requests on this page</b><ul>' +
      site.trackers
        .map((t) => {
          const blocked = isBlocked(t, level);
          return `<li class="${blocked ? "blocked" : "allowed"}"><span>${escapeHtml(t.host)} <em>${escapeHtml(t.kind)}</em></span><span>${blocked ? "Blocked by Synapse" : "Allowed"}</span></li>`;
        })
        .join("") +
      "</ul></div>"
    : "";
  const css =
    "body{margin:0;background:#fff;color:#1d2128;font:16px/1.7 Georgia,serif}.wrap{max-width:880px;margin:0 auto;padding:40px 32px 80px}" +
    ".crumb{font:12.5px system-ui,sans-serif;color:#5b6472;display:flex;gap:8px;align-items:center}" +
    `.dot{width:12px;height:12px;border-radius:3px;background:${site.color}}` +
    "h1{font:600 32px/1.2 system-ui,sans-serif;margin:14px 0 18px}h2{font:600 18px/1.3 system-ui,sans-serif;margin:28px 0 6px}p{margin:0 0 14px}a{color:#0b5fd6}" +
    `.hero{height:110px;border-radius:10px;background:linear-gradient(135deg,${site.color}22,${site.color}08);border:1px solid ${site.color}33;margin:0 0 22px}` +
    ".third{margin-top:36px;padding:14px;border:1px solid #d5dae1;border-radius:10px;font:13px system-ui,sans-serif;background:#f5f6f8}" +
    ".third ul{list-style:none;margin:8px 0 0;padding:0}.third li{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-top:1px solid #e3e7ec}" +
    ".third em{color:#5b6472;font-style:normal;margin-left:6px}.blocked span:last-child{color:#0b6b57;font-weight:600}.blocked span:first-child{text-decoration:line-through;color:#5b6472}.allowed span:last-child{color:#9a3412;font-weight:600}";
  const script =
    "(function(){var P=function(m){m.synapse=1;parent.postMessage(m,'*')};" +
    "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a){e.preventDefault();P({type:'nav',url:a.href,newTab:e.ctrlKey||e.metaKey})}});" +
    "document.addEventListener('mouseup',function(){setTimeout(function(){var s=getSelection(),t=String(s).trim();if(t.length>3&&s.rangeCount){var r=s.getRangeAt(0).getBoundingClientRect();P({type:'selection',text:t,rect:{x:r.left,y:r.top,w:r.width}})}else P({type:'deselect'})},0)});" +
    "addEventListener('scroll',function(){P({type:'deselect'})});})();";
  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap">` +
    `<div class="crumb"><span class="dot"></span>${escapeHtml(site.name)} &middot; ${escapeHtml(site.host)}</div>` +
    `<h1>${escapeHtml(site.title)}</h1><div class="hero"></div>${body}${links}${third}</div><script>${script}</script></body></html>`
  );
}
