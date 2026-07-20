import { TMDB_API_KEY, TMDB_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Low-level TMDB GET. Swap base URL / auth here when migrating to your backend.
 */
export async function tmdbGet(path, params = {}) {
  if (!TMDB_API_KEY) {
    throw new ApiError("Missing VITE_TMDB_API_KEY", 500);
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new ApiError(`Request failed: ${path}`, response.status);
  }

  return response.json();
}
