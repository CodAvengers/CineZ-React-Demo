# Changelog

All notable changes to **CineZ React Demo** are documented here.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
