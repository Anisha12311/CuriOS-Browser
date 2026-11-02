const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { app, ipcMain } = require("electron");

const SCHEMA_VERSION = 1;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL,
  isolate INTEGER NOT NULL, graph INTEGER NOT NULL, active INTEGER NOT NULL, position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tabs (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, url TEXT NOT NULL, title TEXT NOT NULL,
  pinned INTEGER NOT NULL, grp TEXT, stack TEXT NOT NULL, idx INTEGER NOT NULL,
  last INTEGER NOT NULL, sleeping INTEGER NOT NULL, last_node TEXT, position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS history (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, url TEXT NOT NULL, title TEXT NOT NULL, ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS history_ws_ts ON history (ws, ts DESC);
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, url TEXT NOT NULL, title TEXT NOT NULL, folder TEXT NOT NULL, ts INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS clips (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, node_id TEXT, text TEXT NOT NULL, url TEXT NOT NULL,
  title TEXT NOT NULL, ts INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS graph_nodes (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, type TEXT NOT NULL, x REAL NOT NULL, y REAL NOT NULL,
  ts INTEGER NOT NULL, url TEXT, title TEXT, key TEXT, text TEXT, visits INTEGER, star INTEGER,
  position INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS graph_edges (
  id TEXT PRIMARY KEY, ws TEXT NOT NULL, a TEXT NOT NULL, b TEXT NOT NULL, label TEXT NOT NULL
);
CREATE VIRTUAL TABLE IF NOT EXISTS history_fts USING fts5(title, url, content='history', content_rowid='rowid');
CREATE TRIGGER IF NOT EXISTS history_ai AFTER INSERT ON history BEGIN
  INSERT INTO history_fts (rowid, title, url) VALUES (new.rowid, new.title, new.url);
END;
CREATE TRIGGER IF NOT EXISTS history_ad AFTER DELETE ON history BEGIN
  INSERT INTO history_fts (history_fts, rowid, title, url) VALUES ('delete', old.rowid, old.title, old.url);
END;
CREATE TRIGGER IF NOT EXISTS history_au AFTER UPDATE ON history BEGIN
  INSERT INTO history_fts (history_fts, rowid, title, url) VALUES ('delete', old.rowid, old.title, old.url);
  INSERT INTO history_fts (rowid, title, url) VALUES (new.rowid, new.title, new.url);
END;
`;

const bool = (value) => (value ? 1 : 0);
const orNull = (value) => (value === undefined ? null : value);

// Column order per table, and how a renderer entity maps to and from a row.
const TABLES = {
  workspaces: {
    columns: ["id", "name", "color", "isolate", "graph", "active", "position"],
    order: "position",
    toRow: (w) => [w.id, w.name, w.color, bool(w.isolate), bool(w.graph), w.active, w.position],
    fromRow: (r) => ({ id: r.id, name: r.name, color: r.color, isolate: !!r.isolate, graph: !!r.graph, active: r.active }),
  },
  tabs: {
    columns: ["id", "ws", "url", "title", "pinned", "grp", "stack", "idx", "last", "sleeping", "last_node", "position"],
    order: "position",
    toRow: (t) => [t.id, t.ws, t.url, t.title, bool(t.pinned), orNull(t.group), JSON.stringify(t.stack), t.i, t.last, bool(t.sleeping), orNull(t.lastNode), t.position],
    fromRow: (r) => ({
      id: r.id, ws: r.ws, url: r.url, title: r.title, pinned: !!r.pinned, group: r.grp,
      stack: JSON.parse(r.stack), i: r.idx, last: r.last, sleeping: !!r.sleeping, lastNode: r.last_node,
    }),
  },
  history: {
    columns: ["id", "ws", "url", "title", "ts"],
    order: "ts DESC",
    toRow: (h) => [h.id, h.ws, h.url, h.title, h.ts],
    fromRow: (r) => ({ id: r.id, ws: r.ws, url: r.url, title: r.title, ts: r.ts }),
  },
  bookmarks: {
    columns: ["id", "ws", "url", "title", "folder", "ts"],
    order: "ts DESC",
    toRow: (b) => [b.id, b.ws, b.url, b.title, b.folder, b.ts],
    fromRow: (r) => ({ id: r.id, ws: r.ws, url: r.url, title: r.title, folder: r.folder, ts: r.ts }),
  },
  clips: {
    columns: ["id", "ws", "node_id", "text", "url", "title", "ts"],
    order: "ts DESC",
    toRow: (c) => [c.id, c.ws, orNull(c.nodeId), c.text, c.url, c.title, c.ts],
    fromRow: (r) => ({ id: r.id, ws: r.ws, nodeId: r.node_id, text: r.text, url: r.url, title: r.title, ts: r.ts }),
  },
  graphNodes: {
    table: "graph_nodes",
    columns: ["id", "ws", "type", "x", "y", "ts", "url", "title", "key", "text", "visits", "star", "position"],
    order: "position",
    toRow: (n) => [n.id, n.ws, n.type, n.x, n.y, n.ts, orNull(n.url), orNull(n.title), orNull(n.key), orNull(n.text), orNull(n.visits), n.star === undefined ? null : bool(n.star), n.position],
    fromRow: (r) => {
      const node = { id: r.id, ws: r.ws, type: r.type, x: r.x, y: r.y, ts: r.ts };
      if (r.url !== null) node.url = r.url;
      if (r.title !== null) node.title = r.title;
      if (r.key !== null) node.key = r.key;
      if (r.text !== null) node.text = r.text;
      if (r.visits !== null) node.visits = r.visits;
      if (r.star !== null) node.star = !!r.star;
      return node;
    },
  },
  graphEdges: {
    table: "graph_edges",
    columns: ["id", "ws", "a", "b", "label"],
    order: "rowid",
    toRow: (e) => [e.id, e.ws, e.a, e.b, e.label],
    fromRow: (r) => ({ id: r.id, ws: r.ws, a: r.a, b: r.b, label: r.label }),
  },
};

function tableName(key) {
  return TABLES[key].table ?? key;
}

function openDatabase() {
  const db = new DatabaseSync(path.join(app.getPath("userData"), "synapse.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;");
  db.exec(SCHEMA);
  db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);

  const statements = {};
  for (const key of Object.keys(TABLES)) {
    const { columns, order } = TABLES[key];
    const name = tableName(key);
    const updates = columns.filter((column) => column !== "id").map((column) => `${column} = excluded.${column}`);
    statements[key] = {
      upsert: db.prepare(
        `INSERT INTO ${name} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")}) ` +
          `ON CONFLICT(id) DO UPDATE SET ${updates.join(", ")}`,
      ),
      remove: db.prepare(`DELETE FROM ${name} WHERE id = ?`),
      all: db.prepare(`SELECT * FROM ${name} ORDER BY ${order}`),
    };
  }
  const putMeta = db.prepare("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  const allMeta = db.prepare("SELECT key, value FROM meta");
  const searchHistory = db.prepare(
    "SELECT h.* FROM history_fts f JOIN history h ON h.rowid = f.rowid " +
      "WHERE history_fts MATCH ? AND (? IS NULL OR h.ws = ?) ORDER BY h.ts DESC LIMIT ? OFFSET ?",
  );

  /** Every stored entity and meta value, or null when the database is still empty. */
  function load() {
    const meta = Object.fromEntries(allMeta.all().map((row) => [row.key, JSON.parse(row.value)]));
    if (!meta.settings) return null;
    const entities = {};
    for (const key of Object.keys(TABLES)) entities[key] = statements[key].all.all().map(TABLES[key].fromRow);
    return { meta, entities };
  }

  /** Applies one batch of upserts, deletions and meta values in a single transaction. */
  function save(changes) {
    db.exec("BEGIN");
    try {
      for (const [key, rows] of Object.entries(changes.upserts ?? {})) {
        for (const row of rows) statements[key].upsert.run(...TABLES[key].toRow(row));
      }
      for (const [key, ids] of Object.entries(changes.deletes ?? {})) {
        for (const id of ids) statements[key].remove.run(id);
      }
      for (const [key, value] of Object.entries(changes.meta ?? {})) putMeta.run(key, JSON.stringify(value));
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  function search({ query, ws = null, limit = 50, offset = 0 }) {
    const terms = String(query).trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const match = terms.map((term) => `"${term.replace(/"/g, '""')}"*`).join(" ");
    return searchHistory.all(match, ws, ws, limit, offset).map(TABLES.history.fromRow);
  }

  return { db, load, save, search };
}

function registerDatabase() {
  const store = openDatabase();
  ipcMain.on("db:load", (event) => {
    event.returnValue = store.load();
  });
  ipcMain.handle("db:save", (_event, changes) => store.save(changes));
  // Used on window close, when an async save could be cut off.
  ipcMain.on("db:save-sync", (event, changes) => {
    try {
      store.save(changes);
      event.returnValue = true;
    } catch (error) {
      console.error("[db] save on close failed", error);
      event.returnValue = false;
    }
  });
  ipcMain.handle("db:search-history", (_event, request) => store.search(request));
  app.on("will-quit", () => store.db.close());
}

module.exports = { registerDatabase };
