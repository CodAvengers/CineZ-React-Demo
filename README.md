# oleDst CineZ React Demo

Frontend-only movie and TV browser: explore trending and popular titles, search, open details, and watch via embedded players. Metadata comes from [TMDB](https://www.themoviedb.org/documentation/api); playback uses [vidlink.pro](https://vidlink.pro).

**Live demo:** [cinez-react-demo.pages.dev](https://cinez-react-demo.pages.dev/)

No account required.

See [CHANGELOG.md](./CHANGELOG.md) for recent updates.

---

## Tech stack


| Layer    | Choice                                                                         |
| -------- | ------------------------------------------------------------------------------ |
| UI       | React 19 + Vite 6                                                              |
| Routing  | React Router 7                                                                 |
| Styling  | Component CSS + shared layout tokens (`src/styles/layout.css`); light Tailwind |
| Data     | TMDB REST (via `src/api/`)                                                     |
| Playback | vidlink.pro iframe embeds                                                      |


---

## Features

- Home hero carousel (crossfade, 10s autoplay)
- Browse movies and TV by trending, popular, top rated, genres, and platform “originals”
- Responsive single-row grids that fill one line of the viewport
- Search (navbar live suggestions + results page)
- Movie and TV detail pages with cast and embedded player (season/episode for TV)
- View-all pages with pagination
- Shimmer loading skeletons for carousel, genre tiles, and poster cards

---

## Project structure

```
src/
  api/           # TMDB client, mappers, movies/tv/search/catalog/playback
  components/    # Navbar, Grid, GenreGrid, Hero, Skeleton, Footer, …
  features/      # Home sections, details, search screens
  hooks/         # useFitPerRow, useImageLoaded
  pages/         # Route entry points
  styles/        # Shared layout tokens (--page-content-max, --page-gutter, …)
```

UI components call named functions from `src/api/` (e.g. `getPopularMovies`, `searchMulti`). They do not talk to TMDB URLs or env keys directly, so a future backend can swap the client without rewriting pages.

---

## Setup

1. **Clone and install**

```bash
cd CineZ-React-Demo
npm install
```

1. **Environment**

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```


| Variable                   | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `VITE_TMDB_API_KEY`        | TMDB API key ([get one](https://www.themoviedb.org/settings/api)) |
| `VITE_TMDB_BASE_URL`       | TMDB API base (e.g. `https://api.themoviedb.org/3`)               |
| `VITE_TMDB_IMAGE_BASE_URL` | Image CDN base (e.g. `https://image.tmdb.org/t/p`)                |
| `VITE_PLAYBACK_BASE_URL`   | Embed player base (e.g. `https://vidlink.pro`)                    |


`.env` is gitignored. Restart the dev server after changing env vars.

1. **Run**

```bash
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

---

## Routes


| Path                 | Screen                               |
| -------------------- | ------------------------------------ |
| `/`                  | Home                                 |
| `/movies`            | Movies                               |
| `/tv-shows`          | TV shows                             |
| `/movie/:id`         | Movie details + player               |
| `/tv/:id`            | TV details + player                  |
| `/search?query=`     | Search results                       |
| `/view-all/:section` | Full section / genre / platform list |


---

## Notes

- This is a **frontend demo**: no real auth, playlists, or backend yet. Login UI (if shown) is cosmetic.
- `VITE_*` values are exposed in the client bundle; keep TMDB key restrictions configured in the TMDB dashboard when you deploy.  
Test auto deploys

