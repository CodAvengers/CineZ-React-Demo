import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "../../components/Grid";
import "./styles/ViewAllPage.css";
// import NetflixWallpaper from "../../assets/netflix.jpg";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ViewAllPage = () => {
  const { section } = useParams();
  const [filterType, setFilterType] = useState(
    section.includes("series") || section.includes("tv") ? "tv" : "movie"
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Define TV genres that should be available in view all
  const tvGenres = [
    { id: 10759, name: "Action & Adventure" },
    { id: 10762, name: "Kids" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
  ];

  // Genre ID to name mapping
  const genreMap = {
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
    ...Object.fromEntries(tvGenres.map((genre) => [genre.id, genre.name])),
  };

  const sectionMap = {
    // Movie sections
    "popular-movies": `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    "top-rated-movies": `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
    "trending-movies": `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`,

    // TV Show sections
    "popular-series": `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    "top-rated-series": `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
    "trending-series": `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}&page=${page}`,
    "airing-today-series": `https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&page=${page}`,

    // Movie genres (all standard TMDB movie genres)
    ...Object.entries(genreMap).reduce((acc, [id, name]) => {
      // Only create movie genre endpoints for IDs that are not TV genres
      if (!tvGenres.some((g) => g.id === Number(id))) {
        acc[
          `movie-genre-${id}`
        ] = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}&page=${page}`;
      }
      return acc;
    }, {}),

    // TV genres - only create endpoints for our defined TV genres
    ...tvGenres.reduce((acc, genre) => {
      acc[
        `tv-genre-${genre.id}`
      ] = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genre.id}&page=${page}`;
      return acc;
    }, {}),

    // Special categories
    "popular-animation": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&page=${page}`,
    "popular-anime": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&page=${page}`,
    "cult-classics": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.lte=1999-12-31&vote_average.gte=7&sort_by=vote_count.desc&page=${page}`,

    // Streaming platforms - TV shows
    "netflix-originals-tv": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&page=${page}`,
    "disney-originals-tv": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=2739&page=${page}`,
    "apple-originals-tv": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=2552&page=${page}`,
    "hbo-originals-tv": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=49&page=${page}`,
    "amazon-originals-tv": `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=1024&page=${page}`,

    // Streaming platforms - Movies
    "netflix-originals-movie": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=8&watch_region=US&page=${page}`,
    "disney-originals-movie": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=337&watch_region=US&page=${page}`,
    "apple-originals-movie": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=2&watch_region=US&page=${page}`,
    "hbo-originals-movie": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=118&watch_region=US&page=${page}`,
    "amazon-originals-movie": `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=9&watch_region=US&page=${page}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = sectionMap[section];
        if (!url) {
          console.error("Invalid section:", section);
          return navigate("/not-found");
        }

        const res = await fetch(url);
        const json = await res.json();
        setData(json.results);
        setTotalPages(json.total_pages > 500 ? 500 : json.total_pages);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section, page]);

  const handleItemClick = (item) => {
    const isTVSection = [
      "popular-series",
      "top-rated-series",
      "trending-series",
      "airing-today-series",
      "popular-anime",
      ...tvGenres.map((genre) => `tv-genre-${genre.id}`),
      ...[
        "netflix-originals-tv",
        "disney-originals-tv",
        "apple-originals-tv",
        "hbo-originals-tv",
        "amazon-originals-tv",
      ],
    ].includes(section);

    navigate(`/${isTVSection ? "tv" : "movie"}/${item.id}`);
  };

  const getSectionTitle = () => {
    // Handle genre sections
    const genreMatch = section.match(/(movie|tv)-genre-(\d+)/);
    if (genreMatch) {
      const [, type, id] = genreMatch;
      const genreName = genreMap[id] || "Genre";
      return `${genreName} ${type === "movie" ? "Movies" : "Series"}`;
    }

    // Handle streaming platforms
    const platformMatch = section.match(
      /(netflix|disney|apple|hbo|amazon)-originals-(movie|tv)/
    );
    if (platformMatch) {
      const [_, platform, type] = platformMatch;
      const platformName = {
        netflix: "Netflix",
        disney: "Disney+",
        apple: "Apple",
        hbo: "HBO",
        amazon: "Amazon",
      }[platform];
      return `${platformName} Originals (${
        type === "movie" ? "Movies" : "TV Shows"
      })`;
    }

    // Special sections
    const titles = {
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

    return titles[section] || "View All";
  };

  // const backgroundMap = {
  //   "netflix-originals-movie": NetflixWallpaper,
  //   "amazon-originals": "/backgrounds/amazon.jpg",
  //   "hbo-originals": "/backgrounds/hbo.jpg",
  //   "disney-plus": "/backgrounds/disney.jpg",
  //   "apple-tv": "/backgrounds/apple.jpg",
  // };

  // const backgroundImage = backgroundMap[section];

  return (
    <div
      className="view-all-wrapper"
      // style={{
      //   backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      //   backgroundSize: "contain",
      //   backgroundPosition: "fixed",
      //   backgroundRepeat: "no-repeat",
      //   minHeight: "100vh",
      //   minWidth: "100vw",
      // }}
    >
      <h1 className="section-title">{getSectionTitle()}</h1>

      <Grid
        data={data}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={handleItemClick}
        showViewAll={false}
        showPagination={false}
      />

      {totalPages > 1 && (
        <ul className="pagination-view-all">
          <li>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="pagination-button prev-next"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pagination-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          <li>
            <button className="pagination-button-active" disabled>
              {page}
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="pagination-button prev-next"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pagination-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ViewAllPage;
