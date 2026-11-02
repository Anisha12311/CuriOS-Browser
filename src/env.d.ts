interface NativeTabBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface NativeTabState {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  didNavigate: boolean;
}

interface NativeTabsBridge {
  show(id: string, url: string): void;
  hide(): void;
  setBounds(bounds: NativeTabBounds): void;
  setOverlay(isOpen: boolean): void;
  /** A JPEG (base64) of the visible page, or null when no page is showing. */
  capture(): Promise<{ id: string; dataUrl: string } | null>;
  back(id: string): void;
  forward(id: string): void;
  reload(id: string): void;
  stop(id: string): void;
  close(id: string): void;
  onState(listener: (state: NativeTabState) => void): () => void;
  onFavicon(listener: (payload: { id: string; favicon: string | null }) => void): () => void;
  onError(listener: (payload: { id: string; url: string; message: string }) => void): () => void;
  onOpen(listener: (payload: { url: string }) => void): () => void;
  onSearch(listener: (payload: { query: string }) => void): () => void;
  onClip(listener: (payload: { id: string; text: string }) => void): () => void;
  onNote(listener: (payload: { id: string; text: string }) => void): () => void;
  /** A CuriOS keyboard shortcut pressed while a page had focus. */
  onShortcut(listener: (init: KeyboardEventInit) => void): () => void;
}

interface HistorySearchRequest {
  query: string;
  ws?: string | null;
  limit?: number;
  offset?: number;
}

interface DatabaseBridge {
  load(): unknown;
  save(changes: unknown): Promise<void>;
  saveSync(changes: unknown): boolean;
  searchHistory(request: HistorySearchRequest): Promise<unknown[]>;
}

interface DesktopBridge {
  platform: string;
  minimize(): void;
  maximize(): void;
  close(): void;
  db?: DatabaseBridge;
  privacy?: {
    setLevel(level: 'standard' | 'strict' | 'off'): void;
    /** Blocked tracker requests since the last message, per tab id. */
    onBlocked(listener: (countByTab: Record<string, number>) => void): () => void;
    /** Size of the HTTP cache in bytes. */
    cacheSize(): Promise<number>;
    clearData(options: { cookies?: boolean; cache?: boolean }): Promise<void>;
  };
  search?: { suggest(engine: string, query: string): Promise<string[]> };
  tabs?: NativeTabsBridge;
}

interface Window {
  desktop?: DesktopBridge;
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}
