/**
 * VidLink playback provider
 * Docs: https://vidlink.pro
 */

import { PLAYBACK_BASE_URL, VIDLINK_BASE_URL } from "../config";

export const DEFAULT_EMBED_THEME = {
  primaryColor: "ff0000",
  secondaryColor: "a2a2a2",
  iconColor: "ffebeb",
};

function getBaseUrl() {
  return VIDLINK_BASE_URL || PLAYBACK_BASE_URL || "https://vidlink.pro";
}

export const vidlinkProvider = {
  id: "vidlink",
  name: "VidLink",
  label: "Server 1",

  isConfigured() {
    return Boolean(getBaseUrl());
  },

  movieEmbedUrl(id, options = DEFAULT_EMBED_THEME) {
    if (!id) return "";
    const base = getBaseUrl();
    if (!base) return "";

    const params = new URLSearchParams();
    if (options.primaryColor) params.set("primaryColor", options.primaryColor);
    if (options.secondaryColor) {
      params.set("secondaryColor", options.secondaryColor);
    }
    if (options.iconColor) params.set("iconColor", options.iconColor);

    const query = params.toString();
    return `${base}/movie/${id}${query ? `?${query}` : ""}`;
  },

  tvEmbedUrl(id, season, episode) {
    if (!id || !season || !episode) return "";
    const base = getBaseUrl();
    if (!base) return "";
    return `${base}/tv/${id}/${season}/${episode}`;
  },
};
