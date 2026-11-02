import { hostOf, kindOf } from '../data/sites';
import type { IconName } from '../components/Icon/Icon';
import type { BrowserApi } from '../state/BrowserContext';
import type { PaletteTone } from '../styled/MUI/Overlay.styles';

export type PaletteFilter = 'all' | 'tabs' | 'actions' | 'workspaces';

export interface PaletteItem {
  id: string;
  title: string;
  sub?: string;
  tone: PaletteTone;
  icon?: IconName;
  faviconUrl?: string;
  swatch?: string;
  shortcut?: string;
  actionLabel?: string;
  keywords: string;
  onRun(): void;
}

export interface PaletteSectionData {
  title: string;
  items: PaletteItem[];
}

const RECENT_SEARCH_COUNT = 3;
const SUGGESTED_ACTION_COUNT = 3;

function actionItems(browser: BrowserApi): PaletteItem[] {
  const { state } = browser;
  const openPage = (name: string) => () => browser.openInternal(name);
  const lastClosed = state.closed[0];
  const items: PaletteItem[] = [
    { id: 'new-tab', title: 'Open a new tab', sub: 'Start from the address bar', tone: 'blue', icon: 'plus', shortcut: 'Alt+T', actionLabel: 'New tab', keywords: 'new tab open', onRun: browser.newTab },
    { id: 'new-ws', title: 'Create a workspace', sub: 'Keep a new line of research separate', tone: 'purple', icon: 'grid', actionLabel: 'Create', keywords: 'workspace create new', onRun: openPage('workspaces') },
    { id: 'graph', title: 'Show the research graph', sub: 'Pages, notes and questions as a map', tone: 'blue', icon: 'graph', shortcut: 'Alt+G', actionLabel: 'Show', keywords: 'graph research map', onRun: openPage('graph') },
    { id: 'library', title: 'Show bookmarks and history', sub: `${state.bookmarks.length} bookmarks saved`, tone: 'amber', icon: 'bookmark', actionLabel: 'Show', keywords: 'bookmarks history library', onRun: openPage('library') },
    { id: 'privacy', title: 'Review privacy and permissions', sub: `Tracker protection: ${state.settings.trackers}`, tone: 'green', icon: 'shield', actionLabel: 'Review', keywords: 'privacy tracker permissions security', onRun: openPage('privacy') },
    { id: 'snapshot', title: 'Save a session snapshot', sub: 'Keep today’s tabs and graph', tone: 'blue', icon: 'dl', actionLabel: 'Save', keywords: 'snapshot save session', onRun: browser.saveSnapshot },
    { id: 'restore', title: 'Restore a session', sub: `${state.closed.length} recently closed tabs`, tone: 'blue', icon: 'undo', actionLabel: 'Open', keywords: 'restore session crash', onRun: openPage('restore') },
    { id: 'settings', title: 'Open settings', sub: 'Search, tabs, privacy', tone: 'slate', icon: 'gear', actionLabel: 'Open', keywords: 'settings preferences', onRun: openPage('settings') },
    { id: 'layout', title: state.settings.vtabs ? 'Show tabs on top' : 'Show tabs in the sidebar', sub: 'Switch the tab layout', tone: 'blue', icon: 'menu', actionLabel: 'Switch', keywords: 'sidebar vertical tabs layout', onRun: browser.toggleVtabs },
  ];
  if (lastClosed) {
    items.splice(1, 0, { id: 'reopen', title: 'Reopen closed tab', sub: lastClosed.tab.title, tone: 'blue', icon: 'undo', shortcut: 'Alt+Shift+T', actionLabel: 'Reopen', keywords: 'reopen closed tab', onRun: browser.reopenClosed });
  }
  return items;
}

/** The palette's sections for a query and filter chip, matching the Synapse HTML palette. */
export function buildPaletteSections(browser: BrowserApi, query: string, filter: PaletteFilter): PaletteSectionData[] {
  const { state } = browser;
  const trimmed = query.trim();
  const lowerQuery = trimmed.toLowerCase();
  const matches = (text: string) => !lowerQuery || text.toLowerCase().includes(lowerQuery);
  const isAll = filter === 'all';
  const workspaceNameById = new Map(state.workspaces.map(workspace => [workspace.id, workspace.name]));
  const actions = actionItems(browser);
  const tabs: PaletteItem[] = [...state.tabs]
    .sort((a, b) => b.last - a.last)
    .map(tab => ({
      id: `tab-${tab.id}`,
      title: tab.title,
      sub: `${workspaceNameById.get(tab.ws) ?? ''} · ${kindOf(tab.url) === 'internal' ? 'Synapse' : hostOf(tab.url)}`,
      tone: 'tab' as const,
      faviconUrl: tab.url,
      keywords: `${tab.url} ${workspaceNameById.get(tab.ws) ?? ''}`,
      onRun: () => browser.activate(tab.id),
    }))
    .filter(item => matches(`${item.title} ${item.keywords}`));
  const workspaces: PaletteItem[] = state.workspaces
    .filter(workspace => matches(workspace.name))
    .map((workspace, index) => ({
      id: `ws-${workspace.id}`,
      title: `Switch to ${workspace.name}`,
      sub: `${browser.tabsOf(workspace.id).length} tabs`,
      tone: 'purple' as const,
      swatch: workspace.color,
      shortcut: `Alt+${index + 1}`,
      keywords: workspace.name,
      onRun: () => browser.switchWs(workspace.id),
    }));

  if (!lowerQuery) {
    return [
      {
        title: 'Recent searches',
        items: isAll
          ? state.recent.slice(0, RECENT_SEARCH_COUNT).map(recent => ({
              id: `recent-${recent}`,
              title: recent,
              sub: 'Recent search',
              tone: 'slate' as const,
              icon: 'clock' as const,
              keywords: recent,
              onRun: () => browser.openTab(recent),
            }))
          : [],
      },
      { title: 'Suggested actions', items: isAll ? actions.slice(0, SUGGESTED_ACTION_COUNT) : [] },
      { title: 'All actions', items: filter === 'actions' ? actions : [] },
      { title: isAll ? 'Recently opened' : 'Open tabs', items: isAll || filter === 'tabs' ? tabs.slice(0, isAll ? 4 : 10) : [] },
      { title: 'Workspaces', items: filter === 'workspaces' ? workspaces : [] },
    ].filter(section => section.items.length);
  }

  const bookmarks: PaletteItem[] = state.bookmarks
    .filter(bookmark => matches(`${bookmark.title} ${bookmark.url}`))
    .slice(0, 4)
    .map(bookmark => ({
      id: `bm-${bookmark.id}`,
      title: bookmark.title,
      sub: hostOf(bookmark.url),
      tone: 'amber' as const,
      icon: 'bookmark' as const,
      keywords: bookmark.url,
      onRun: () => browser.openTab(bookmark.url),
    }));
  const closed: PaletteItem[] = state.closed
    .filter(entry => matches(`${entry.tab.title} ${entry.tab.url}`))
    .slice(0, 3)
    .map(entry => ({
      id: `closed-${entry.tab.id}-${entry.at}`,
      title: entry.tab.title,
      sub: 'Closed tab',
      tone: 'blue' as const,
      icon: 'undo' as const,
      actionLabel: 'Reopen',
      keywords: entry.tab.url,
      onRun: () => browser.openTab(entry.tab.url),
    }));
  return [
    {
      title: 'Search',
      items: isAll
        ? [{ id: 'search', title: `Search for “${trimmed}”`, sub: 'Built-in demo sites', tone: 'blue' as const, icon: 'search' as const, actionLabel: 'Search', keywords: '', onRun: () => browser.openTab(trimmed) }]
        : [],
    },
    { title: 'Open tabs', items: isAll || filter === 'tabs' ? tabs.slice(0, 6) : [] },
    { title: 'Actions', items: isAll || filter === 'actions' ? actions.filter(item => matches(`${item.title} ${item.keywords}`)).slice(0, 5) : [] },
    { title: 'Workspaces', items: isAll || filter === 'workspaces' ? workspaces : [] },
    { title: 'Bookmarks', items: isAll ? bookmarks : [] },
    { title: 'Recently closed', items: isAll ? closed : [] },
  ].filter(section => section.items.length);
}
