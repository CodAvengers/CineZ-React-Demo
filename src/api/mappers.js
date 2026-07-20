import { TMDB_IMAGE_BASE_URL } from "./config";
import { movieEmbedUrl } from "./playback";

export function imageUrl(path, size = "w500") {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function mapMediaItem(item, mediaTypeHint) {
  const mediaType =
    mediaTypeHint ||
    item.media_type ||
    (item.title ? "movie" : "tv");

  return {
    id: item.id,
    title: item.title || item.name || "NA",
    overview: item.overview || "",
    posterUrl: imageUrl(item.poster_path || item.backdrop_path || item.still_path),
    posterUrlSmall: imageUrl(
      item.poster_path || item.backdrop_path || item.still_path,
      "w200"
    ),
    backdropUrl: imageUrl(item.backdrop_path, "original"),
    rating: item.vote_average ?? 0,
    mediaType,
    releaseYear: (item.release_date || item.first_air_date || "").substring(0, 4),
  };
}

export function mapPagedResults(data, mediaTypeHint, { limit } = {}) {
  let items = (data.results || []).map((item) =>
    mapMediaItem(item, mediaTypeHint)
  );
  if (typeof limit === "number") {
    items = items.slice(0, limit);
  }
  return {
    items,
    totalPages: data.total_pages || 1,
    page: data.page || 1,
  };
}

export function mapCastMember(person) {
  return {
    name: person.name,
    character: person.character,
    profileUrl: imageUrl(person.profile_path, "w200"),
  };
}

export function mapMovieDetails(data) {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    posterUrl: imageUrl(data.poster_path),
    backdropUrl: imageUrl(data.backdrop_path, "original"),
    rating: data.vote_average,
    releaseDate: data.release_date,
    runtime: data.runtime,
    genres: data.genres?.map((g) => g.name).join(", ") || "",
    director: data.credits?.crew?.find((person) => person.job === "Director")
      ?.name,
    budget: data.budget,
    revenue: data.revenue,
    embedUrl: movieEmbedUrl(data.id),
    cast: (data.credits?.cast || []).slice(0, 9).map(mapCastMember),
  };
}

export function mapTvDetails(data) {
  const seasons = (data.seasons || []).filter((s) => s.season_number > 0);

  return {
    id: data.id,
    title: data.name,
    overview: data.overview,
    posterUrl: imageUrl(data.poster_path),
    backdropUrl: imageUrl(data.backdrop_path, "original"),
    rating: data.vote_average,
    firstAirDate: data.first_air_date,
    lastAirDate: data.last_air_date,
    genres: data.genres?.map((g) => g.name).join(", ") || "",
    creator: data.created_by?.map((c) => c.name).join(", ") || "",
    episodeRuntime: data.episode_run_time?.[0],
    seasonCount: data.number_of_seasons,
    episodeCount: data.number_of_episodes,
    status: data.status,
    seasons: seasons.map((season) => ({
      seasonNumber: season.season_number,
      name: season.name,
      episodeCount: season.episode_count,
      posterUrl: imageUrl(season.poster_path),
    })),
    cast: (data.credits?.cast || []).slice(0, 6).map(mapCastMember),
  };
}

export function mapEpisode(episode) {
  return {
    episodeNumber: episode.episode_number,
    name: episode.name,
    overview: episode.overview || "",
    stillUrl: imageUrl(episode.still_path, "w400"),
  };
}

export function mapGenrePreviewItem(item, mediaType) {
  return {
    poster: imageUrl(item.poster_path || item.backdrop_path, "w200"),
    title: mediaType === "movie" ? item.title : item.name,
    date:
      mediaType === "movie"
        ? item.release_date?.substring(0, 4)
        : item.first_air_date?.substring(0, 4),
  };
}

export function mapBannerItem(item, mediaType) {
  return {
    id: item.id,
    title: item.title || item.name,
    overview: item.overview || "",
    backdropUrl: imageUrl(item.backdrop_path, "original"),
    mediaType,
  };
}
