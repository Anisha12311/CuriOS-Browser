import { useEffect, useState } from 'react';
import { resolve } from '../data/urls';
import type { SearchEngineId } from '../services/nativeTabs';
import { fetchSearchSuggestions, hasSearchSuggestions } from '../services/searchSuggestions';

const DEBOUNCE_MS = 120;

/** Live search-engine suggestions for what the user is typing. Addresses such as "github.com" are not sent. */
export function useSearchSuggestions(query: string, engine: SearchEngineId, isEnabled: boolean): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const trimmed = query.trim();
  const isSearchText = !!trimmed && (resolve(trimmed)?.url.startsWith('synapse://search') ?? false);
  const shouldFetch = isEnabled && isSearchText && hasSearchSuggestions();

  useEffect(() => {
    if (!shouldFetch) return;
    let isCurrent = true;
    const timer = window.setTimeout(() => {
      fetchSearchSuggestions(engine, trimmed).then(items => {
        // A slower reply for older text must not replace the newer one.
        if (isCurrent) setSuggestions(items.filter(item => item.toLowerCase() !== trimmed.toLowerCase()));
      });
    }, DEBOUNCE_MS);
    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [shouldFetch, engine, trimmed]);

  return shouldFetch ? suggestions : [];
}
