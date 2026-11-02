import type { TrackerLevel } from "../data/sites";

export interface Workspace {
  id: string;
  name: string;
  color: string;
  isolate: boolean;
  graph: boolean;
  active: number;
}

export interface BrowserTab {
  id: string;
  ws: string;
  url: string;
  title: string;
  pinned: boolean;
  group: string | null;
  stack: string[];
  i: number;
  last: number;
  sleeping: boolean;
  lastNode: string | null;
}

export type NodeType = "page" | "note" | "question";

export interface GraphNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  ts: number;
  url?: string;
  title?: string;
  key?: string;
  text?: string;
  visits?: number;
  star?: boolean;
}

export interface GraphEdge {
  id: string;
  a: string;
  b: string;
  label: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Clip {
  id: string;
  ws: string;
  nodeId: string | null;
  text: string;
  url: string;
  title: string;
  ts: number;
}

export interface Bookmark {
  id: string;
  ws: string;
  url: string;
  title: string;
  folder: string;
  ts: number;
}

export interface HistoryEntry {
  id: string;
  ws: string;
  url: string;
  title: string;
  ts: number;
}

export type PanelTab = "clips" | "notes" | "trail";

export interface Settings {
  vtabs: boolean;
  railOpen: boolean;
  hideAi: boolean;
  trackers: TrackerLevel;
  engine: "ddg" | "bing" | "google";
  searchSuggestions: boolean;
  /** Set once Google has been applied as the default engine. */
  searchDefaultsApplied?: boolean;
}

export interface BrowserState {
  v: number;
  settings: Settings;
  workspaces: Workspace[];
  activeWs: string;
  tabs: BrowserTab[];
  activeTab: Record<string, string>;
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  graph: Record<string, Graph>;
  clips: Clip[];
  closed: { tab: BrowserTab; at: number }[];
  panel: { open: boolean; tab: PanelTab };
  recent: string[];
  stats: { blocked: number; upgraded: number; cookies: number };
}
