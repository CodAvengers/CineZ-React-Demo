import React, { useCallback, useState } from "react";
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

  const getRatingClass = useCallback((rating) => {
    if (rating >= 8) return "high";
    if (rating >= 5) return "medium";
    return "low";
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

  const handleItemClick = useCallback(
    (item) => {
      onItemClick?.(item);
    },
    [onItemClick]
  );

  const MovieCard = useCallback(
    ({ item }) => {
      const [imageError, setImageError] = useState(false);
      const [currentImage, setCurrentImage] = useState(
        () => item.posterUrl || item.backdropUrl || null
      );

      const handleImageError = useCallback(() => {
        if (item.posterUrlSmall && currentImage !== item.posterUrlSmall) {
          setCurrentImage(item.posterUrlSmall);
          setImageError(false);
        } else {
          setImageError(true);
        }
      }, [item.posterUrlSmall, currentImage]);

      const titleText = item.title || "NA";
      const initials = titleText.substring(0, 2).toUpperCase();
      const rating = item.rating ?? 0;

      return (
        <div className="movie-card" onClick={() => handleItemClick(item)}>
          <div className="movie-poster">
            {!imageError && currentImage ? (
              <img
                src={currentImage}
                alt={titleText}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="poster-placeholder">{initials}</div>
            )}
          </div>
          <div className="movie-info">
            <div className="movie-title">{titleText}</div>
            <div className="movie-meta">
              {rating > 0 && (
                <span className={`movie-rating ${getRatingClass(rating)}`}>
                  <StarHalfIcon style={{ fontSize: "14px" }} />
                  {rating.toFixed(1)}/10
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
    [getRatingClass, handleItemClick]
  );

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
          data.map((item) => <MovieCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};
export default React.memo(Grid);
