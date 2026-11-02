import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { hostOf, kindOf, resolve, siteKey, titleFor } from "../data/sites";
import {
  closeNativeTab,
  isNativeUrl,
  nativeBack,
  nativeForward,
  nativeReload,
  toNavigableUrl,
} from "../services/nativeTabs";
import { usePersistence } from "../hooks/usePersistence";
import { loadInitialState } from "../services/storage";
import * as M from "./model";
import type { BrowserState, BrowserTab, GraphNode, NodeType, PanelTab, Settings, Workspace } from "./types";

/** Live state of a real page, reported by Electron. Not persisted. */
export interface PageInfo {
  favicon?: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
}

export type ToastTone = "ok" | "warn" | "err";
export interface Toast {
  id: string;
  msg: string;
  tone: ToastTone;
}


export interface BrowserApi {
  state: BrowserState;
  ws: Workspace;
  tab: BrowserTab | null;
  loading: Record<string, boolean>;
  pageInfo: Record<string, PageInfo>;
  canGoBack: boolean;
  canGoForward: boolean;
  toasts: Toast[];
  tabsOf: (wsId: string) => BrowserTab[];
  /** With replace, the current history entry is swapped instead of adding a new one. */
  navigate: (tabId: string, input: string, opts?: { replace?: boolean }) => void;
  openTab: (input: string, opts?: { from?: BrowserTab; activate?: boolean }) => void;
  openInternal: (name: string) => void;
  newTab: () => void;
  activate: (id: string) => void;
  closeTab: (id: string) => void;
  back: () => void;
  forward: () => void;
  reload: () => void;
  switchWs: (id: string) => void;
  reopenClosed: () => void;
  togglePanel: () => void;
  setPanelTab: (k: PanelTab) => void;
  toggleRail: () => void;
  toggleVtabs: () => void;
  hideAi: () => void;
  isBookmarked: (url: string) => boolean;
  toggleBookmark: () => void;
  addNote: (text: string) => void;
  removeClip: (id: string) => void;
  removeNode: (id: string) => void;
  saveSnapshot: () => void;
  toast: (msg: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  createWorkspace: (name: string, color: string) => void;
  deleteWorkspace: (id: string) => void;
  updateWorkspace: (id: string, patch: Partial<Omit<Workspace, "id">>) => void;
  removeBookmark: (id: string) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  addClip: (text: string) => void;
  addGraphNode: (type: NodeType, x: number, y: number) => string;
  moveNode: (id: string, x: number, y: number) => void;
  updateNode: (id: string, patch: Partial<Pick<GraphNode, "text" | "star">>) => void;
  linkNodes: (a: string, b: string, label: string) => void;
}

const Ctx = createContext<BrowserApi | null>(null);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadInitialState);
  const [state, setState] = useState<BrowserState>(initial.state);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pageInfo, setPageInfo] = useState<Record<string, PageInfo>>({});

  // Apply a mutation to a cloned draft so the helpers in model.ts can stay imperative.
  const update = useCallback((fn: (d: BrowserState) => void) => {
    setState((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  }, []);


  const toast = useCallback((msg: string, tone: ToastTone = "ok") => {
    const id = M.uid("toast");
    setToasts((t) => [...t, { id, msg, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const handleSaveError = useCallback((message: string) => toast(message, "err"), [toast]);
  usePersistence(state, initial.savedState, handleSaveError);

  const startLoad = useCallback((id: string) => {
    setLoading((l) => ({ ...l, [id]: true }));
    window.setTimeout(() => setLoading((l) => ({ ...l, [id]: false })), 320);
  }, []);

  const ws = M.curWs(state);
  const tab = M.curTab(state);

  const engine = state.settings.engine;

  const navigate = useCallback(
    (tabId: string, input: string, opts: { replace?: boolean } = {}) => {
      const r = resolve(input);
      if (!r) return;
      const url = toNavigableUrl(r.url, engine);
      const isNative = isNativeUrl(url);
      if (r.upgraded) toast("Upgraded to a secure connection");
      update((d) => {
        const t = d.tabs.find((x) => x.id === tabId);
        if (!t) return;
        if (r.upgraded) d.stats.upgraded++;
        const q = r.url.startsWith("synapse://search") ? new URLSearchParams(r.url.split("?")[1] || "").get("q") : null;
        if (q) d.recent = [q, ...d.recent.filter((x) => x !== q)].slice(0, 6);
        if (opts.replace) t.stack[t.i] = url;
        else {
          t.stack = t.stack.slice(0, t.i + 1);
          t.stack.push(url);
          t.i = t.stack.length - 1;
        }
        t.url = url;
        t.title = isNative ? hostOf(url) : titleFor(url);
        t.sleeping = false;
        t.last = Date.now();
        // Real pages are recorded once Electron reports the committed navigation.
        if (!isNative) M.visit(d, t);
      });
      if (!isNative && !url.startsWith("synapse://")) startLoad(tabId);
    },
    [update, toast, startLoad, engine],
  );

  const openTab = useCallback(
    (input: string, opts: { from?: BrowserTab; activate?: boolean } = {}) => {
      const r = resolve(input);
      if (!r) return;
      const url = toNavigableUrl(r.url, engine);
      const isNative = isNativeUrl(url);
      const id = M.uid("t");
      update((d) => {
        const t = M.newTabIn(d, d.activeWs, url, {
          id,
          after: opts.from?.id,
          lastNode: opts.from?.lastNode,
          activate: opts.activate,
          skipVisit: isNative,
        });
        if (isNative) t.title = hostOf(url);
      });
      if (!isNative && !url.startsWith("synapse://")) window.setTimeout(() => startLoad(id), 0);
    },
    [update, startLoad, engine],
  );

  useEffect(() => {
    const bridge = window.desktop?.tabs;
    if (!bridge) return;
    const unsubscribeState = bridge.onState((page) => {
      setLoading((l) => ({ ...l, [page.id]: page.isLoading }));
      setPageInfo((info) => ({
        ...info,
        [page.id]: { ...info[page.id], canGoBack: page.canGoBack, canGoForward: page.canGoForward },
      }));
      if (!page.url) return;
      update((d) => {
        const t = d.tabs.find((x) => x.id === page.id);
        if (!t) return;
        t.title = page.title || hostOf(page.url);
        // Until a navigation commits, Electron still reports the previous page's URL.
        if (!page.didNavigate) return;
        t.url = page.url;
        if (isNativeUrl(t.stack[t.i] ?? "")) t.stack[t.i] = page.url;
        M.visit(d, t);
      });
    });
    const unsubscribeFavicon = bridge.onFavicon(({ id, favicon }) =>
      setPageInfo((info) => ({ ...info, [id]: { ...(info[id] ?? { canGoBack: false, canGoForward: false }), favicon } })),
    );
    const unsubscribeError = bridge.onError(({ url, message }) =>
      toast(`Could not load ${hostOf(url)}: ${message}`, "err"),
    );
    const unsubscribeOpen = bridge.onOpen(({ url }) => openTab(url));
    return () => {
      unsubscribeState();
      unsubscribeFavicon();
      unsubscribeError();
      unsubscribeOpen();
    };
  }, [update, toast, openTab]);

  const activate = useCallback(
    (id: string) =>
      update((d) => {
        const t = d.tabs.find((x) => x.id === id);
        if (!t) return;
        if (t.ws !== d.activeWs) {
          d.activeWs = t.ws;
          const w = M.wsById(d, t.ws);
          if (w) w.active = Date.now();
        }
        d.activeTab[t.ws] = t.id;
        t.last = Date.now();
        t.sleeping = false;
      }),
    [update],
  );

  const openInternal = useCallback(
    (name: string) => {
      const url = "synapse://" + name;
      const existing = M.tabsOf(state, ws.id).find((t) => t.url === url);
      if (existing) activate(existing.id);
      else if (tab && tab.url === "synapse://newtab") navigate(tab.id, url);
      else openTab(url);
    },
    [state, ws.id, tab, activate, navigate, openTab],
  );

  const tabInfo = tab ? pageInfo[tab.id] : undefined;
  const isNativeTab = !!tab && isNativeUrl(tab.url);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!tab) return;
      if (isNativeTab && dir === -1 && tabInfo?.canGoBack) return nativeBack(tab.id);
      if (isNativeTab && dir === 1 && tabInfo?.canGoForward) return nativeForward(tab.id);
      const ni = tab.i + dir;
      if (ni < 0 || ni >= tab.stack.length) return;
      update((d) => {
        const t = d.tabs.find((x) => x.id === tab.id)!;
        t.i = ni;
        t.url = t.stack[ni];
        t.title = titleFor(t.url);
        const g = M.graphOf(d, t.ws);
        t.lastNode = g.nodes.find((x) => x.type === "page" && x.key === siteKey(t.url))?.id ?? null;
      });
      if (!isNativeUrl(tab.stack[ni])) startLoad(tab.id);
    },
    [tab, update, startLoad, isNativeTab, tabInfo],
  );

  const api: BrowserApi = {
    state,
    ws,
    tab,
    loading,
    pageInfo,
    canGoBack: !!tab && (tab.i > 0 || (isNativeTab && !!tabInfo?.canGoBack)),
    canGoForward: !!tab && (tab.i < tab.stack.length - 1 || (isNativeTab && !!tabInfo?.canGoForward)),
    toasts,
    tabsOf: (wsId) => M.tabsOf(state, wsId),
    navigate,
    openTab,
    openInternal,
    newTab: () => openTab("synapse://newtab"),
    activate,
    closeTab: (id) => {
      closeNativeTab(id);
      update((d) => M.closeTabIn(d, id));
    },
    back: () => step(-1),
    forward: () => step(1),
    reload: () => {
      if (!tab) return;
      if (isNativeTab) nativeReload(tab.id);
      else startLoad(tab.id);
    },
    switchWs: (id) =>
      update((d) => {
        const w = M.wsById(d, id);
        if (!w) return;
        d.activeWs = id;
        w.active = Date.now();
      }),
    reopenClosed: () => {
      const c = state.closed[0];
      if (!c) {
        toast("No recently closed tabs", "warn");
        return;
      }
      update((d) => {
        const entry = d.closed.shift()!;
        const t = { ...entry.tab, id: M.uid("t"), sleeping: false, last: Date.now() };
        if (!M.wsById(d, t.ws)) t.ws = d.activeWs;
        d.tabs.push(t);
        d.activeWs = t.ws;
        d.activeTab[t.ws] = t.id;
      });
      toast("Reopened " + c.tab.title);
    },
    togglePanel: () => update((d) => void (d.panel.open = !d.panel.open)),
    setPanelTab: (k) => update((d) => void (d.panel.tab = k)),
    toggleRail: () => update((d) => void (d.settings.railOpen = !d.settings.railOpen)),
    toggleVtabs: () => {
      update((d) => void (d.settings.vtabs = !d.settings.vtabs));
      toast(state.settings.vtabs ? "Tabs moved to the top" : "Tabs moved to the sidebar");
    },
    hideAi: () => {
      update((d) => void (d.settings.hideAi = true));
      toast("Hidden. You can bring it back in Settings.");
    },
    isBookmarked: (url) => state.bookmarks.some((b) => b.ws === ws.id && siteKey(b.url) === siteKey(url)),
    toggleBookmark: () => {
      if (!tab || kindOf(tab.url) === "internal") return;
      const k = siteKey(tab.url);
      const had = state.bookmarks.some((b) => b.ws === ws.id && siteKey(b.url) === k);
      update((d) => {
        if (had) d.bookmarks = d.bookmarks.filter((b) => !(b.ws === ws.id && siteKey(b.url) === k));
        else d.bookmarks.unshift({ id: M.uid("b"), ws: ws.id, url: tab.url, title: tab.title, folder: "Unsorted", ts: Date.now() });
      });
      toast(had ? "Bookmark removed" : "Bookmarked in " + ws.name, had ? "warn" : "ok");
    },
    addNote: (text) => {
      if (!ws.graph) {
        toast("Turn on the research graph to keep notes", "warn");
        return;
      }
      update((d) => {
        const g = M.graphOf(d, ws.id);
        const src = M.nodeById(g, tab?.lastNode ?? null);
        if (src) {
          const n = M.addNode(d, ws.id, { type: "note", text, x: src.x - 40 + Math.round(Math.random() * 40), y: src.y + 150 });
          M.link(d, ws.id, n.id, src.id, "note");
        } else M.addNode(d, ws.id, { type: "note", text });
      });
    },
    removeClip: (id) => update((d) => void (d.clips = d.clips.filter((c) => c.id !== id))),
    removeNode: (id) =>
      update((d) => {
        const g = M.graphOf(d, ws.id);
        g.nodes = g.nodes.filter((n) => n.id !== id);
        g.edges = g.edges.filter((e) => e.a !== id && e.b !== id);
      }),
    saveSnapshot: () => toast("Session snapshot saved"),
    toast,
    dismissToast,
    setSetting: (key, value) => update((d) => void (d.settings[key] = value)),
    createWorkspace: (name, color) => {
      update((d) => {
        const id = M.uid("w");
        d.workspaces.push({ id, name, color, isolate: true, graph: true, active: Date.now() });
        M.graphOf(d, id);
        M.newTabIn(d, id, "synapse://newtab");
        d.activeWs = id;
      });
      toast("Created " + name);
    },
    deleteWorkspace: (id) => {
      if (state.workspaces.length < 2) {
        toast("You need at least one workspace", "err");
        return;
      }
      state.tabs.filter((t) => t.ws === id).forEach((t) => closeNativeTab(t.id));
      update((d) => {
        d.tabs = d.tabs.filter((t) => t.ws !== id);
        d.workspaces = d.workspaces.filter((w) => w.id !== id);
        d.bookmarks = d.bookmarks.filter((b) => b.ws !== id);
        d.history = d.history.filter((h) => h.ws !== id);
        d.clips = d.clips.filter((c) => c.ws !== id);
        delete d.graph[id];
        delete d.activeTab[id];
        if (d.activeWs === id) d.activeWs = d.workspaces[0].id;
      });
      toast("Workspace deleted", "warn");
    },
    updateWorkspace: (id, patch) =>
      update((d) => {
        const w = M.wsById(d, id);
        if (w) Object.assign(w, patch);
      }),
    removeBookmark: (id) => update((d) => void (d.bookmarks = d.bookmarks.filter((b) => b.id !== id))),
    removeHistory: (id) => update((d) => void (d.history = d.history.filter((h) => h.id !== id))),
    clearHistory: () => {
      update((d) => void (d.history = d.history.filter((h) => h.ws !== ws.id)));
      toast("History cleared", "warn");
    },
    addClip: (text) => {
      if (!tab) return;
      update((d) => {
        const g = M.graphOf(d, ws.id);
        const node = g.nodes.find((n) => n.type === "page" && n.key === siteKey(tab.url));
        d.clips.unshift({ id: M.uid("c"), ws: ws.id, nodeId: node?.id ?? null, text, url: tab.url, title: tab.title, ts: Date.now() });
        d.panel = { open: true, tab: "clips" };
      });
      toast("Clipped to " + ws.name);
    },
    addGraphNode: (type, x, y) => {
      const id = M.uid("n");
      update((d) => void M.graphOf(d, ws.id).nodes.push({ id, type, text: "", x, y, ts: Date.now() }));
      return id;
    },
    moveNode: (id, x, y) =>
      update((d) => {
        const n = M.nodeById(M.graphOf(d, ws.id), id);
        if (n) Object.assign(n, { x, y });
      }),
    updateNode: (id, patch) =>
      update((d) => {
        const n = M.nodeById(M.graphOf(d, ws.id), id);
        if (n) Object.assign(n, patch, { ts: Date.now() });
      }),
    linkNodes: (a, b, label) => update((d) => M.link(d, ws.id, a, b, label)),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useBrowser(): BrowserApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBrowser must be used inside <BrowserProvider>");
  return c;
}
