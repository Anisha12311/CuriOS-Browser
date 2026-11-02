const { Menu, WebContentsView, clipboard, ipcMain } = require("electron");

// Alt shortcuts the app window handles: tabs, bookmark, graph, reload, history and workspaces 1-9.
const SHORTCUT_KEYS = /^([twdgr1-9]|arrowleft|arrowright)$/;

// One real Chromium page per browser tab. Only the active tab's view is attached to the window.
function createTabManager(win) {
  const views = new Map();
  let activeId = null;
  let bounds = { x: 0, y: 0, width: 0, height: 0 };
  let isOverlayOpen = false;
  const tabIdByContentsId = new Map();
  const lastStateById = new Map();

  function sendState(id, view, didNavigate) {
    if (win.isDestroyed()) return;
    const contents = view.webContents;
    const state = {
      id,
      url: contents.getURL(),
      title: contents.getTitle(),
      // Only the page itself counts; ads and other iframes loading would make the tab spinner flicker.
      isLoading: contents.isLoadingMainFrame(),
      canGoBack: contents.navigationHistory.canGoBack(),
      canGoForward: contents.navigationHistory.canGoForward(),
      didNavigate,
    };
    const key = JSON.stringify(state);
    if (!didNavigate && lastStateById.get(id) === key) return;
    lastStateById.set(id, key);
    win.webContents.send("tab:state", state);
  }

  function showContextMenu(id, contents, params) {
    const send = (channel, payload) => {
      if (!win.isDestroyed()) win.webContents.send(channel, payload);
    };
    const selection = params.selectionText.trim();
    const shortSelection = selection.length > 30 ? selection.slice(0, 30) + "…" : selection;
    const history = contents.navigationHistory;
    const template = [];
    if (params.linkURL) {
      template.push(
        { label: "Open link in new tab", click: () => send("tab:open", { url: params.linkURL }) },
        { label: "Copy link address", click: () => clipboard.writeText(params.linkURL) },
        { type: "separator" },
      );
    }
    if (params.mediaType === "image" && params.srcURL) {
      template.push(
        { label: "Open image in new tab", click: () => send("tab:open", { url: params.srcURL }) },
        { label: "Copy image", click: () => contents.copyImageAt(params.x, params.y) },
        { label: "Copy image address", click: () => clipboard.writeText(params.srcURL) },
        { type: "separator" },
      );
    }
    if (params.isEditable) {
      const flags = params.editFlags;
      template.push(
        { label: "Undo", enabled: flags.canUndo, click: () => contents.undo() },
        { label: "Redo", enabled: flags.canRedo, click: () => contents.redo() },
        { type: "separator" },
        { label: "Cut", enabled: flags.canCut, click: () => contents.cut() },
        { label: "Copy", enabled: flags.canCopy, click: () => contents.copy() },
        { label: "Paste", enabled: flags.canPaste, click: () => contents.paste() },
        { label: "Select all", enabled: flags.canSelectAll, click: () => contents.selectAll() },
        { type: "separator" },
      );
    } else if (selection) {
      template.push(
        { label: "Copy", click: () => contents.copy() },
        { label: `Search the web for “${shortSelection}”`, click: () => send("tab:search", { query: selection }) },
        { type: "separator" },
        { label: "Clip to research panel", click: () => send("tab:clip", { id, text: selection }) },
        { label: "Add as note in graph", click: () => send("tab:note", { id, text: selection }) },
        { type: "separator" },
      );
    }
    if (!params.linkURL && !selection && !params.isEditable && params.mediaType !== "image") {
      template.push(
        { label: "Back", enabled: history.canGoBack(), click: () => history.goBack() },
        { label: "Forward", enabled: history.canGoForward(), click: () => history.goForward() },
        { label: "Reload", click: () => contents.reload() },
        { type: "separator" },
        { label: "View page source", click: () => send("tab:open", { url: "view-source:" + contents.getURL() }) },
      );
    }
    template.push({ label: "Inspect", click: () => contents.inspectElement(params.x, params.y) });
    Menu.buildFromTemplate(template).popup({ window: win });
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
    contents.on("context-menu", (_event, params) => showContextMenu(id, contents, params));
    // A focused page receives the keyboard, so CuriOS's own shortcuts are passed back to the app window.
    contents.on("before-input-event", (event, input) => {
      if (input.type !== "keyDown" || win.isDestroyed()) return;
      const key = input.key.toLowerCase();
      const isAppShortcut = ((input.control || input.meta) && (key === "k" || key === "d")) || (input.alt && SHORTCUT_KEYS.test(key));
      if (!isAppShortcut) return;
      event.preventDefault();
      win.webContents.send("tab:shortcut", { key: input.key, ctrlKey: input.control, metaKey: input.meta, altKey: input.alt, shiftKey: input.shift });
    });
    contents.on("did-start-loading", () => sendState(id, view, false));
    contents.on("did-stop-loading", () => sendState(id, view, false));
    contents.on("did-finish-load", () => sendState(id, view, false));
    contents.on("did-fail-load", () => sendState(id, view, false));
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
    tabIdByContentsId.set(contents.id, id);
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
  // A picture of the visible page, shown in its place while a popup hides the real view.
  ipcMain.handle("tab:capture", async () => {
    const view = activeId && views.get(activeId);
    if (!view || isOverlayOpen || !win.contentView.children.includes(view)) return null;
    try {
      const image = await view.webContents.capturePage();
      return image.isEmpty() ? null : { id: activeId, dataUrl: image.toJPEG(85).toString("base64") };
    } catch {
      return null;
    }
  });
  ipcMain.on("tab:back", (_event, id) => views.get(id)?.webContents.navigationHistory.goBack());
  ipcMain.on("tab:forward", (_event, id) => views.get(id)?.webContents.navigationHistory.goForward());
  ipcMain.on("tab:reload", (_event, id) => views.get(id)?.webContents.reload());
  ipcMain.on("tab:stop", (_event, id) => views.get(id)?.webContents.stop());
  ipcMain.on("tab:close", (_event, id) => {
    const view = views.get(id);
    if (!view) return;
    if (win.contentView.children.includes(view)) win.contentView.removeChildView(view);
    tabIdByContentsId.delete(view.webContents.id);
    lastStateById.delete(id);
    view.webContents.close();
    views.delete(id);
    if (activeId === id) activeId = null;
  });

  /** The tab that owns a page, or undefined for the app window and other pages. */
  return { tabIdFor: (contentsId) => tabIdByContentsId.get(contentsId) };
}

module.exports = { createTabManager };
