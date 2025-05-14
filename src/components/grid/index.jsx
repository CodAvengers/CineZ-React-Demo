import React from "react";
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
  mediaType = "movie", // Add mediaType prop with default value
}) => {
  const getRatingClass = (voteAverage) => {
    if (voteAverage >= 8) return "high";
    if (voteAverage >= 5) return "medium";
    return "low"; 
  };

  // Handle missing or null poster paths
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return posterPath.includes("https://")
      ? posterPath
      : `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const navigate = useNavigate();

  const handleViewAll = () => {
    // Special handling for streaming platforms
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
    }
    // Handle other sections normally
    else {
      const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/view-all/${formattedTitle}`);
    }
  };

  return (
    <div className="movies-container">
      <div className="section-header">
        {showViewAll && (
          <div className="view-all-container">
            <button className="view-all-button" title="View All" onClick={handleViewAll}> 
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
                disabled={currentPage === 4}
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
            <div
              key={item.id}
              className="movie-card"
              onClick={() => onItemClick(item)}
            >
              <div className="movie-poster">
                {getPosterUrl(item.poster_path) ? (
                  <img
                    src={getPosterUrl(item.poster_path)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "";
                      e.target.alt = "Poster not available";
                      e.target.parentNode.innerHTML = `
                        <div class="poster-placeholder">
                          ${item.title?.substring(0, 2).toUpperCase() || "NA"}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="poster-placeholder">
                    {item.title?.substring(0, 2).toUpperCase() || "NA"}
                  </div>
                )}
              </div>

              <div className="movie-info">
                <div className="movie-title">{item.title || item.name}</div>
                <div className="movie-meta">
                  {item.vote_average > 0 && (
                    <span
                      className={`movie-rating ${getRatingClass(
                        item.vote_average
                      )}`}
                    >
                      <StarHalfIcon style={{ fontSize: "14px" }} />
                      {item.vote_average.toFixed(1)}/10
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
