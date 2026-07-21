import { useEffect, useState } from "react";
import { getTvSeason } from "../../../api";

/**
 * Loads episodes for a TV season and resets the selected episode to 1.
 */
export function useTvSeasonEpisodes(seriesId, seasonNumber, enabled = true) {
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !seriesId || !seasonNumber) {
      setEpisodes([]);
      return undefined;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getTvSeason(seriesId, seasonNumber);
        if (cancelled) return;

        const nextEpisodes = data.episodes || [];
        setEpisodes(nextEpisodes);
        setSelectedEpisode(1);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching episodes:", err);
        setEpisodes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [seriesId, seasonNumber, enabled]);

  return {
    episodes,
    selectedEpisode,
    setSelectedEpisode,
    loading,
  };
}
