# Changelog

All notable changes to **CineZ React Demo** are documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [2026-07-23]

### Added

- Album-stack carousel for single-row grids: last slot is a stacked poster pile for overflow titles, with swipe/drag deck rotation for the visible hand
- Solitaire-style pagination deal: stack cards fly into empty slots, then the next overflow stack slides in from off-screen (hand paging within the loaded list)
- `DealFlyer` overlay for deal/refill flights, with poster preload and settle handoff so real cards replace flyers without a skeleton blink
- Modular grid package under `src/components/grid/` (`Grid`, `MovieCard`, `AlbumStack`, `DealFlyer`, `GridPagination`) plus hooks (`useAlbumDeal`, `useDeckGesture`, `usePosterImage`) and `src/utils/grid/` (deck math, flight builders, helpers)
- Multi-provider playback (`VidLink`, `2Embed`, `SuperEmbed`) with `usePlaybackProvider`, `ServerSwitcher`, and a versioned localStorage key for the selected server
- Details shared hooks: `useMediaDetails`, `usePlaybackProvider`, `useTvSeasonEpisodes`
- Details UI building blocks: `DetailsShell`, `DetailsHero`, `DetailsSection`, and shared forms styles (`forms.css`) with `UiSelect` for TV season/episode picks

### Changed

- Grid split out of a single large file into focused components, hooks, and utils; public import remains `components/grid`
- Movie cards: poster→info gradient overlay, tighter info spacing, album stack height aligned to full card
- Default playback provider set to **SuperEmbed**; provider labels clarified for 2Embed / VidLink
- Movie/TV details layout rebuilt around the shell/hero/section structure; embed opens inline without a separate “open embed” control
- Embed player iframe permissions broadened for nested provider embeds and legacy fullscreen attributes kept for compatibility
- Skeleton loading for album-stack rows; hand changes no longer flash a full-row skeleton

### Fixed

- Deal handoff morph/blink when flyers settle into real cards (translate-only flights, one-frame sync handoff, cache-aware `useImageLoaded`)
- Nested embed providers blocked by overly strict iframe `allow` / sandbox constraints

---

## [2026-07-20]

### Added

- Shared `src/api/` layer (`client`, `config`, `mappers`, `movies`, `tv`, `search`, `catalog`, `playback`) so UI no longer calls TMDB directly
- `.env` / `.env.example` with `VITE_TMDB_API_KEY`, `VITE_TMDB_BASE_URL`, `VITE_TMDB_IMAGE_BASE_URL`, `VITE_PLAYBACK_BASE_URL`
- Shared layout tokens in `src/styles/layout.css` (`--page-content-max`, `--page-gutter`, banner control spacing)
- `useFitPerRow` for responsive one-line genre and movie grids
- `useImageLoaded` for correct poster/banner fade-in (including cached images)
- Skeleton shimmer loading for carousel, genre tiles, and movie cards
- Banner crossfade between slides; content fade-in on slide change

### Changed

- Navbar spans full viewport background; content aligns to the shared page rail
- Carousel backdrop stays full-bleed; title, copy, CTA, and arrows follow page gutters
- Side gutters apply at all widths; above 1920px content max widens to 2200px with tighter 24px gutter
- Movie/TV section fetches no longer hard-slice to 7 items; grids show as many as fit one row
- Carousel autoplay interval doubled to **10 seconds**
- README rewritten for current stack, env setup, routes, and API layout

### Fixed

- Navbar live search used a placeholder API key; now uses env via `searchMulti`
- TV page heading/copy incorrectly said “Movies”
- Footer called undefined `setShowMenu`; logo path corrected
- UpcomingMovies missing `TMDB_API_KEY` / export
- View-all invalid sections navigate to 404 with `replace`
- Movie posters stuck on skeleton until hover (cached `onLoad` + hover opacity override)
- Layout CSS import order so page gutter tokens actually apply
