import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/genre-grid.css";
import { ArrowForward } from "@mui/icons-material";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const GenreGrid = ({ type = "movie" }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [genreItems, setGenreItems] = useState({});
  const [loading, setLoading] = useState(true);

  // Memoized genre data
  const genreData = useMemo(
    () => ({
      movie: [
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
      ],
      tv: [
        { id: 10759, name: "Action & Adventure" },
        { id: 10762, name: "Kids" },
        { id: 10763, name: "News" },
        { id: 10764, name: "Reality" },
        { id: 10765, name: "Sci-Fi & Fantasy" },
        { id: 10766, name: "Soap" },
        { id: 10767, name: "Talk" },
        { id: 10768, name: "War & Politics" },
        // Adding some common genres that work for both
        { id: 18, name: "Drama" }, // Only if TMDB supports this for TV
        { id: 35, name: "Comedy" }, // Only if TMDB supports this for TV
      ],
    }),
    []
  );

  // Get the correct genres based on type
  const filteredGenres = useMemo(() => genreData[type], [type, genreData]);

  const genresPerPage = 9;
  const totalPages = Math.ceil(filteredGenres.length / genresPerPage);
  const currentGenres = filteredGenres.slice(
    (currentPage - 1) * genresPerPage,
    currentPage * genresPerPage
  );

  useEffect(() => {
    const fetchGenreItems = async () => {
      setLoading(true);
      const itemsByGenre = {};

      await Promise.all(
        filteredGenres.map(async (genre) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
            );
            const data = await response.json();
            itemsByGenre[genre.id] = data.results.slice(0, 4).map((item) => ({
              poster:
                item.poster_path || item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w200${
                      item.poster_path || item.backdrop_path
                    }`
                  : null,
              title: type === "movie" ? item.title : item.name,
              date:
                type === "movie"
                  ? item.release_date?.substring(0, 4)
                  : item.first_air_date?.substring(0, 4),
            }));
          } catch (error) {
            console.error(`Error fetching ${genre.name} ${type}s:`, error);
            itemsByGenre[genre.id] = Array(4).fill({
              poster: null,
              title: "",
              date: "",
            });
          }
        })
      );

      setGenreItems(itemsByGenre);
      setLoading(false);
    };

    fetchGenreItems();
  }, [type, filteredGenres]);

  const handleGenreClick = (genreId, genreName) => {
    navigate(`/view-all/${type}-genre-${genreId}`, {
      state: { genreName },
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="genres-container">
      <div className="section-header">
        <h2 className="section-title">Browse by Genre</h2>
        {totalPages > 1 && (
          <ul className="pagination">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`pagination-button ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    {number}
                  </button>
                </li>
              )
            )}

            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
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

      {loading ? (
        <div className="loading-genres">Loading genres...</div>
      ) : (
        <div className="genres-grid">
          {currentGenres.map((genre) => (
            <div key={genre.id} className="genre-card">
              <div className="genre-collage">
                {genreItems[genre.id]?.map((item, index) => (
                  <div
                    key={index}
                    className={`collage-img collage-img-${index + 1}`}
                    style={{
                      backgroundImage: item.poster
                        ? `url(${item.poster})`
                        : "linear-gradient(to bottom, #333, #555)",
                    }}
                  >
                    {!item.poster && (
                      <div className="poster-placeholder">
                        {item.title.substring(0, 2).toUpperCase() ||
                          genre.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="genre-info">
                <div className="genre-title-row">
                  <h3
                    onClick={() => {
                      if (window.innerWidth <= 1366) {
                        handleGenreClick(genre.id, genre.name);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    aria-label={`View ${genre.name} ${type}s`}
                  >
                    {genre.name}
                  </h3>
                  <button
                    className="genre-arrow-button"
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                    aria-label={`View ${genre.name} ${type}s`}
                  >
                    <ArrowForward style={{ fontSize: "25px" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreGrid;
