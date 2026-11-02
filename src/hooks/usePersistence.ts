import { useEffect, useRef } from 'react';
import {
  diffState,
  hasDatabase,
  saveChanges,
  saveChangesNow,
  saveToLocalStorage,
} from '../services/storage';
import type { BrowserState } from '../state/types';

const SAVE_DELAY_MS = 250;

/** Saves state changes: changed rows only to SQLite in Electron, the whole state to localStorage elsewhere. */
export function usePersistence(state: BrowserState, initialSavedState: BrowserState | null, onError: (message: string) => void) {
  const savedStateRef = useRef(initialSavedState);
  const latestStateRef = useRef(state);

  useEffect(() => {
    latestStateRef.current = state;
    const timer = window.setTimeout(() => {
      if (!hasDatabase()) {
        saveToLocalStorage(state);
        return;
      }
      const changes = diffState(savedStateRef.current, state);
      if (!changes) return;
      const previousSavedState = savedStateRef.current;
      savedStateRef.current = state;
      saveChanges(changes).catch((error: unknown) => {
        // Roll back so the next save retries these rows.
        savedStateRef.current = previousSavedState;
        console.error('[storage] save failed', error);
        onError('Could not save your latest changes. They will be retried.');
      });
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state, onError]);

  useEffect(() => {
    // Runs once on mount: flush unsaved changes synchronously when the window closes.
    function handleBeforeUnload() {
      if (!hasDatabase()) {
        saveToLocalStorage(latestStateRef.current);
        return;
      }
      const changes = diffState(savedStateRef.current, latestStateRef.current);
      if (changes && saveChangesNow(changes)) savedStateRef.current = latestStateRef.current;
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}
