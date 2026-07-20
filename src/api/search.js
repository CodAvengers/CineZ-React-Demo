import { tmdbGet } from "./client";
import { mapBannerItem, mapMediaItem, mapPagedResults } from "./mappers";

export async function searchMulti({ query, page = 1, limit } = {}) {
  const data = await tmdbGet("/search/multi", {
    query,
    page,
    include_adult: false,
  });

  const filtered = (data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );

  let items = filtered.map((item) => mapMediaItem(item));
  if (typeof limit === "number") {
    items = items.slice(0, limit);
  }

  return {
    items,
    totalPages: data.total_pages || 1,
    page: data.page || 1,
  };
}

export async function getTrendingThisWeek({ limit = 7 } = {}) {
  const data = await tmdbGet("/trending/all/week");
  return mapPagedResults(data, undefined, { limit });
}

export async function getHomeBanners({ limit = 10 } = {}) {
  const [movieData, tvData] = await Promise.all([
    tmdbGet("/trending/movie/week"),
    tmdbGet("/trending/tv/week"),
  ]);

  const movies = (movieData.results || [])
    .filter((m) => m.backdrop_path)
    .map((m) => mapBannerItem(m, "movie"));

  const tvShows = (tvData.results || [])
    .filter((tv) => tv.backdrop_path)
    .map((tv) => mapBannerItem(tv, "tv"));

  const interleaved = [];
  const maxLength = Math.max(movies.length, tvShows.length);
  for (let i = 0; i < maxLength && interleaved.length < limit; i++) {
    if (i < movies.length) interleaved.push(movies[i]);
    if (i < tvShows.length && interleaved.length < limit) {
      interleaved.push(tvShows[i]);
    }
  }

  return interleaved;
}
