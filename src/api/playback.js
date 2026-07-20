import { PLAYBACK_BASE_URL } from "./config";

export function movieEmbedUrl(id, options = {}) {
  const params = new URLSearchParams();
  if (options.primaryColor) params.set("primaryColor", options.primaryColor);
  if (options.secondaryColor) params.set("secondaryColor", options.secondaryColor);
  if (options.iconColor) params.set("iconColor", options.iconColor);

  const query = params.toString();
  return `${PLAYBACK_BASE_URL}/movie/${id}${query ? `?${query}` : ""}`;
}

export function tvEmbedUrl(id, season, episode) {
  return `${PLAYBACK_BASE_URL}/tv/${id}/${season}/${episode}`;
}
