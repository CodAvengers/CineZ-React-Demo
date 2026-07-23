import { useCallback, useLayoutEffect, useRef, useState } from "react";

function isSrcCached(src) {
  if (!src || typeof window === "undefined") return false;
  const probe = new Image();
  probe.src = src;
  return probe.complete && probe.naturalWidth > 0;
}

/**
 * Tracks image load state, including browser-cached images that skip onLoad.
 * Cached sources start as loaded to avoid a one-frame skeleton flash.
 */
export function useImageLoaded(src) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(() => isSrcCached(src));

  const markLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  useLayoutEffect(() => {
    if (!src) {
      setLoaded(false);
      return undefined;
    }

    // Prefer already-decoded cache — must run before paint to skip skeleton
    if (isSrcCached(src)) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }

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
