import { useEffect, useRef } from 'react';
import { hideNativeTab, setNativeTabBounds, showNativeTab } from '../../services/nativeTabs';
import type { BrowserTab } from '../../state/types';
import { FrameHost } from '../../styled/MUI/Page.styles';

/** Reserves the content area for a real Electron page and keeps the native view sized to it. */
export default function NativeTabView({ tab }: { tab: BrowserTab }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showNativeTab(tab.id, tab.url);
  }, [tab.id, tab.url]);

  useEffect(() => {
    const hostElement = hostRef.current;
    if (!hostElement) return;
    function syncBounds() {
      const rect = hostElement!.getBoundingClientRect();
      setNativeTabBounds({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    }
    syncBounds();
    const observer = new ResizeObserver(syncBounds);
    observer.observe(hostElement);
    window.addEventListener('resize', syncBounds);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncBounds);
      hideNativeTab();
    };
  }, []);

  return <FrameHost ref={hostRef} aria-label={tab.title} />;
}
