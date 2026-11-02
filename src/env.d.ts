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
  back(id: string): void;
  forward(id: string): void;
  reload(id: string): void;
  stop(id: string): void;
  close(id: string): void;
  onState(listener: (state: NativeTabState) => void): () => void;
  onFavicon(listener: (payload: { id: string; favicon: string | null }) => void): () => void;
  onError(listener: (payload: { id: string; url: string; message: string }) => void): () => void;
  onOpen(listener: (payload: { url: string }) => void): () => void;
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
