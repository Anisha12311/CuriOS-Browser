# CuriOS Browser

**The research browser for curious minds.**

CuriOS is a desktop web browser built for research. Alongside normal browsing, it maps the pages you visit into a research graph, lets you clip text and write notes linked to pages, and keeps each project in its own workspace.

It is built with Electron, React, TypeScript and MUI. Everything is stored on your computer in a local SQLite database.

---

## Features

### Browsing
- Real Chromium pages in every tab, with back, forward, reload and a loading bar.
- Search from the address bar using Google, Bing or DuckDuckGo, with live suggestions as you type.
- Address bar suggestions from your history, bookmarks and open tabs.
- Tabs on top or in the sidebar, with an overflow menu when many are open.
- A right-click menu on every page:
  - open a link in a new tab, or copy it
  - copy an image
  - search the web for the selected text
  - clip the selection, or add it as a note
  - view the page source, or inspect the page
- A command palette (**Ctrl+K**) to search tabs, history, bookmarks and commands.

### Research
- **Research graph**: every page you visit becomes a card, and following a link draws a line between pages. Add your own notes and questions, link them with labels such as *supports*, *answers* or *contradicts*, then drag, zoom and filter.
- **Research panel**: clips, notes and your browsing trail beside the page you are reading.
- **Notes**: linked to the page you wrote them on, with editing in place and starring.
- **Workspaces**: separate projects, each with its own tabs, history, bookmarks and graph.

### Library and sessions
- Bookmarks (**Ctrl+D**) and history grouped by day, searchable and filtered by workspace.
- Session snapshots: save all open tabs and reopen them later.
- Reopen recently closed tabs.

### Privacy
- Tracker blocking with three levels:
  - **Standard** blocks ad, analytics and social trackers.
  - **Strict** also blocks tag managers and fingerprinting.
  - **Off** blocks nothing.

  Live counts show how many trackers were blocked.
- Sites must ask before using your location, camera, microphone, notifications or screen. USB, serial and similar devices are blocked.
- One-click clearing of history, cookies and site data, and the cache.
- Nothing leaves your device except the pages you visit and the search suggestions you request.

---

## Getting started

**Requirements:** Node.js 22 or newer, and npm.

```bash
cd frontend
npm install
npm start
```

`npm start` runs the Vite dev server and opens the CuriOS desktop window once the server is ready.

### Scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the full desktop app in development mode. |
| `npm run dev` | Runs only the web UI at http://localhost:5173. This is a preview: web pages open in a limited frame, and tracker blocking, real tabs and the database are not available. |
| `npm run electron` | Opens the desktop window against an already-running dev server. |
| `npm run build` | Builds the UI into `dist/`. |
| `npm run dist` | Builds the UI and packages the app with electron-builder. Packaging is not configured or tested yet. |

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+K | Command palette |
| Ctrl+D or Alt+D | Bookmark the current page |
| Alt+T | New tab |
| Alt+Shift+T | Reopen closed tab |
| Alt+W | Close tab |
| Alt+G | Research graph |
| Alt+R | Reload |
| Alt+← / Alt+→ | Back / Forward |
| Alt+1 … Alt+9 | Switch workspace |

Shortcuts work even while a web page has focus.

---

## Project structure

```
frontend/
├─ electron/                 Electron main process
│  ├─ electron.cjs           App window and startup
│  ├─ tabs.cjs               One Chromium view per tab, context menu, shortcuts
│  ├─ privacy.cjs            Tracker blocking, permissions, clearing site data
│  ├─ db.cjs                 SQLite database (node:sqlite) with full-text history search
│  ├─ search.cjs             Search suggestions from Google, Bing and DuckDuckGo
│  └─ preload.cjs            The safe bridge (window.desktop) between the UI and Electron
└─ src/                      React UI
   ├─ components/            Toolbar, tab strip, sidebar, research panel, dialogs…
   ├─ pages/                 New tab, Graph, Library, Workspaces, Privacy, Settings, Restore
   ├─ state/                 App state, data model and types
   ├─ services/              Native tabs, storage and search-suggestion helpers
   ├─ hooks/                 Persistence, popups over pages, suggestions
   ├─ styled/MUI/            MUI styled components (no plain CSS files)
   ├─ styled/theme/          Theme and design tokens
   └─ utils/                 Graph geometry, suggestions, time formatting…
```

### How it works
- **Tabs**: each tab is an Electron `WebContentsView`, a real Chromium page placed over the React content area. When a popup opens, the page is replaced by a screenshot so the popup can sit on top.
- **Storage**: app state is saved to `synapse.db` in Electron's user-data folder. Only changed rows are written, a fraction of a second after each change, and everything is flushed when the window closes. The file keeps its earlier name so existing data still loads.
- **Styling**: every component uses MUI `styled()` with values from the shared theme.
- **Internal pages**: these use `synapse://` addresses, for example `synapse://graph`. The scheme keeps its earlier name for the same reason.

---

## Tech stack

Electron 45 · React 19 · TypeScript · MUI 9 · Vite 8 · SQLite (`node:sqlite`)
