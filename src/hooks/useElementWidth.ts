import { useEffect, useState, type RefObject } from 'react';

/** The live content width of an element, kept current with a ResizeObserver. */
export function useElementWidth(elementRef: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return width;
}
