import { useEffect } from 'react';
import { setNativeOverlay } from '../services/nativeTabs';

// Native views paint above the HTML, so they are hidden while any popup is open.
let openOverlayCount = 0;

export function useNativeOverlay(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    openOverlayCount += 1;
    setNativeOverlay(true);
    return () => {
      openOverlayCount -= 1;
      if (!openOverlayCount) setNativeOverlay(false);
    };
  }, [isOpen]);
}
