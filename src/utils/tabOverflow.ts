import type { BrowserTab } from '../state/types';

const TAB_SLOT_WIDTH = 168;
const PINNED_TAB_WIDTH = 52;
// Room kept for the "+N" button and the new-tab button.
const RESERVED_WIDTH = 140;
const MIN_VISIBLE_TABS = 2;

/** Splits tabs into those that fit the strip and the overflow, keeping the active and most recent tabs visible. */
export function splitOverflowTabs(tabs: BrowserTab[], activeTabId: string | undefined, availableWidth: number) {
  const pinnedTabs = tabs.filter(tab => tab.pinned);
  const unpinnedTabs = tabs.filter(tab => !tab.pinned);
  if (!availableWidth) return { visibleTabs: tabs, hiddenTabs: [] };

  const maxVisible = Math.max(
    MIN_VISIBLE_TABS,
    Math.floor((availableWidth - RESERVED_WIDTH - pinnedTabs.length * PINNED_TAB_WIDTH) / TAB_SLOT_WIDTH),
  );
  if (unpinnedTabs.length <= maxVisible) return { visibleTabs: tabs, hiddenTabs: [] };

  const byRecentUse = [...unpinnedTabs].sort((a, b) => b.last - a.last);
  const shownIds = new Set<string>();
  if (activeTabId && unpinnedTabs.some(tab => tab.id === activeTabId)) shownIds.add(activeTabId);
  byRecentUse.forEach(tab => {
    if (shownIds.size < maxVisible) shownIds.add(tab.id);
  });
  return {
    visibleTabs: tabs.filter(tab => tab.pinned || shownIds.has(tab.id)),
    hiddenTabs: byRecentUse.filter(tab => !shownIds.has(tab.id)),
  };
}
