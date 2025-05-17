import React, { useCallback } from "react";
import "./styles/grid.css";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const Grid = ({
  data = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onItemClick,
  title = "Section Title",
  showViewAll = true,
  showPagination = true,
  mediaType = "movie",
}) => {
  const navigate = useNavigate();

  // Memoized functions for better performance
  const getRatingClass = useCallback((voteAverage) => {
    if (voteAverage >= 8) return "high";
    if (voteAverage >= 5) return "medium";
    return "low";
  }, []);

  const getPosterUrl = useCallback((posterPath) => {
    if (!posterPath) return null;
    return posterPath.includes("https://")
      ? posterPath
      : `https://image.tmdb.org/t/p/w500${posterPath}`;
  }, []);

  const handleViewAll = useCallback(() => {
    if (title.includes("Netflix Originals")) {
      navigate(`/view-all/netflix-originals-${mediaType}`);
    } else if (title.includes("Amazon Originals")) {
      navigate(`/view-all/amazon-originals-${mediaType}`);
    } else if (title.includes("HBO Originals")) {
      navigate(`/view-all/hbo-originals-${mediaType}`);
    } else if (title.includes("Disney Originals")) {
      navigate(`/view-all/disney-originals-${mediaType}`);
    } else if (title.includes("Apple Originals")) {
      navigate(`/view-all/apple-originals-${mediaType}`);
    } else {
      const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/view-all/${formattedTitle}`);
    }
  }, [title, mediaType, navigate]);

  const handleItemClick = useCallback((item) => {
    onItemClick(item);
  }, [onItemClick]);

  const handleImageError = useCallback((e) => {
    const parent = e.target.parentNode;
    if (!parent) return;
    
    const titleText = e.target.alt || "NA";
    const placeholder = document.createElement("div");
    placeholder.className = "poster-placeholder";
    placeholder.textContent = titleText.substring(0, 2).toUpperCase();
    
    parent.innerHTML = "";
    parent.appendChild(placeholder);
  }, []);

  // Memoized movie card component to prevent unnecessary re-renders
  const MovieCard = useCallback(({ item }) => (
    <div className="movie-card" onClick={() => handleItemClick(item)}>
      <div className="movie-poster">
        {getPosterUrl(item.poster_path) ? (
          <img
            src={getPosterUrl(item.poster_path)}
            alt={item.title || item.name || "Movie poster"}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            {(item.title || item.name || "NA").substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="movie-info">
        <div className="movie-title">{item.title || item.name}</div>
        <div className="movie-meta">
          {item.vote_average > 0 && (
            <span className={`movie-rating ${getRatingClass(item.vote_average)}`}>
              <StarHalfIcon style={{ fontSize: "14px" }} />
              {item.vote_average.toFixed(1)}/10
            </span>
          )}
        </div>
      </div>
    </div>
  ), [getPosterUrl, getRatingClass, handleImageError, handleItemClick]);

  return (
    <div className="movies-container">
      <div className="section-header">
        {showViewAll && (
          <div className="view-all-container">
            <button 
              className="view-all-button" 
              title="View All" 
              onClick={handleViewAll}
            >
              {title}
            </button>
          </div>
        )}

        {showPagination && (
          <ul className="pagination">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
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

            {Array.from(
              { length: Math.min(totalPages, 4) },
              (_, i) => i + 1
            ).map((number) => (
              <li key={number}>
                <button
                  onClick={() => onPageChange(number)}
                  className={`pagination-button ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
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

      <div className="movies-grid">
        {loading ? (
          <Loader />
        ) : (
          data.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Grid);