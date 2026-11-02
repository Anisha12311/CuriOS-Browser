const { WebContentsView, ipcMain } = require("electron");

// One real Chromium page per browser tab. Only the active tab's view is attached to the window.
function createTabManager(win) {
  const views = new Map();
  let activeId = null;
  let bounds = { x: 0, y: 0, width: 0, height: 0 };
  let isOverlayOpen = false;

  function sendState(id, view, didNavigate) {
    if (win.isDestroyed()) return;
    const contents = view.webContents;
    win.webContents.send("tab:state", {
      id,
      url: contents.getURL(),
      title: contents.getTitle(),
      isLoading: contents.isLoading(),
      canGoBack: contents.navigationHistory.canGoBack(),
      canGoForward: contents.navigationHistory.canGoForward(),
      didNavigate,
    });
  }

  function createView(id) {
    const view = new WebContentsView({
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
    });
    const contents = view.webContents;
    contents.on("did-navigate", () => sendState(id, view, true));
    contents.on("did-navigate-in-page", (_event, _url, isMainFrame) => {
      if (isMainFrame) sendState(id, view, true);
    });
    contents.on("page-title-updated", () => sendState(id, view, false));
    contents.on("did-start-loading", () => sendState(id, view, false));
    contents.on("did-stop-loading", () => sendState(id, view, false));
    contents.on("page-favicon-updated", (_event, favicons) => {
      if (!win.isDestroyed()) win.webContents.send("tab:favicon", { id, favicon: favicons[0] ?? null });
    });
    contents.on("did-fail-load", (_event, errorCode, errorDescription, url, isMainFrame) => {
      // -3 is an aborted load, which happens on every redirect.
      if (isMainFrame && errorCode !== -3 && !win.isDestroyed()) {
        win.webContents.send("tab:error", { id, url, message: errorDescription });
      }
    });
    contents.setWindowOpenHandler(({ url }) => {
      if (!win.isDestroyed()) win.webContents.send("tab:open", { url });
      return { action: "deny" };
    });
    views.set(id, view);
    return view;
  }

  function attachActive() {
    for (const [id, view] of views) {
      const shouldShow = id === activeId && !isOverlayOpen;
      const isShown = win.contentView.children.includes(view);
      if (shouldShow && !isShown) win.contentView.addChildView(view);
      if (!shouldShow && isShown) win.contentView.removeChildView(view);
    }
    const active = activeId && views.get(activeId);
    if (active) active.setBounds(bounds);
  }

  ipcMain.on("tab:show", (_event, { id, url }) => {
    const view = views.get(id) ?? createView(id);
    if (url && view.webContents.getURL() !== url) view.webContents.loadURL(url);
    activeId = id;
    attachActive();
  });
  ipcMain.on("tab:hide", () => {
    activeId = null;
    attachActive();
  });
  ipcMain.on("tab:bounds", (_event, nextBounds) => {
    bounds = {
      x: Math.round(nextBounds.x),
      y: Math.round(nextBounds.y),
      width: Math.max(0, Math.round(nextBounds.width)),
      height: Math.max(0, Math.round(nextBounds.height)),
    };
    attachActive();
  });
  ipcMain.on("tab:overlay", (_event, isOpen) => {
    isOverlayOpen = isOpen;
    attachActive();
  });
  ipcMain.on("tab:back", (_event, id) => views.get(id)?.webContents.navigationHistory.goBack());
  ipcMain.on("tab:forward", (_event, id) => views.get(id)?.webContents.navigationHistory.goForward());
  ipcMain.on("tab:reload", (_event, id) => views.get(id)?.webContents.reload());
  ipcMain.on("tab:stop", (_event, id) => views.get(id)?.webContents.stop());
  ipcMain.on("tab:close", (_event, id) => {
    const view = views.get(id);
    if (!view) return;
    if (win.contentView.children.includes(view)) win.contentView.removeChildView(view);
    view.webContents.close();
    views.delete(id);
    if (activeId === id) activeId = null;
  });
}

module.exports = { createTabManager };
