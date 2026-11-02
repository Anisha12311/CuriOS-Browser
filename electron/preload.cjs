const { contextBridge, ipcRenderer } = require("electron");

function subscribe(channel, listener) {
  const handler = (_event, payload) => listener(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld("desktop", {
  platform: process.platform,
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  privacy: {
    setLevel: (level) => ipcRenderer.send("privacy:set-level", level),
    onBlocked: (listener) => subscribe("privacy:blocked", listener),
    cacheSize: () => ipcRenderer.invoke("privacy:cache-size"),
    clearData: (options) => ipcRenderer.invoke("privacy:clear-data", options),
  },
  search: {
    suggest: (engine, query) => ipcRenderer.invoke("search:suggest", { engine, query }),
  },
  db: {
    load: () => ipcRenderer.sendSync("db:load"),
    save: (changes) => ipcRenderer.invoke("db:save", changes),
    saveSync: (changes) => ipcRenderer.sendSync("db:save-sync", changes),
    searchHistory: (request) => ipcRenderer.invoke("db:search-history", request),
  },
  tabs: {
    show: (id, url) => ipcRenderer.send("tab:show", { id, url }),
    hide: () => ipcRenderer.send("tab:hide"),
    setBounds: (bounds) => ipcRenderer.send("tab:bounds", bounds),
    setOverlay: (isOpen) => ipcRenderer.send("tab:overlay", isOpen),
    capture: () => ipcRenderer.invoke("tab:capture"),
    back: (id) => ipcRenderer.send("tab:back", id),
    forward: (id) => ipcRenderer.send("tab:forward", id),
    reload: (id) => ipcRenderer.send("tab:reload", id),
    stop: (id) => ipcRenderer.send("tab:stop", id),
    close: (id) => ipcRenderer.send("tab:close", id),
    onState: (listener) => subscribe("tab:state", listener),
    onFavicon: (listener) => subscribe("tab:favicon", listener),
    onError: (listener) => subscribe("tab:error", listener),
    onOpen: (listener) => subscribe("tab:open", listener),
    onSearch: (listener) => subscribe("tab:search", listener),
    onClip: (listener) => subscribe("tab:clip", listener),
    onNote: (listener) => subscribe("tab:note", listener),
    onShortcut: (listener) => subscribe("tab:shortcut", listener),
  },
});
