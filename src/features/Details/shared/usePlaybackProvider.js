import { useCallback, useMemo, useState } from "react";
import {
  getDefaultProviderId,
  getProvider,
  listPlaybackProviders,
  movieEmbedUrl,
  tvEmbedUrl,
} from "../../../api";

const STORAGE_KEY = "cinez.playbackProvider.v2";

function readStoredProviderId(providers) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && providers.some((provider) => provider.id === saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors (private mode, etc.)
  }
  return getDefaultProviderId();
}

/**
 * Remembers the selected playback provider and builds embed URLs for it.
 */
export function usePlaybackProvider({ mediaType, id, season, episode } = {}) {
  const providers = useMemo(() => listPlaybackProviders(), []);
  const [providerId, setProviderIdState] = useState(() =>
    readStoredProviderId(providers)
  );

  const setProviderId = useCallback(
    (nextId) => {
      if (!providers.some((provider) => provider.id === nextId)) return;
      setProviderIdState(nextId);
      try {
        localStorage.setItem(STORAGE_KEY, nextId);
      } catch {
        // ignore
      }
    },
    [providers]
  );

  const provider = getProvider(providerId);

  const embedUrl = useMemo(() => {
    if (mediaType === "tv") {
      return tvEmbedUrl(id, season, episode, providerId);
    }
    return movieEmbedUrl(id, undefined, providerId);
  }, [mediaType, id, season, episode, providerId]);

  return {
    providers,
    providerId,
    provider,
    setProviderId,
    embedUrl,
  };
}
