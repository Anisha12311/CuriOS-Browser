import * as M from '../state/model';
import type { BrowserState, Graph, GraphEdge, GraphNode } from '../state/types';

const LOCAL_STORAGE_KEY = 'synapse.react.v1';

const ENTITY_KEYS = ['workspaces', 'tabs', 'history', 'bookmarks', 'clips', 'graphNodes', 'graphEdges'] as const;
const META_KEYS = ['v', 'settings', 'activeWs', 'activeTab', 'panel', 'recent', 'stats', 'closed', 'snapshots', 'favicons'] as const;

type EntityKey = (typeof ENTITY_KEYS)[number];
type MetaKey = (typeof META_KEYS)[number];

interface Entity {
  id: string;
}

export interface StorageChanges {
  upserts: Partial<Record<EntityKey, Entity[]>>;
  deletes: Partial<Record<EntityKey, string[]>>;
  meta: Partial<Record<MetaKey, unknown>>;
}

interface StoredSnapshot {
  meta: Partial<Record<MetaKey, unknown>>;
  entities: Record<EntityKey, Entity[]>;
}

export interface InitialState {
  state: BrowserState;
  /** What the database already holds; null means the first save writes everything. */
  savedState: BrowserState | null;
}

type StoredNode = GraphNode & { ws: string; position?: number };
type StoredEdge = GraphEdge & { ws: string };

/** True inside Electron, where state lives in the SQLite database instead of localStorage. */
export function hasDatabase(): boolean {
  return !!window.desktop?.db;
}

function entitiesOf(state: BrowserState): Record<EntityKey, Entity[]> {
  return {
    workspaces: state.workspaces.map((workspace, position) => ({ ...workspace, position })),
    tabs: state.tabs.map((tab, position) => ({ ...tab, position })),
    history: state.history,
    bookmarks: state.bookmarks,
    clips: state.clips,
    graphNodes: Object.entries(state.graph).flatMap(([ws, graph]) =>
      graph.nodes.map((node, position) => ({ ...node, ws, position })),
    ),
    graphEdges: Object.entries(state.graph).flatMap(([ws, graph]) => graph.edges.map(edge => ({ ...edge, ws }))),
  };
}

/** Only the rows and meta values that changed between two states. Returns null when nothing changed. */
export function diffState(previous: BrowserState | null, next: BrowserState): StorageChanges | null {
  const changes: StorageChanges = { upserts: {}, deletes: {}, meta: {} };
  let hasChanges = false;
  const previousEntities = previous ? entitiesOf(previous) : null;
  const nextEntities = entitiesOf(next);

  ENTITY_KEYS.forEach(key => {
    const previousById = new Map((previousEntities?.[key] ?? []).map(entity => [entity.id, JSON.stringify(entity)]));
    const nextIds = new Set<string>();
    const upserts = nextEntities[key].filter(entity => {
      nextIds.add(entity.id);
      return previousById.get(entity.id) !== JSON.stringify(entity);
    });
    const deletes = [...previousById.keys()].filter(id => !nextIds.has(id));
    if (upserts.length) changes.upserts[key] = upserts;
    if (deletes.length) changes.deletes[key] = deletes;
    hasChanges ||= upserts.length > 0 || deletes.length > 0;
  });

  META_KEYS.forEach(key => {
    if (previous && JSON.stringify(previous[key]) === JSON.stringify(next[key])) return;
    changes.meta[key] = next[key];
    hasChanges = true;
  });

  return hasChanges ? changes : null;
}

function stateFromSnapshot(snapshot: StoredSnapshot): BrowserState {
  const blank = M.blank();
  const graph: Record<string, Graph> = {};
  const graphOf = (ws: string) => (graph[ws] ??= { nodes: [], edges: [] });
  (snapshot.entities.graphNodes as StoredNode[]).forEach(({ ws, position, ...node }) => {
    void position;
    graphOf(ws).nodes.push(node);
  });
  (snapshot.entities.graphEdges as StoredEdge[]).forEach(({ ws, ...edge }) => graphOf(ws).edges.push(edge));
  const meta = snapshot.meta as Partial<BrowserState>;
  const stripPosition = <T extends Entity>(entities: Entity[]) =>
    entities.map(entity => {
      const { position, ...rest } = entity as T & { position?: number };
      void position;
      return rest as T;
    });

  return {
    ...blank,
    ...meta,
    favicons: meta.favicons ?? {},
    snapshots: meta.snapshots ?? [],
    settings: { ...blank.settings, ...meta.settings },
    workspaces: stripPosition<BrowserState['workspaces'][number]>(snapshot.entities.workspaces),
    tabs: stripPosition<BrowserState['tabs'][number]>(snapshot.entities.tabs),
    history: snapshot.entities.history as BrowserState['history'],
    bookmarks: snapshot.entities.bookmarks as BrowserState['bookmarks'],
    clips: snapshot.entities.clips as BrowserState['clips'],
    graph,
  };
}

function loadFromLocalStorage(): BrowserState | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as BrowserState) : null;
    if (!stored?.workspaces?.length) return null;
    const blank = M.blank();
    return { ...blank, ...stored, favicons: stored.favicons ?? {}, snapshots: stored.snapshots ?? [], settings: { ...blank.settings, ...stored.settings } };
  } catch {
    return null;
  }
}

// Data saved before Google became the default still says DuckDuckGo; switch it once.
function applySearchDefaults(state: BrowserState): BrowserState {
  if (state.settings.searchDefaultsApplied) return state;
  return { ...state, settings: { ...state.settings, engine: 'google', searchDefaultsApplied: true } };
}

/** Removes the sample data that earlier versions created, once. Works on a copy so the saved state still shows what to delete. */
function applySampleCleanup(state: BrowserState): BrowserState {
  if (state.settings.sampleDataRemoved) return state;
  const next = structuredClone(state);
  M.removeSampleData(next);
  next.settings.sampleDataRemoved = true;
  return next;
}

function migrate(state: BrowserState): BrowserState {
  return applySampleCleanup(applySearchDefaults(state));
}

/** The state to start with: the database, else existing localStorage data (migrated on first save), else a fresh start. */
export function loadInitialState(): InitialState {
  const snapshot = window.desktop?.db?.load() as StoredSnapshot | null | undefined;
  if (snapshot) {
    const state = stateFromSnapshot(snapshot);
    if (state.workspaces.length) return { state: migrate(state), savedState: state };
  }
  return { state: migrate(loadFromLocalStorage() ?? M.fresh()), savedState: null };
}

export function saveChanges(changes: StorageChanges): Promise<void> {
  return window.desktop?.db?.save(changes) ?? Promise.resolve();
}

export function saveChangesNow(changes: StorageChanges): boolean {
  return window.desktop?.db?.saveSync(changes) ?? false;
}

export function saveToLocalStorage(state: BrowserState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage is full or blocked; the next change tries again.
  }
}
