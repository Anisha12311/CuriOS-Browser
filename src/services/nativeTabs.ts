import { ENGINES, kindOf, queryOf } from '../data/sites';

export type SearchEngineId = keyof typeof ENGINES;

/** True when running inside the Electron shell, where tabs are real Chromium pages. */
export function hasNativeTabs(): boolean {
  return !!window.desktop?.tabs;
}

/** True for URLs that load in a native Electron view instead of a React page or demo iframe. */
export function isNativeUrl(url: string): boolean {
  return hasNativeTabs() && kindOf(url) === 'external';
}

/** In Electron, a typed search goes to the real search engine; in a plain browser it stays on the demo search page. */
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

export function setNativeOverlay(isOpen: boolean) {
  window.desktop?.tabs?.setOverlay(isOpen);
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
