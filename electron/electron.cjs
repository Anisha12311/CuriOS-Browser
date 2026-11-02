const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("node:path");
const { registerDatabase } = require("./db.cjs");
const { registerSearch } = require("./search.cjs");
const { createPrivacy } = require("./privacy.cjs");
const { createTabManager } = require("./tabs.cjs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
  });
  win.setMenuBarVisibility(false);
  const tabs = createTabManager(win);
  createPrivacy(win, tabs.tabIdFor);
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.webContents.on("before-input-event", (event, input) => {
      if (
        input.type === "keyDown" &&
        (input.key === "F12" ||
          (input.control && input.shift && input.key.toLowerCase() === "i"))
      ) {
        win.webContents.toggleDevTools();
      }
    });

    win.loadURL("http://localhost:5173");
  }
};
ipcMain.on("window:minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window:maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on("window:close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});
app.whenReady().then(() => {
  registerDatabase();
  registerSearch();
  createWindow();
});

app.on("window-all-closed", () => {
  Menu.setApplicationMenu(null);

  if (process.platform !== "darwin") app.quit();
});
