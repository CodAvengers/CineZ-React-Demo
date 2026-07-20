import { tmdbGet } from "./client";
import { NETWORKS } from "./config";
import { mapEpisode, mapPagedResults, mapTvDetails } from "./mappers";

export async function getPopularTv({ page = 1, limit } = {}) {
  const data = await tmdbGet("/tv/popular", {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getTrendingTv({
  page = 1,
  limit,
  window = "day",
} = {}) {
  const data = await tmdbGet(`/trending/tv/${window}`, {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getTopRatedTv({ page = 1, limit } = {}) {
  const data = await tmdbGet("/tv/top_rated", {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getAiringTodayTv({ page = 1, limit } = {}) {
  const data = await tmdbGet("/tv/airing_today", {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getPopularAnime({ page = 1, limit } = {}) {
  const data = await tmdbGet("/discover/tv", {
    with_genres: 16,
    with_original_language: "ja",
    sort_by: "popularity.desc",
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getTvByGenre({
  genreId,
  page = 1,
  limit,
  sortBy = "popularity.desc",
} = {}) {
  const data = await tmdbGet("/discover/tv", {
    with_genres: genreId,
    sort_by: sortBy,
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getTvByNetwork({
  networkId,
  page = 1,
  limit,
  sortBy = "popularity.desc",
} = {}) {
  const data = await tmdbGet("/discover/tv", {
    with_networks: networkId,
    sort_by: sortBy,
    page,
  });
  return mapPagedResults(data, "tv", { limit });
}

export async function getPlatformTv(platform, { page = 1, limit } = {}) {
  return getTvByNetwork({
    networkId: NETWORKS[platform],
    page,
    limit,
  });
}

export async function getTvDetails(id) {
  const data = await tmdbGet(`/tv/${id}`, {
    append_to_response: "credits,content_ratings",
  });
  return mapTvDetails(data);
}

export async function getTvSeason(id, seasonNumber) {
  const data = await tmdbGet(`/tv/${id}/season/${seasonNumber}`);
  return {
    episodes: (data.episodes || []).map(mapEpisode),
  };
}
