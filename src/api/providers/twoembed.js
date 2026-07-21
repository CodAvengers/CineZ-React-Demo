/**
 * 2Embed playback provider
 * Docs: https://www.2embed.online
 * Movie: /embed/movie/{tmdbOrImdbId}
 * TV:    /embed/tv/{tmdbOrImdbId}/{season}/{episode}
 */

import { TWOEMBED_BASE_URL } from "../config";

function getBaseUrl() {
  return TWOEMBED_BASE_URL || "https://www.2embed.online";
}

export const twoEmbedProvider = {
  id: "2embed",
  name: "2Embed",
  label: "Server 3",

  isConfigured() {
    return Boolean(getBaseUrl());
  },

  movieEmbedUrl(id) {
    if (!id) return "";
    const base = getBaseUrl();
    if (!base) return "";
    return `${base}/embed/movie/${id}`;
  },

  tvEmbedUrl(id, season, episode) {
    if (!id || !season || !episode) return "";
    const base = getBaseUrl();
    if (!base) return "";
    return `${base}/embed/tv/${id}/${season}/${episode}`;
  },
};
