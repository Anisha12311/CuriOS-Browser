// Pure state helpers. Each mutates the draft it is given; the store clones before calling them.
import { kindOf, siteKey, titleFor, internalName } from "../data/sites";
import type { BrowserState, BrowserTab, Graph, GraphNode, NodeType, Workspace } from "./types";

export const SIZE: Record<NodeType, { w: number; h: number }> = {
  page: { w: 240, h: 84 },
  note: { w: 220, h: 104 },
  question: { w: 240, h: 76 },
};

export const uid = (p: string) => p + Math.random().toString(36).slice(2, 9);
const now = () => Date.now();

export function graphOf(s: BrowserState, wsId: string): Graph {
  if (!s.graph[wsId]) s.graph[wsId] = { nodes: [], edges: [] };
  return s.graph[wsId];
}
export const nodeById = (g: Graph, id: string | null) => (id ? g.nodes.find((n) => n.id === id) ?? null : null);
export const wsById = (s: BrowserState, id: string) => s.workspaces.find((w) => w.id === id) ?? null;
export const tabsOf = (s: BrowserState, wsId: string) => s.tabs.filter((t) => t.ws === wsId);

export function curWs(s: BrowserState): Workspace {
  return wsById(s, s.activeWs) ?? s.workspaces[0];
}
export function curTab(s: BrowserState): BrowserTab | null {
  const w = curWs(s);
  const t = s.tabs.find((x) => x.id === s.activeTab[w.id]);
  return t && t.ws === w.id ? t : tabsOf(s, w.id)[0] ?? null;
}

export function makeTab(wsId: string, url: string, id: string = uid("t")): BrowserTab {
  return { id, ws: wsId, url, title: titleFor(url), pinned: false, group: null, stack: [url], i: 0, last: now(), sleeping: false, lastNode: null };
}

function place(g: Graph, src: GraphNode | null) {
  const N = g.nodes;
  let x: number, y: number;
  if (src) {
    const kids = g.edges.filter((e) => e.a === src.id).length;
    const ang = ((-55 + kids * 55) * Math.PI) / 180;
    x = src.x + 260 * Math.cos(ang);
    y = src.y + 170 * Math.sin(ang);
  } else {
    const i = N.length;
    x = 80 + (i % 4) * 250;
    y = 80 + Math.floor(i / 4) * 140;
  }
  let tries = 0;
  const clash = () => N.some((n) => Math.abs(n.x - x) < 210 && Math.abs(n.y - y) < 84);
  while (clash() && tries++ < 40) {
    y += 96;
    if (tries % 3 === 0) {
      y -= 288;
      x += 40;
    }
  }
  return { x: Math.round(Math.max(20, x)), y: Math.round(Math.max(20, y)) };
}

function addHistory(s: BrowserState, wsId: string, url: string, title: string) {
  const h = s.history[0];
  if (h && h.url === url && h.ws === wsId && now() - h.ts < 3000) return;
  s.history.unshift({ id: uid("h"), ws: wsId, url, title, ts: now() });
  if (s.history.length > 2000) s.history.length = 2000;
}

// Record a page visit for a tab: history, graph node, and an edge from where the tab came from.
export function visit(s: BrowserState, tab: Pick<BrowserTab, "ws" | "url" | "title" | "lastNode">): GraphNode | null {
  const u = tab.url;
  if (kindOf(u) === "internal") return null;
  const title = tab.title || titleFor(u);
  addHistory(s, tab.ws, u, title);
  const w = wsById(s, tab.ws);
  if (!w || !w.graph) return null;
  const g = graphOf(s, w.id);
  const key = siteKey(u);
  let n = g.nodes.find((x) => x.type === "page" && x.key === key) ?? null;
  const src = nodeById(g, tab.lastNode);
  if (!n) {
    const p = place(g, src);
    n = { id: uid("n"), type: "page", key, url: u, title, x: p.x, y: p.y, ts: now(), visits: 1 };
    g.nodes.push(n);
  } else {
    n.visits = (n.visits || 1) + 1;
    n.ts = now();
  }
  const nid = n.id;
  if (src && src.id !== nid && !g.edges.some((e) => (e.a === src.id && e.b === nid) || (e.a === nid && e.b === src.id))) {
    g.edges.push({ id: uid("e"), a: src.id, b: nid, label: "leads to" });
  }
  tab.lastNode = nid;
  return n;
}

export function addNode(s: BrowserState, wsId: string, o: { type: NodeType; text?: string; x?: number; y?: number }) {
  const g = graphOf(s, wsId);
  const p = o.x != null && o.y != null ? { x: o.x, y: o.y } : place(g, null);
  const n: GraphNode = { id: uid("n"), type: o.type, text: o.text || "", x: p.x, y: p.y, ts: now() };
  g.nodes.push(n);
  return n;
}

export function link(s: BrowserState, wsId: string, a: string, b: string, label: string) {
  const g = graphOf(s, wsId);
  if (a === b) return;
  const ex = g.edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
  if (ex) ex.label = label;
  else g.edges.push({ id: uid("e"), a, b, label });
}

export function newTabIn(s: BrowserState, wsId: string, url: string, opts: { id?: string; after?: string; lastNode?: string | null; activate?: boolean; skipVisit?: boolean } = {}) {
  const t = makeTab(wsId, url, opts.id);
  if (opts.lastNode) t.lastNode = opts.lastNode;
  const list = tabsOf(s, wsId);
  const after = opts.after ? s.tabs.find((x) => x.id === opts.after) : undefined;
  if (after && after.ws === wsId) s.tabs.splice(s.tabs.indexOf(after) + 1, 0, t);
  else if (list.length) s.tabs.splice(s.tabs.indexOf(list[list.length - 1]) + 1, 0, t);
  else s.tabs.push(t);
  if (opts.activate !== false) s.activeTab[wsId] = t.id;
  if (!opts.skipVisit) visit(s, t);
  return t;
}

export function closeTabIn(s: BrowserState, id: string) {
  const t = s.tabs.find((x) => x.id === id);
  if (!t) return;
  const list = tabsOf(s, t.ws);
  const idx = list.indexOf(t);
  if (kindOf(t.url) !== "internal" || internalName(t.url) !== "newtab") {
    s.closed.unshift({ tab: t, at: now() });
    if (s.closed.length > 25) s.closed.length = 25;
  }
  s.tabs.splice(s.tabs.indexOf(t), 1);
  const left = tabsOf(s, t.ws);
  if (!left.length) newTabIn(s, t.ws, "synapse://newtab");
  else if (s.activeTab[t.ws] === id) s.activeTab[t.ws] = (left[Math.min(idx, left.length - 1)] || left[0]).id;
}

export function blank(): BrowserState {
  return {
    v: 1,
    settings: { vtabs: false, railOpen: true, hideAi: false, trackers: "standard", engine: "google", searchSuggestions: true, searchDefaultsApplied: true },
    workspaces: [], activeWs: "", tabs: [], activeTab: {}, bookmarks: [], history: [], graph: {}, clips: [], closed: [],
    panel: { open: true, tab: "clips" }, recent: [], stats: { blocked: 312, upgraded: 97, cookies: 48 },
  };
}

export function seed(): BrowserState {
  const s = blank();
  s.workspaces = [
    { id: "w1", name: "Field research", color: "#0E7C66", isolate: true, graph: true, active: now() },
    { id: "w2", name: "Thesis", color: "#2F5FD0", isolate: false, graph: true, active: now() - 7200000 },
    { id: "w3", name: "Trip planning", color: "#9A5B05", isolate: true, graph: true, active: now() - 86400000 },
  ];
  s.activeWs = "w1";
  const U: Record<string, string> = {
    wet: "https://wetlands.example.org/carbon-storage", blue: "https://bluecarbon.example.org/overview",
    soil: "https://soil-methods.example.org/sampling", tidal: "https://data.example.gov/tidal-marsh",
    coring: "https://fieldguides.example.org/coring", acc: "https://coastal-lab.example.edu/accretion",
    ch3: "https://docs.example.com/chapter-3", rail: "https://rail.example.org/timetable", stay: "https://stays.example.com/guesthouses",
  };
  const walk = (wsId: string, steps: [string, string?][]) => {
    const ids: Record<string, string> = {};
    steps.forEach(([k, from], i) => {
      const tmp = { ws: wsId, url: U[k], title: titleFor(U[k]), lastNode: from ? ids[from] : null };
      visit(s, tmp);
      ids[k] = tmp.lastNode as string;
      if (s.history[0]) s.history[0].ts = now() - (steps.length - i) * 420000;
    });
    return ids;
  };
  const n1 = walk("w1", [["wet"], ["blue", "wet"], ["tidal", "blue"], ["soil", "wet"], ["coring", "soil"]]);
  const n2 = walk("w2", [["acc"], ["ch3", "acc"]]);
  const n3 = walk("w3", [["rail"], ["stay", "rail"]]);
  const g1 = graphOf(s, "w1");
  const pos: Record<string, [number, number]> = { wet: [78, 156], blue: [442, 60], tidal: [819, 108], soil: [442, 276], coring: [819, 300] };
  Object.keys(pos).forEach((k) => {
    const n = nodeById(g1, n1[k])!;
    [n.x, n.y] = pos[k];
  });
  const note = addNode(s, "w1", { type: "note", text: "Check whether drained marshes release carbon faster. Compare with the soil sampling page.", x: 78, y: 420 });
  const q = addNode(s, "w1", { type: "question", text: "How is stored carbon measured?", x: 546, y: 480 });
  link(s, "w1", note.id, n1.soil, "note");
  link(s, "w1", q.id, n1.soil, "answers");
  link(s, "w1", n1.blue, n1.soil, "contradicts");

  const tabFor = (wsId: string, key: string, nid: string) => {
    const t = makeTab(wsId, U[key]);
    t.lastNode = nid;
    s.tabs.push(t);
    return t;
  };
  const t1 = tabFor("w1", "wet", n1.wet);
  tabFor("w1", "blue", n1.blue);
  tabFor("w1", "soil", n1.soil);
  const t2 = tabFor("w2", "acc", n2.acc);
  tabFor("w2", "ch3", n2.ch3);
  const t3 = tabFor("w3", "rail", n3.rail);
  tabFor("w3", "stay", n3.stay);
  s.activeTab = { w1: t1.id, w2: t2.id, w3: t3.id };
  s.history.sort((a, b) => b.ts - a.ts);

  s.clips = [
    { id: uid("c"), ws: "w1", nodeId: n1.wet, text: "Waterlogged soils slow decomposition, which keeps carbon locked in for long periods.", url: U.wet, title: titleFor(U.wet), ts: now() - 600000 },
    { id: uid("c"), ws: "w1", nodeId: n1.soil, text: "The stored-carbon figure depends on how deep you sample.", url: U.soil, title: titleFor(U.soil), ts: now() - 300000 },
  ];
  s.bookmarks = [
    { id: uid("b"), ws: "w1", url: U.wet, title: titleFor(U.wet), folder: "Carbon", ts: now() - 900000 },
    { id: uid("b"), ws: "w1", url: U.blue, title: titleFor(U.blue), folder: "Carbon", ts: now() - 800000 },
    { id: uid("b"), ws: "w1", url: U.soil, title: titleFor(U.soil), folder: "Methods", ts: now() - 700000 },
  ];
  return s;
}
