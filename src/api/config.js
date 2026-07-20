export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const PLAYBACK_BASE_URL = import.meta.env.VITE_PLAYBACK_BASE_URL;

export const WATCH_PROVIDERS = {
  netflix: 8,
  disney: 337,
  apple: 2,
  hbo: 118,
  amazon: 9,
};

export const NETWORKS = {
  netflix: 213,
  disney: 2739,
  apple: 2552,
  hbo: 49,
  amazon: 1024,
};

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 878, name: "Sci-Fi" },
  { id: 27, name: "Horror" },
  { id: 16, name: "Animation" },
  { id: 9648, name: "Mystery" },
  { id: 80, name: "Crime" },
  { id: 10749, name: "Romance" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 37, name: "Western" },
  { id: 36, name: "History" },
  { id: 10402, name: "Music" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 10762, name: "Kids" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
];

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10751: "Family",
  9648: "Mystery",
  36: "History",
  10402: "Music",
  10752: "War",
  37: "Western",
  10770: "TV Movie",
  ...Object.fromEntries(TV_GENRES.map((genre) => [genre.id, genre.name])),
};
