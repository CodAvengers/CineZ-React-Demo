import { useEffect, useRef, useState } from "react";

/**
 * Handles fetch + loading + error + pagination state for a homepage section.
 * Ignores results from requests that are no longer the latest one,
 * preventing race conditions when a user pages quickly.
 *
 * @param {(page: number) => Promise<{items: any[], totalPages?: number}>} fetcher
 * @param {any[]} deps - extra values that should trigger a refetch (e.g. mediaType)
 */
export function useSectionData(fetcher, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    fetcher(page)
      .then(({ items, totalPages: total }) => {
        if (requestIdRef.current !== requestId) return; // a newer request has since started
        setData(items);
        setTotalPages(total || 1);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        console.error(err);
        setError("Failed to load. Please try again.");
      })
      .finally(() => {
        if (requestIdRef.current !== requestId) return;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps]);

  return { data, loading, error, page, setPage, totalPages };
}