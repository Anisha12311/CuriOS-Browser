// Pure state helpers. Each mutates the draft it is given; the store clones before calling them.
import { kindOf, siteKey, titleFor, internalName } from "../data/urls";
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
    settings: { vtabs: false, railOpen: true, trackers: "standard", engine: "google", searchSuggestions: true, searchDefaultsApplied: true, sampleDataRemoved: true },
    workspaces: [], activeWs: "", tabs: [], activeTab: {}, bookmarks: [], history: [], graph: {}, clips: [], closed: [], snapshots: [],
    panel: { open: false, tab: "clips" }, recent: [], stats: { blocked: 0, upgraded: 0 }, favicons: {},
  };
}

/** A first run: one workspace with one new tab, and nothing else. */
export function fresh(): BrowserState {
  const s = blank();
  const workspace: Workspace = { id: uid("w"), name: "Personal", color: "#2F5FD0", isolate: true, graph: true, active: now() };
  s.workspaces = [workspace];
  s.activeWs = workspace.id;
  graphOf(s, workspace.id);
  newTabIn(s, workspace.id, "synapse://newtab");
  return s;
}

// Hosts and workspace ids used by the sample data that earlier versions created on first run.
const SAMPLE_HOST = /(^|\.)example\.(org|com|gov|edu)$/i;
const SAMPLE_WORKSPACE_IDS = new Set(["w1", "w2", "w3"]);

function isSampleUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return SAMPLE_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Removes the sample pages, clips, notes and workspaces from earlier versions, keeping everything the user made. */
export function removeSampleData(s: BrowserState) {
  s.tabs = s.tabs.filter((t) => !isSampleUrl(t.url));
  s.history = s.history.filter((h) => !isSampleUrl(h.url));
  s.bookmarks = s.bookmarks.filter((b) => !isSampleUrl(b.url));
  s.clips = s.clips.filter((c) => !isSampleUrl(c.url));
  s.closed = s.closed.filter((c) => !isSampleUrl(c.tab.url));
  const sampleNoteTexts = new Set([
    "Check whether drained marshes release carbon faster. Compare with the soil sampling page.",
    "How is stored carbon measured?",
  ]);
  Object.values(s.graph).forEach((g) => {
    g.nodes = g.nodes.filter((n) => !isSampleUrl(n.url) && !sampleNoteTexts.has(n.text ?? ""));
    const ids = new Set(g.nodes.map((n) => n.id));
    g.edges = g.edges.filter((e) => ids.has(e.a) && ids.has(e.b));
  });
  const isEmpty = (wsId: string) =>
    !s.tabs.some((t) => t.ws === wsId && t.url !== "synapse://newtab") &&
    !s.history.some((h) => h.ws === wsId) &&
    !s.bookmarks.some((b) => b.ws === wsId) &&
    !(s.graph[wsId]?.nodes.length);
  s.workspaces = s.workspaces.filter((w) => !(SAMPLE_WORKSPACE_IDS.has(w.id) && isEmpty(w.id)));
  Object.keys(s.graph).forEach((wsId) => {
    if (!s.workspaces.some((w) => w.id === wsId)) delete s.graph[wsId];
  });
  s.tabs = s.tabs.filter((t) => s.workspaces.some((w) => w.id === t.ws));
  if (!s.workspaces.length) {
    const clean = fresh();
    Object.assign(s, { workspaces: clean.workspaces, activeWs: clean.activeWs, tabs: clean.tabs, activeTab: clean.activeTab, graph: clean.graph });
  }
  if (!s.workspaces.some((w) => w.id === s.activeWs)) s.activeWs = s.workspaces[0].id;
  s.workspaces.forEach((w) => {
    if (!tabsOf(s, w.id).length) newTabIn(s, w.id, "synapse://newtab");
  });
  s.stats = { blocked: 0, upgraded: 0 };
}

/** Saves selected page text as a clip in the tab's workspace, linked to the page's graph node. */
export function addClipIn(s: BrowserState, tabId: string, text: string) {
  const t = s.tabs.find((x) => x.id === tabId);
  if (!t) return;
  const node = graphOf(s, t.ws).nodes.find((n) => n.type === "page" && n.key === siteKey(t.url));
  s.clips.unshift({ id: uid("c"), ws: t.ws, nodeId: node?.id ?? null, text, url: t.url, title: t.title, ts: now() });
  s.panel = { open: true, tab: "clips" };
}

/** Adds a note to the tab's workspace graph, linked to the page it came from. */
export function addNoteIn(s: BrowserState, tabId: string, text: string) {
  const t = s.tabs.find((x) => x.id === tabId);
  if (!t) return;
  const src = nodeById(graphOf(s, t.ws), t.lastNode);
  if (src) {
    const n = addNode(s, t.ws, { type: "note", text, x: src.x - 40 + Math.round(Math.random() * 40), y: src.y + 150 });
    link(s, t.ws, n.id, src.id, "note");
  } else addNode(s, t.ws, { type: "note", text });
  s.panel = { open: true, tab: "notes" };
}
