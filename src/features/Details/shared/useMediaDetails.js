import { useEffect, useState } from "react";

/**
 * Loads media details for a route id with cancel-safe fetch and reset on change.
 * @param {string|undefined} id
 * @param {(id: string) => Promise<object>} fetcher
 * @param {{ fallbackError?: string }} [options]
 */
export function useMediaDetails(id, fetcher, options = {}) {
  const { fallbackError = "Details not found" } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        setError(fallbackError);
        setData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setData(null);

        const result = await fetcher(id);
        if (cancelled) return;

        setData(result);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading media details:", err);
        setError(err.message || fallbackError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, fetcher, fallbackError]);

  return {
    data,
    loading,
    error,
    cast: data?.cast || [],
  };
}
