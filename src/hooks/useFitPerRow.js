import { useLayoutEffect, useState } from "react";

export function genreRowMetrics(width) {
  if (width <= 435) return { minCard: 100, gap: 16 };
  if (width <= 1366) return { minCard: 100, gap: 12 };
  return { minCard: 150, gap: 20 };
}

export function movieRowMetrics(width) {
  if (width <= 480) return { minCard: 100, gap: 15 };
  if (width <= 1366) return { minCard: 150, gap: 20 };
  return { minCard: 200, gap: 20 };
}

/**
 * Measures an element and returns how many cards fit in one row.
 * @param {React.RefObject<HTMLElement|null>} ref
 * @param {(width: number) => { minCard: number, gap: number }} getMetrics
 */
export function useFitPerRow(ref, getMetrics = movieRowMetrics) {
  const [perRow, setPerRow] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      const width = el.clientWidth;
      if (!width) return;

      const { minCard, gap } = getMetrics(width);
      const count = Math.max(1, Math.floor((width + gap) / (minCard + gap)));
      setPerRow((prev) => (prev === count ? prev : count));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, getMetrics]);

  return perRow;
}
