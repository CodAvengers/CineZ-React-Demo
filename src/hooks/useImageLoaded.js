import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks image load state, including browser-cached images that skip onLoad.
 */
export function useImageLoaded(src) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const markLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    setLoaded(false);
    if (!src) return undefined;

    let cancelled = false;

    const checkComplete = () => {
      const img = imgRef.current;
      if (!cancelled && img?.complete && img.naturalWidth > 0) {
        setLoaded(true);
      }
    };

    checkComplete();
    const frame = requestAnimationFrame(checkComplete);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [src]);

  return { imgRef, loaded, markLoaded, setLoaded };
}
