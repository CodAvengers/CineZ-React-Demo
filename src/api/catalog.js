import {
  GENRE_MAP,
  MOVIE_GENRES,
  NETWORKS,
  TV_GENRES,
  WATCH_PROVIDERS,
} from "./config";
import { tmdbGet } from "./client";
import { mapPagedResults } from "./mappers";
import { getMoviesByGenre } from "./movies";
import { getTvByGenre } from "./tv";

const SECTION_TITLES = {
  "popular-movies": "Popular Movies",
  "top-rated-movies": "Top Rated Movies",
  "trending-movies": "Trending Movies",
  "popular-series": "Popular TV Shows",
  "top-rated-series": "Top Rated TV Shows",
  "trending-series": "Trending TV Shows",
  "airing-today-series": "Airing Today",
  "popular-animation": "Popular Animation",
  "popular-anime": "Popular Anime",
  "cult-classics": "Cult Classics",
};

const PLATFORM_NAMES = {
  netflix: "Netflix",
  disney: "Disney+",
  apple: "Apple",
  hbo: "HBO",
  amazon: "Amazon",
};

function buildSectionPath(section) {
  const staticSections = {
    "popular-movies": ["/movie/popular", {}],
    "top-rated-movies": ["/movie/top_rated", {}],
    "trending-movies": ["/trending/movie/day", {}],
    "popular-series": ["/tv/popular", {}],
    "top-rated-series": ["/tv/top_rated", {}],
    "trending-series": ["/trending/tv/day", {}],
    "airing-today-series": ["/tv/airing_today", {}],
    "popular-animation": ["/discover/movie", { with_genres: 16 }],
    "popular-anime": [
      "/discover/tv",
      { with_genres: 16, with_original_language: "ja" },
    ],
    "cult-classics": [
      "/discover/movie",
      {
        "primary_release_date.lte": "1999-12-31",
        "vote_average.gte": 7,
        sort_by: "vote_count.desc",
      },
    ],
    "netflix-originals-tv": [
      "/discover/tv",
      { with_networks: NETWORKS.netflix },
    ],
    "disney-originals-tv": [
      "/discover/tv",
      { with_networks: NETWORKS.disney },
    ],
    "apple-originals-tv": ["/discover/tv", { with_networks: NETWORKS.apple }],
    "hbo-originals-tv": ["/discover/tv", { with_networks: NETWORKS.hbo }],
    "amazon-originals-tv": [
      "/discover/tv",
      { with_networks: NETWORKS.amazon },
    ],
    "netflix-originals-movie": [
      "/discover/movie",
      {
        with_watch_providers: WATCH_PROVIDERS.netflix,
        watch_region: "US",
      },
    ],
    "disney-originals-movie": [
      "/discover/movie",
      {
        with_watch_providers: WATCH_PROVIDERS.disney,
        watch_region: "US",
      },
    ],
    "apple-originals-movie": [
      "/discover/movie",
      {
        with_watch_providers: WATCH_PROVIDERS.apple,
        watch_region: "US",
      },
    ],
    "hbo-originals-movie": [
      "/discover/movie",
      {
        with_watch_providers: WATCH_PROVIDERS.hbo,
        watch_region: "US",
      },
    ],
    "amazon-originals-movie": [
      "/discover/movie",
      {
        with_watch_providers: WATCH_PROVIDERS.amazon,
        watch_region: "US",
      },
    ],
  };

  if (staticSections[section]) {
    return staticSections[section];
  }

  const genreMatch = section.match(/^(movie|tv)-genre-(\d+)$/);
  if (genreMatch) {
    const [, type, id] = genreMatch;
    return [`/discover/${type}`, { with_genres: id }];
  }

  return null;
}

export function isCatalogSection(section) {
  return Boolean(buildSectionPath(section));
}

export function getCatalogMediaType(section) {
  if (
    section.includes("series") ||
    section.includes("tv") ||
    section.includes("anime") ||
    TV_GENRES.some((genre) => section === `tv-genre-${genre.id}`)
  ) {
    return "tv";
  }
  return "movie";
}

export function getCatalogSectionTitle(section) {
  const genreMatch = section.match(/(movie|tv)-genre-(\d+)/);
  if (genreMatch) {
    const [, type, id] = genreMatch;
    const genreName = GENRE_MAP[id] || "Genre";
    return `${genreName} ${type === "movie" ? "Movies" : "Series"}`;
  }

  const platformMatch = section.match(
    /(netflix|disney|apple|hbo|amazon)-originals-(movie|tv)/
  );
  if (platformMatch) {
    const [, platform, type] = platformMatch;
    return `${PLATFORM_NAMES[platform]} Originals (${
      type === "movie" ? "Movies" : "TV Shows"
    })`;
  }

  return SECTION_TITLES[section] || "View All";
}

export async function getCatalogSection(section, { page = 1 } = {}) {
  const resolved = buildSectionPath(section);
  if (!resolved) {
    return null;
  }

  const [path, params] = resolved;
  const data = await tmdbGet(path, { ...params, page });
  const mediaType = getCatalogMediaType(section);
  const result = mapPagedResults(data, mediaType);
  return {
    ...result,
    totalPages: result.totalPages > 500 ? 500 : result.totalPages,
    mediaType,
    title: getCatalogSectionTitle(section),
  };
}

export async function getGenrePreviews(type) {
  const list = type === "tv" ? TV_GENRES : MOVIE_GENRES;
  const itemsByGenre = {};

  await Promise.all(
    list.map(async (genre) => {
      try {
        const result =
          type === "movie"
            ? await getMoviesByGenre({ genreId: genre.id, limit: 4 })
            : await getTvByGenre({ genreId: genre.id, limit: 4 });

        itemsByGenre[genre.id] = result.items.map((item) => ({
          poster: item.posterUrlSmall || item.posterUrl,
          title: item.title,
          date: item.releaseYear,
        }));
      } catch {
        itemsByGenre[genre.id] = Array(4).fill({
          poster: null,
          title: "",
          date: "",
        });
      }
    })
  );

  return { genres: list, itemsByGenre };
}
