import { tmdbGet } from "./client";
import { WATCH_PROVIDERS } from "./config";
import { mapMovieDetails, mapPagedResults } from "./mappers";

export async function getPopularMovies({ page = 1, limit } = {}) {
  const data = await tmdbGet("/movie/popular", {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getTrendingMovies({
  page = 1,
  limit,
  window = "day",
} = {}) {
  const data = await tmdbGet(`/trending/movie/${window}`, {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getTopRatedMovies({ page = 1, limit } = {}) {
  const data = await tmdbGet("/movie/top_rated", {
    language: "en-US",
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getUpcomingMovies({ page = 1, limit } = {}) {
  const data = await tmdbGet("/movie/upcoming", { page });
  return mapPagedResults(data, "movie", { limit });
}

export async function getPopularAnimation({ page = 1, limit } = {}) {
  const data = await tmdbGet("/discover/movie", {
    with_genres: 16,
    sort_by: "popularity.desc",
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getCultClassics({ page = 1, limit } = {}) {
  const data = await tmdbGet("/discover/movie", {
    "primary_release_date.lte": "1999-12-31",
    "vote_average.gte": 7,
    sort_by: "vote_count.desc",
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getMoviesByGenre({
  genreId,
  page = 1,
  limit,
  sortBy = "popularity.desc",
} = {}) {
  const data = await tmdbGet("/discover/movie", {
    with_genres: genreId,
    sort_by: sortBy,
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getMoviesByWatchProvider({
  providerId,
  page = 1,
  limit,
  sortBy = "popularity.desc",
} = {}) {
  const data = await tmdbGet("/discover/movie", {
    with_watch_providers: providerId,
    watch_region: "US",
    sort_by: sortBy,
    page,
  });
  return mapPagedResults(data, "movie", { limit });
}

export async function getPlatformMovies(platform, { page = 1, limit } = {}) {
  return getMoviesByWatchProvider({
    providerId: WATCH_PROVIDERS[platform],
    page,
    limit,
  });
}

export async function getMovieDetails(id) {
  const data = await tmdbGet(`/movie/${id}`, {
    append_to_response: "credits",
  });
  return mapMovieDetails(data);
}
