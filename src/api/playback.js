import {
  getDefaultProviderId,
  getProvider,
  listPlaybackProviders,
  PLAYBACK_PROVIDERS,
} from "./providers";
import { DEFAULT_EMBED_THEME } from "./providers/vidlink";

export { DEFAULT_EMBED_THEME };
export {
  getDefaultProviderId,
  getProvider,
  listPlaybackProviders,
  PLAYBACK_PROVIDERS,
};

export function isPlaybackConfigured() {
  return PLAYBACK_PROVIDERS.length > 0;
}

/**
 * Build a movie embed URL for a provider (defaults to preferred provider).
 */
export function movieEmbedUrl(id, options = DEFAULT_EMBED_THEME, providerId) {
  const provider = getProvider(providerId ?? getDefaultProviderId());
  return provider?.movieEmbedUrl(id, options) ?? "";
}

/**
 * Build a TV episode embed URL for a provider (defaults to preferred provider).
 */
export function tvEmbedUrl(id, season, episode, providerId) {
  const provider = getProvider(providerId ?? getDefaultProviderId());
  return provider?.tvEmbedUrl(id, season, episode) ?? "";
}

export function openEmbed(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
