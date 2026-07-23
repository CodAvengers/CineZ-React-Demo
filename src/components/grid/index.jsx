import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles/grid.css";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { useNavigate } from "react-router-dom";
import { movieRowMetrics, useFitPerRow } from "../../hooks/useFitPerRow";
import { useImageLoaded } from "../../hooks/useImageLoaded";
import { MovieCardSkeleton, MovieRowSkeleton } from "../Skeleton";
import "../Skeleton/styles/skeleton.css";

const STACK_PREVIEW = 8;
const DRAG_THRESHOLD_PX = 8;
const STEP_DURATION_MS = 240;

function getRatingClass(rating) {
  if (rating >= 8) return "high";
  if (rating >= 5) return "medium";
  return "low";
}

function dataSignature(items) {
  return items.map((item) => item.id).join(",");
}

function rotateForward(deck, slots) {
  if (deck.length <= slots) return deck;
  const next = [...deck];
  const [card] = next.splice(slots, 1);
  next.unshift(card);
  return next;
}

function rotateBackward(deck, slots) {
  if (deck.length <= slots) return deck;
  const next = [...deck];
  const [card] = next.splice(0, 1);
  next.splice(slots, 0, card);
  return next;
}

function stepsFromGesture(dx, dtMs) {
  const absDx = Math.abs(dx);
  const velocity = absDx / Math.max(dtMs, 1);

  if (absDx < 28 && velocity < 0.35) return 0;

  if (velocity > 1.2 || absDx > 180) return 3;
  if (velocity > 0.6 || absDx > 90) return 2;
  return 1;
}

function MovieCard({ item, onItemClick }) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    () => item.posterUrl || item.backdropUrl || null
  );
  const { imgRef, loaded: imageLoaded, markLoaded } =
    useImageLoaded(currentImage);

  useEffect(() => {
    setImageError(false);
    setCurrentImage(item.posterUrl || item.backdropUrl || null);
  }, [item.id, item.posterUrl, item.backdropUrl]);

  const handleImageError = () => {
    if (item.posterUrlSmall && currentImage !== item.posterUrlSmall) {
      setCurrentImage(item.posterUrlSmall);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const titleText = item.title || "NA";
  const initials = titleText.substring(0, 2).toUpperCase();
  const rating = item.rating ?? 0;

  return (
    <div className="movie-card" onClick={() => onItemClick?.(item)}>
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
}

function StackPoster({ item }) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    () => item.posterUrl || item.backdropUrl || null
  );
  const { imgRef, loaded: imageLoaded, markLoaded } =
    useImageLoaded(currentImage);

  useEffect(() => {
    setImageError(false);
    setCurrentImage(item.posterUrl || item.backdropUrl || null);
  }, [item.id, item.posterUrl, item.backdropUrl]);

  const handleImageError = () => {
    if (item.posterUrlSmall && currentImage !== item.posterUrlSmall) {
      setCurrentImage(item.posterUrlSmall);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const titleText = item.title || "NA";
  const initials = titleText.substring(0, 2).toUpperCase();

  return (
    <div className="album-stack__poster">
      {!imageError && currentImage ? (
        <>
          {!imageLoaded && <div className="skeleton skeleton--fill" />}
          <img
            ref={imgRef}
            src={currentImage}
            alt=""
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
  );
}

function AlbumStack({ items, overflowCount = 0, onFrontClick }) {
  if (!items.length) return null;

  const front = items[0];
  // Render back-to-front so the first item sits on top
  const layers = [...items].reverse();

  return (
    <div
      className="album-stack"
      role="button"
      tabIndex={0}
      aria-label={`${front.title || "More titles"}, ${overflowCount + items.length} in stack`}
      onClick={() => onFrontClick?.(front)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onFrontClick?.(front);
        }
      }}
    >
      <div className="album-stack__layers">
        {layers.map((item, index) => {
          const depth = items.length - 1 - index;
          return (
            <div
              key={item.id}
              className="album-stack__layer"
              style={{ "--stack-depth": depth }}
              aria-hidden={depth !== 0}
            >
              <StackPoster item={item} />
            </div>
          );
        })}
        {overflowCount > 0 && (
          <span className="album-stack__badge" aria-hidden="true">
            +{overflowCount}
          </span>
        )}
      </div>
      {/* Matches .movie-info height so the row stays aligned */}
      <div className="album-stack__foot" aria-hidden="true" />
    </div>
  );
}

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
  singleRow = true,
}) => {
  const navigate = useNavigate();
  const measureRef = useRef(null);
  const itemsPerRow = useFitPerRow(measureRef, movieRowMetrics);

  const [deck, setDeck] = useState(() => data);
  const [animating, setAnimating] = useState(false);
  const suppressClickRef = useRef(false);
  const gestureRef = useRef(null);
  const animTimerRef = useRef(null);
  const dataKeyRef = useRef(`${currentPage}:${dataSignature(data)}`);

  useEffect(() => {
    const key = `${currentPage}:${dataSignature(data)}`;
    if (dataKeyRef.current === key) return;
    dataKeyRef.current = key;
    setDeck(data);
  }, [data, currentPage]);

  const slots = useMemo(() => {
    if (!singleRow) return data.length;
    return Math.max(1, itemsPerRow - 1);
  }, [singleRow, itemsPerRow, data.length]);

  const hasStack = singleRow && deck.length > slots;
  const fullCards = useMemo(() => {
    if (!singleRow) return data;
    if (!hasStack) return deck.slice(0, itemsPerRow);
    return deck.slice(0, slots);
  }, [singleRow, data, deck, hasStack, itemsPerRow, slots]);

  const stackCards = useMemo(() => {
    if (!hasStack) return [];
    return deck.slice(slots, slots + STACK_PREVIEW);
  }, [hasStack, deck, slots]);

  const overflowCount = hasStack
    ? Math.max(0, deck.length - slots - stackCards.length)
    : 0;

  const gridItemCount = hasStack ? slots + 1 : Math.max(fullCards.length, 1);

  const skeletonCount = singleRow
    ? Math.max(itemsPerRow, 4)
    : Math.min(Math.max(data.length, 12), 20);

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
      if (suppressClickRef.current) return;
      onItemClick?.(item);
    },
    [onItemClick]
  );

  const runRotation = useCallback(
    (direction, steps) => {
      if (!hasStack || steps <= 0 || animating) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const apply = (count) => {
        setDeck((prev) => {
          let next = prev;
          for (let i = 0; i < count; i += 1) {
            next =
              direction === "forward"
                ? rotateForward(next, slots)
                : rotateBackward(next, slots);
          }
          return next;
        });
      };

      if (reduceMotion) {
        apply(steps);
        return;
      }

      setAnimating(true);
      apply(steps);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setAnimating(false);
        animTimerRef.current = null;
      }, STEP_DURATION_MS);
    },
    [hasStack, animating, slots]
  );

  useEffect(
    () => () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    },
    []
  );

  const onPointerDown = useCallback(
    (event) => {
      if (!hasStack || event.button != null && event.button !== 0) return;
      gestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startTime: performance.now(),
        lastX: event.clientX,
        axis: null,
        dragged: false,
      };
      suppressClickRef.current = false;
    },
    [hasStack]
  );

  const onPointerMove = useCallback(
    (event) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;

      if (!gesture.axis) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) {
          return;
        }
        gesture.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (gesture.axis === "x") {
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }
      }

      if (gesture.axis === "y") return;

      event.preventDefault();
      gesture.lastX = event.clientX;
      if (Math.abs(dx) >= DRAG_THRESHOLD_PX) {
        gesture.dragged = true;
        suppressClickRef.current = true;
      }
    },
    []
  );

  const finishGesture = useCallback(
    (event) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      const dx = event.clientX - gesture.startX;
      const dt = performance.now() - gesture.startTime;
      const wasHorizontal = gesture.axis === "x" && gesture.dragged;

      try {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      } catch {
        /* already released */
      }
      gestureRef.current = null;

      if (!wasHorizontal) {
        // Allow click; clear suppress on next tick if it was a tiny move
        if (!gesture.dragged) suppressClickRef.current = false;
        return;
      }

      const steps = stepsFromGesture(dx, dt);
      if (steps > 0) {
        // Swipe left (negative dx) advances stack → first slot
        runRotation(dx < 0 ? "forward" : "backward", steps);
      }

      // Keep clicks suppressed until after the click event from this gesture
      requestAnimationFrame(() => {
        suppressClickRef.current = false;
      });
    },
    [runRotation]
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
                disabled={currentPage === 1 || loading}
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
                  disabled={loading}
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
                disabled={currentPage === totalPages || loading}
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
      <div className="movies-grid-measure" ref={measureRef}>
        {loading ? (
          singleRow ? (
            <MovieRowSkeleton count={skeletonCount} showStack />
          ) : (
            <div className="movies-grid" aria-busy="true">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          )
        ) : (
          <div
            className={[
              "movies-grid",
              singleRow ? "movies-grid--single-row" : "",
              hasStack ? "movies-grid--album-carousel" : "",
              animating ? "movies-grid--rotating" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              singleRow
                ? { "--items-per-row": gridItemCount }
                : undefined
            }
            onPointerDown={hasStack ? onPointerDown : undefined}
            onPointerMove={hasStack ? onPointerMove : undefined}
            onPointerUp={hasStack ? finishGesture : undefined}
            onPointerCancel={hasStack ? finishGesture : undefined}
          >
            {fullCards.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
              />
            ))}
            {hasStack && (
              <AlbumStack
                items={stackCards}
                overflowCount={overflowCount}
                onFrontClick={handleItemClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Grid);
