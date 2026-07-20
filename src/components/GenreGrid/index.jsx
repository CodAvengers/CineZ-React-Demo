import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/genre-grid.css";
import { ArrowForward } from "@mui/icons-material";
import { getGenrePreviews, MOVIE_GENRES, TV_GENRES } from "../../api";
import { genreRowMetrics, useFitPerRow } from "../../hooks/useFitPerRow";

const GenreGrid = ({ type = "movie" }) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [genreItems, setGenreItems] = useState({});
  const [loading, setLoading] = useState(true);
  const genresPerPage = useFitPerRow(gridRef, genreRowMetrics);

  const filteredGenres = useMemo(
    () => (type === "tv" ? TV_GENRES : MOVIE_GENRES),
    [type]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGenres.length / genresPerPage)
  );
  const currentGenres = filteredGenres.slice(
    (currentPage - 1) * genresPerPage,
    currentPage * genresPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [type, genresPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const fetchGenreItems = async () => {
      setLoading(true);
      try {
        const { itemsByGenre } = await getGenrePreviews(type);
        setGenreItems(itemsByGenre);
      } catch (error) {
        console.error(`Error fetching ${type} genres:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreItems();
  }, [type]);

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

      <div className="genres-grid-measure" ref={gridRef}>
        {loading ? (
          <div className="loading-genres">Loading genres...</div>
        ) : (
          <div
            className="genres-grid"
            style={{
              "--items-per-row": genresPerPage,
            }}
          >
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
    </div>
  );
};

export default GenreGrid;
