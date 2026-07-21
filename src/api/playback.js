import { PLAYBACK_BASE_URL } from "./config";

export const DEFAULT_EMBED_THEME = {
  primaryColor: "ff0000",
  secondaryColor: "a2a2a2",
  iconColor: "ffebeb",
};

export function isPlaybackConfigured() {
  return Boolean(PLAYBACK_BASE_URL);
}

export function movieEmbedUrl(id, options = DEFAULT_EMBED_THEME) {
  if (!PLAYBACK_BASE_URL || !id) return "";

  const params = new URLSearchParams();
  if (options.primaryColor) params.set("primaryColor", options.primaryColor);
  if (options.secondaryColor) params.set("secondaryColor", options.secondaryColor);
  if (options.iconColor) params.set("iconColor", options.iconColor);

  const query = params.toString();
  return `${PLAYBACK_BASE_URL}/movie/${id}${query ? `?${query}` : ""}`;
}

export function tvEmbedUrl(id, season, episode) {
  if (!PLAYBACK_BASE_URL || !id || !season || !episode) return "";
  return `${PLAYBACK_BASE_URL}/tv/${id}/${season}/${episode}`;
}

export function openEmbed(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
