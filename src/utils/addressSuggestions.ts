import { kindOf, resolve } from '../data/urls';
import type { BrowserState } from '../state/types';
import type { IconName } from '../components/Icon/Icon';

export interface AddressSuggestion {
  id: string;
  kind: 'go' | 'tab' | 'url';
  label: string;
  sub?: string;
  value: string;
  icon: IconName;
}

const MAX_SUGGESTIONS = 10;
const MAX_WEB_SUGGESTIONS = 5;

interface SearchOptions {
  /** Live suggestions from the search engine, already fetched. */
  webSuggestions: string[];
  /** For example "Google Search". */
  searchLabel: string;
}

/** Address bar suggestions: the typed value, engine suggestions, then open tabs, bookmarks and history. */
export function buildAddressSuggestions(
  state: BrowserState,
  wsId: string,
  query: string,
  { webSuggestions, searchLabel }: SearchOptions,
) {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const lowerQuery = trimmed.toLowerCase();
  const isSearch = resolve(trimmed)?.url.startsWith('synapse://search') ?? true;
  const suggestions: AddressSuggestion[] = [
    {
      id: 'go',
      kind: 'go',
      label: isSearch ? trimmed : `Go to ${trimmed}`,
      sub: isSearch ? searchLabel : undefined,
      value: trimmed,
      icon: isSearch ? 'search' : 'globe',
    },
    ...webSuggestions.slice(0, MAX_WEB_SUGGESTIONS).map(text => ({
      id: `web-${text}`,
      kind: 'go' as const,
      label: text,
      value: text,
      icon: 'search' as const,
    })),
  ];
  const seenIds = new Set<string>();
  function add(suggestion: AddressSuggestion) {
    if (seenIds.has(suggestion.id)) return;
    seenIds.add(suggestion.id);
    suggestions.push(suggestion);
  }
  const matches = (text: string) => text.toLowerCase().includes(lowerQuery);

  state.tabs
    .filter(tab => kindOf(tab.url) !== 'internal' && matches(tab.title + ' ' + tab.url))
    .forEach(tab =>
      add({ id: `tab-${tab.id}`, kind: 'tab', label: tab.title, sub: 'Switch to tab', value: tab.id, icon: 'tabs' }),
    );
  state.bookmarks
    .filter(bookmark => bookmark.ws === wsId && matches(bookmark.title + ' ' + bookmark.url))
    .forEach(bookmark =>
      add({ id: `url-${bookmark.url}`, kind: 'url', label: bookmark.title, sub: 'Bookmark', value: bookmark.url, icon: 'star' }),
    );
  state.history
    .filter(entry => entry.ws === wsId && matches(entry.title + ' ' + entry.url))
    .forEach(entry =>
      add({ id: `url-${entry.url}`, kind: 'url', label: entry.title, sub: 'History', value: entry.url, icon: 'clock' }),
    );
  return suggestions.slice(0, MAX_SUGGESTIONS);
}
