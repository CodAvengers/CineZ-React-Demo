/**
 * SuperEmbed / MultiEmbed — simple iframe embeds
 * Docs: https://multiembed.mov
 *
 * Movie (TMDB): ?video_id={id}&tmdb=1
 * TV (TMDB):    ?video_id={id}&tmdb=1&s={season}&e={episode}
 */

import { SUPEREMBED_BASE_URL } from "../config";

function getBaseUrl() {
  return (SUPEREMBED_BASE_URL || "https://multiembed.mov").replace(/\/$/, "");
}

function buildUrl(params) {
  const base = getBaseUrl();
  if (!base) return "";
  const query = new URLSearchParams(params);
  return `${base}/?${query.toString()}`;
}

export const superEmbedProvider = {
  id: "superembed",
  name: "SuperEmbed",
  label: "Server 1",

  isConfigured() {
    return Boolean(getBaseUrl());
  },

  movieEmbedUrl(id) {
    if (!id) return "";
    return buildUrl({
      video_id: String(id),
      tmdb: "1",
    });
  },

  tvEmbedUrl(id, season, episode) {
    if (!id || !season || !episode) return "";
    return buildUrl({
      video_id: String(id),
      tmdb: "1",
      s: String(season),
      e: String(episode),
    });
  },
};
