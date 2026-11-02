import { ENGINES, kindOf, queryOf } from '../data/urls';

export type SearchEngineId = keyof typeof ENGINES;

/** True when running inside the Electron shell, where tabs are real Chromium pages. */
export function hasNativeTabs(): boolean {
  return !!window.desktop?.tabs;
}

/** True for web URLs, which load in a native Electron view instead of a React page. */
export function isNativeUrl(url: string): boolean {
  return hasNativeTabs() && kindOf(url) === 'external';
}

/** In Electron, a typed search goes to the search engine; the browser preview keeps its search notice page. */
export function toNavigableUrl(url: string, engine: SearchEngineId): string {
  if (!hasNativeTabs() || !url.startsWith('synapse://search')) return url;
  return ENGINES[engine].url + encodeURIComponent(queryOf(url));
}

export function showNativeTab(tabId: string, url: string) {
  window.desktop?.tabs?.show(tabId, url);
}

export function hideNativeTab() {
  window.desktop?.tabs?.hide();
}

export function setNativeTabBounds(bounds: NativeTabBounds) {
  window.desktop?.tabs?.setBounds(bounds);
}

export interface PageSnapshot {
  tabId: string;
  src: string;
}

let snapshot: PageSnapshot | null = null;
const snapshotListeners = new Set<(next: PageSnapshot | null) => void>();
let isOverlayWanted = false;

function publishSnapshot(next: PageSnapshot | null) {
  snapshot = next;
  snapshotListeners.forEach(listener => listener(next));
}

/** Listens for the picture of the page shown while a popup covers it. */
export function subscribePageSnapshot(listener: (next: PageSnapshot | null) => void): () => void {
  snapshotListeners.add(listener);
  listener(snapshot);
  return () => snapshotListeners.delete(listener);
}

const nextPaint = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

/**
 * Native pages paint above the HTML, so popups hide them. A screenshot takes the page's place first,
 * so the page stays visible behind the popup.
 */
export async function setNativeOverlay(isOpen: boolean) {
  const bridge = window.desktop?.tabs;
  if (!bridge) return;
  isOverlayWanted = isOpen;
  if (!isOpen) {
    bridge.setOverlay(false);
    // Keep the picture until the real page is back on screen.
    await nextPaint();
    if (!isOverlayWanted) publishSnapshot(null);
    return;
  }
  const captured = await bridge.capture().catch(() => null);
  if (!isOverlayWanted) return;
  if (captured) {
    publishSnapshot({ tabId: captured.id, src: `data:image/jpeg;base64,${captured.dataUrl}` });
    await nextPaint();
    if (!isOverlayWanted) return;
  }
  bridge.setOverlay(true);
}

export function nativeBack(tabId: string) {
  window.desktop?.tabs?.back(tabId);
}

export function nativeForward(tabId: string) {
  window.desktop?.tabs?.forward(tabId);
}

export function nativeReload(tabId: string) {
  window.desktop?.tabs?.reload(tabId);
}

export function closeNativeTab(tabId: string) {
  window.desktop?.tabs?.close(tabId);
}
