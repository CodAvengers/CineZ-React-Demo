import React, { forwardRef } from "react";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { usePosterImage } from "../../hooks/usePosterImage";
import { getRatingClass } from "../../utils/grid";

const MovieCard = forwardRef(function MovieCard({ item, onItemClick }, ref) {
  const {
    imageError,
    currentImage,
    imgRef,
    imageLoaded,
    markLoaded,
    handleImageError,
    titleText,
    initials,
    rating,
  } = usePosterImage(item);

  return (
    <div
      ref={ref}
      className="movie-card"
      onClick={() => onItemClick?.(item)}
    >
      <div className="movie-poster">
        {!imageError && currentImage ? (
          <>
            {!imageLoaded && <div className="skeleton skeleton--fill" />}
            <img
              ref={imgRef}
              src={currentImage}
              alt={titleText}
              className={`media-fade${imageLoaded ? " is-loaded" : ""}`}
              onLoad={markLoaded}
              onError={handleImageError}
              loading="lazy"
              draggable={false}
            />
          </>
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
});

export default MovieCard;
