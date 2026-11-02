import { ENGINES } from '../data/urls';
import { hasNativeTabs, type SearchEngineId } from './nativeTabs';

/** True inside Electron, where the main process can fetch the engine's live suggestions. */
export function hasSearchSuggestions(): boolean {
  return !!window.desktop?.search;
}

/** Autocomplete suggestions from the search engine; an empty list when offline or outside Electron. */
export function fetchSearchSuggestions(engine: SearchEngineId, query: string): Promise<string[]> {
  const request = window.desktop?.search?.suggest(engine, query);
  return request ? request.catch(() => []) : Promise.resolve([]);
}

/** For example "Google Search". */
export function searchLabel(engine: SearchEngineId): string {
  return hasNativeTabs() ? `${ENGINES[engine].name} Search` : `${ENGINES[engine].name} Search (desktop app)`;
}

export function searchPlaceholder(engine: SearchEngineId): string {
  return hasNativeTabs() ? `Search ${ENGINES[engine].name} or type a URL` : 'Search or enter address';
}
