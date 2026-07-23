import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./styles/grid.css";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { useNavigate } from "react-router-dom";
import { movieRowMetrics, useFitPerRow } from "../../hooks/useFitPerRow";
import { useImageLoaded } from "../../hooks/useImageLoaded";
import { MovieCardSkeleton, MovieRowSkeleton } from "../Skeleton";
import "../Skeleton/styles/skeleton.css";

const STACK_PREVIEW = 8;
const DRAG_THRESHOLD_PX = 8;
const STEP_DURATION_MS = 280;
const DEAL_DURATION_MS = 520;
const DEAL_STAGGER_MS = 70;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getRatingClass(rating) {
  if (rating >= 8) return "high";
  if (rating >= 5) return "medium";
  return "low";
}

function dataSignature(items) {
  return items.map((item) => item?.id).join(",");
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

/** Rotate the deck so the next hand (currently in the stack) becomes the slots. */
function rotateHandForward(deck, slots) {
  if (deck.length <= slots) return deck;
  return [...deck.slice(slots), ...deck.slice(0, slots)];
}

function rotateHandBackward(deck, slots) {
  if (deck.length <= slots) return deck;
  const n = deck.length;
  const take = Math.min(slots, n - slots);
  return [...deck.slice(n - take), ...deck.slice(0, n - take)];
}

function stepsFromGesture(dx, dtMs) {
  const absDx = Math.abs(dx);
  const velocity = absDx / Math.max(dtMs, 1);

  if (absDx < 28 && velocity < 0.35) return 0;

  if (velocity > 1.2 || absDx > 180) return 3;
  if (velocity > 0.6 || absDx > 90) return 2;
  return 1;
}

function posterUrlFor(item) {
  return item?.posterUrl || item?.backdropUrl || item?.posterUrlSmall || null;
}

const MovieCard = forwardRef(function MovieCard({ item, onItemClick }, ref) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(() => posterUrlFor(item));
  const { imgRef, loaded: imageLoaded, markLoaded } =
    useImageLoaded(currentImage);

  useEffect(() => {
    setImageError(false);
    setCurrentImage(posterUrlFor(item));
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

function StackPoster({ item }) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(() => posterUrlFor(item));
  const { imgRef, loaded: imageLoaded, markLoaded } =
    useImageLoaded(currentImage);

  useEffect(() => {
    setImageError(false);
    setCurrentImage(posterUrlFor(item));
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

const AlbumStack = forwardRef(function AlbumStack(
  { items, overflowCount = 0, onFrontClick },
  ref
) {
  if (!items.length) return null;

  const front = items[0];
  const layers = [...items].reverse();

  return (
    <div
      ref={ref}
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
              data-stack-depth={depth}
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
    </div>
  );
});

function DealFlyer({ flight, settling = false }) {
  const [onTable, setOnTable] = useState(false);
  const url = posterUrlFor(flight.item);
  const isStack = flight.kind === "stack";

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOnTable(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const titleText = flight.item.title || "";
  const initials = titleText.substring(0, 2).toUpperCase() || "?";
  const rating = flight.item.rating ?? 0;

  const scaleX = flight.to.w / Math.max(flight.from.w, 1);
  const scaleY = flight.to.h / Math.max(flight.from.h, 1);

  return (
    <div
      className={`deal-flyer${isStack ? " deal-flyer--stack" : ""}${
        onTable ? " is-dealt" : ""
      }${settling ? " is-settling" : ""}`}
      style={{
        width: flight.from.w,
        height: flight.from.h,
        transform: onTable
          ? `translate(${flight.to.x}px, ${flight.to.y}px) scale(${scaleX}, ${scaleY})`
          : `translate(${flight.from.x}px, ${flight.from.y}px)`,
        transitionDuration: settling
          ? "100ms"
          : `${flight.duration ?? DEAL_DURATION_MS}ms`,
        transitionDelay: settling ? "0ms" : `${flight.delay}ms`,
        zIndex: flight.zIndex,
      }}
      aria-hidden="true"
    >
      <div className="deal-flyer__art">
        {url ? (
          <img src={url} alt="" draggable={false} />
        ) : (
          <div className="deal-flyer__placeholder">{initials}</div>
        )}
      </div>
      {!isStack && (
        <div className="deal-flyer__meta">
          <div className="movie-title">{titleText}</div>
          {rating > 0 && (
            <div className="movie-meta">
              <span className={`movie-rating ${getRatingClass(rating)}`}>
                <StarHalfIcon style={{ fontSize: "14px" }} />
                {rating.toFixed(1)}/10
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function layerRect(stackEl, depth) {
  const layer = stackEl.querySelector(`[data-stack-depth="${depth}"]`);
  if (layer) return layer.getBoundingClientRect();

  const stackRect = stackEl.getBoundingClientRect();
  const step = 12;
  return {
    left: stackRect.left + depth * step,
    top: stackRect.top,
    width: stackRect.width * 0.92,
    height: stackRect.height,
    right: stackRect.left + depth * step + stackRect.width * 0.92,
    bottom: stackRect.bottom,
  };
}

function buildHandDealFlights(dealItems, stackEl, slotEls) {
  if (!stackEl || !dealItems.length) return [];

  return dealItems
    .map((item, index) => {
      const slotEl = slotEls[index];
      if (!slotEl) return null;

      const fromRect = layerRect(stackEl, index);
      const toRect = slotEl.getBoundingClientRect();

      return {
        key: `deal-${item.id}-${index}`,
        kind: "slot",
        item,
        from: {
          x: fromRect.left,
          y: fromRect.top,
          w: Math.max(fromRect.width, 40),
          h: Math.max(fromRect.height, 40),
        },
        to: {
          x: toRect.left,
          y: toRect.top,
          w: Math.max(toRect.width, 40),
          h: Math.max(toRect.height, 40),
        },
        delay: index * DEAL_STAGGER_MS,
        zIndex: 600 - index,
        duration: DEAL_DURATION_MS,
      };
    })
    .filter(Boolean);
}

/** Next album-stack hand slides in from off-screen while slots are dealt. */
function buildStackRefillFlights(nextStackItems, stackEl, direction) {
  if (!stackEl || !nextStackItems.length) return [];

  const viewportW =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  return nextStackItems.map((item, index) => {
    const toRect = layerRect(stackEl, index);
    const w = Math.max(toRect.width, 40);
    const h = Math.max(toRect.height, 40);

    // Forward: enter from the right (off-screen). Backward: from the left.
    const fromX =
      direction === "forward"
        ? viewportW + 24 + index * 16
        : -w - 24 - index * 16;

    return {
      key: `stack-in-${item.id}-${index}`,
      kind: "stack",
      item,
      from: {
        x: fromX,
        y: toRect.top,
        w,
        h,
      },
      to: {
        x: toRect.left,
        y: toRect.top,
        w,
        h,
      },
      // Start slightly after cards leave the stack so the belt reads clearly
      delay: 90 + index * 45,
      zIndex: 350 - index,
      duration: DEAL_DURATION_MS + 40,
    };
  });
}

function preloadPosters(items) {
  if (typeof window === "undefined") return Promise.resolve();

  return Promise.all(
    items.map(
      (item) =>
        new Promise((resolve) => {
          const url = posterUrlFor(item);
          if (!url) {
            resolve();
            return;
          }
          const img = new Image();
          let settled = false;
          const done = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          img.onload = done;
          img.onerror = done;
          img.src = url;
          if (img.complete) done();
        })
    )
  );
}

function mergeDealFlights(slotFlights, stackFlights) {
  return [...slotFlights, ...stackFlights];
}

function flightBatchDuration(flights) {
  if (!flights.length) return 0;
  return Math.max(
    ...flights.map((f) => (f.delay || 0) + (f.duration || DEAL_DURATION_MS))
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
  const [handIndex, setHandIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dealFlights, setDealFlights] = useState(null);
  // flying = hide real grid; settling = real grid under flyers, then drop cover
  const [dealPhase, setDealPhase] = useState(null);
  const suppressClickRef = useRef(false);
  const gestureRef = useRef(null);
  const animTimerRef = useRef(null);
  const dealTimerRef = useRef(null);
  const settleTimerRef = useRef(null);
  const sourceSigRef = useRef(dataSignature(data));
  const slotRefs = useRef([]);
  const stackRef = useRef(null);

  const isDealing = dealPhase != null || Boolean(dealFlights?.length);

  // Resync when parent fetches a new list (API page / refresh)
  useEffect(() => {
    const sig = dataSignature(data);
    if (sig === sourceSigRef.current) return;
    sourceSigRef.current = sig;
    setDeck(data);
    setHandIndex(0);
    setDealFlights(null);
    setDealPhase(null);
  }, [data]);

  useEffect(
    () => () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (dealTimerRef.current) clearTimeout(dealTimerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    },
    []
  );

  const slots = useMemo(() => {
    if (!singleRow) return Math.max(data.length, 1);
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

  // Hands within the current list (album stack → next row)
  const totalHands = useMemo(() => {
    if (!singleRow || !hasStack) return Math.max(totalPages, 1);
    return Math.max(1, Math.ceil(deck.length / slots));
  }, [singleRow, hasStack, deck.length, slots, totalPages]);

  const visiblePageCount = Math.min(totalHands, 4);
  const activeHand = Math.min(handIndex, totalHands - 1);

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
      if (suppressClickRef.current || isDealing) return;
      onItemClick?.(item);
    },
    [onItemClick, isDealing]
  );

  const finishDeal = useCallback((nextDeck, nextHand) => {
    const visible = nextDeck.slice(0, slots + STACK_PREVIEW);

    const reveal = () => {
      // Commit the real row/stack while flyers still cover the same pixels
      setDeck(nextDeck);
      setHandIndex(nextHand);
      setDealPhase("settling");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
          // Keep flyers one beat so decoded posters paint underneath, then lift cover
          settleTimerRef.current = setTimeout(() => {
            setDealFlights(null);
            setDealPhase(null);
            settleTimerRef.current = null;
          }, 120);
        });
      });
    };

    preloadPosters(visible).then(reveal);
  }, [slots]);

  const startDealFlights = useCallback((flights, nextDeck, nextHand) => {
    setDealPhase("flying");
    setDealFlights(flights);

    // Warm the destination posters while cards are in the air
    preloadPosters(nextDeck.slice(0, slots + STACK_PREVIEW));

    const totalMs = flightBatchDuration(flights) + 40;
    if (dealTimerRef.current) clearTimeout(dealTimerRef.current);
    dealTimerRef.current = setTimeout(() => {
      finishDeal(nextDeck, nextHand);
      dealTimerRef.current = null;
    }, totalMs);
  }, [slots, finishDeal]);

  /**
   * Solitaire hand deal: album stack cards 0..n fly into slots 0..n,
   * then the deck rotates so those cards become the new row.
   */
  const dealHand = useCallback(
    (direction) => {
      if (!hasStack || isDealing || animating) return false;

      const nextHand =
        direction === "forward"
          ? (activeHand + 1) % totalHands
          : (activeHand - 1 + totalHands) % totalHands;

      if (nextHand === activeHand) return false;

      const nextDeck =
        direction === "forward"
          ? rotateHandForward(deck, slots)
          : rotateHandBackward(deck, slots);

      const dealItems =
        direction === "forward"
          ? deck.slice(slots, slots + slots)
          : nextDeck.slice(0, slots);

      const nextStackItems = nextDeck.slice(slots, slots + STACK_PREVIEW);

      if (prefersReducedMotion()) {
        finishDeal(nextDeck, nextHand);
        return true;
      }

      const slotEls = slotRefs.current.slice(0, slots).filter(Boolean);
      const stackEl = stackRef.current;

      if (!stackEl || slotEls.length < dealItems.length) {
        finishDeal(nextDeck, nextHand);
        return true;
      }

      const slotFlights = buildHandDealFlights(dealItems, stackEl, slotEls);
      const stackFlights = buildStackRefillFlights(
        nextStackItems,
        stackEl,
        direction
      );
      const flights = mergeDealFlights(slotFlights, stackFlights);

      if (!slotFlights.length) {
        finishDeal(nextDeck, nextHand);
        return true;
      }

      startDealFlights(flights, nextDeck, nextHand);
      return true;
    },
    [
      hasStack,
      isDealing,
      animating,
      activeHand,
      totalHands,
      deck,
      slots,
      finishDeal,
      startDealFlights,
    ]
  );

  const goToHand = useCallback(
    (hand) => {
      if (hand === activeHand || isDealing || animating) return;
      if (hand < 0 || hand >= totalHands) return;

      const direction = hand > activeHand ? "forward" : "backward";

      if (Math.abs(hand - activeHand) === 1) {
        dealHand(direction);
        return;
      }

      if (!hasStack || prefersReducedMotion()) {
        let next = deck;
        const step = hand > activeHand ? 1 : -1;
        let idx = activeHand;
        while (idx !== hand) {
          next =
            step > 0
              ? rotateHandForward(next, slots)
              : rotateHandBackward(next, slots);
          idx += step;
        }
        finishDeal(next, hand);
        return;
      }

      const slotEls = slotRefs.current.slice(0, slots).filter(Boolean);
      const stackEl = stackRef.current;
      const dealItems =
        direction === "forward"
          ? deck.slice(slots, slots + slots)
          : rotateHandBackward(deck, slots).slice(0, slots);

      let next = deck;
      const step = hand > activeHand ? 1 : -1;
      let idx = activeHand;
      while (idx !== hand) {
        next =
          step > 0
            ? rotateHandForward(next, slots)
            : rotateHandBackward(next, slots);
        idx += step;
      }

      const nextStackItems = next.slice(slots, slots + STACK_PREVIEW);
      const slotFlights = buildHandDealFlights(dealItems, stackEl, slotEls);
      const stackFlights = buildStackRefillFlights(
        nextStackItems,
        stackEl,
        direction
      );
      const flights = mergeDealFlights(slotFlights, stackFlights);

      if (!slotFlights.length) {
        finishDeal(next, hand);
        return;
      }

      startDealFlights(flights, next, hand);
    },
    [
      activeHand,
      isDealing,
      animating,
      totalHands,
      dealHand,
      hasStack,
      deck,
      slots,
      finishDeal,
      startDealFlights,
    ]
  );

  const beginPageChange = useCallback(
    (nextPage) => {
      if (loading || isDealing) return;

      // Single-row + album stack: pagination deals the next hand from the stack
      if (singleRow && hasStack) {
        const targetHand = nextPage - 1;
        if (targetHand === activeHand) return;
        if (targetHand > activeHand) {
          if (targetHand === activeHand + 1) dealHand("forward");
          else goToHand(targetHand);
        } else if (targetHand === activeHand - 1) {
          dealHand("backward");
        } else {
          goToHand(targetHand);
        }
        return;
      }

      // Fallback: original API pagination
      if (!onPageChange || nextPage === currentPage) return;
      if (nextPage < 1 || nextPage > totalPages) return;
      onPageChange(nextPage);
    },
    [
      loading,
      isDealing,
      singleRow,
      hasStack,
      activeHand,
      dealHand,
      goToHand,
      onPageChange,
      currentPage,
      totalPages,
    ]
  );

  const runRotation = useCallback(
    (direction, steps) => {
      if (!hasStack || steps <= 0 || animating || isDealing) return;

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

      if (prefersReducedMotion()) {
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
    [hasStack, animating, isDealing, slots]
  );

  const onPointerDown = useCallback(
    (event) => {
      if (!hasStack || isDealing || (event.button != null && event.button !== 0))
        return;
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
    [hasStack, isDealing]
  );

  const onPointerMove = useCallback((event) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;

    if (!gesture.axis) {
      if (
        Math.abs(dx) < DRAG_THRESHOLD_PX &&
        Math.abs(dy) < DRAG_THRESHOLD_PX
      ) {
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
  }, []);

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
        if (!gesture.dragged) suppressClickRef.current = false;
        return;
      }

      const steps = stepsFromGesture(dx, dt);
      if (steps > 0) {
        runRotation(dx < 0 ? "forward" : "backward", steps);
      }

      requestAnimationFrame(() => {
        suppressClickRef.current = false;
      });
    },
    [runRotation]
  );

  const paginationLocked = loading || isDealing;
  const showSkeleton = loading && deck.length === 0;
  const uiPage = singleRow && hasStack ? activeHand + 1 : currentPage;
  const uiTotal = singleRow && hasStack ? visiblePageCount : Math.min(totalPages, 4);
  const uiMaxPage = singleRow && hasStack ? totalHands : totalPages;

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
                onClick={() => beginPageChange(uiPage - 1)}
                disabled={uiPage === 1 || paginationLocked}
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

            {Array.from({ length: uiTotal }, (_, i) => i + 1).map((number) => (
              <li key={number}>
                <button
                  onClick={() => beginPageChange(number)}
                  disabled={paginationLocked}
                  className={`pagination-button ${
                    uiPage === number ? "active" : ""
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => beginPageChange(uiPage + 1)}
                disabled={uiPage >= uiMaxPage || paginationLocked}
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
        {showSkeleton ? (
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
              dealPhase === "flying" ? "movies-grid--deal-flying" : "",
              dealPhase === "settling" ? "movies-grid--deal-settling" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              singleRow
                ? { "--items-per-row": gridItemCount }
                : undefined
            }
            aria-busy={loading || isDealing}
            onPointerDown={
              hasStack && !isDealing ? onPointerDown : undefined
            }
            onPointerMove={
              hasStack && !isDealing ? onPointerMove : undefined
            }
            onPointerUp={hasStack && !isDealing ? finishGesture : undefined}
            onPointerCancel={
              hasStack && !isDealing ? finishGesture : undefined
            }
          >
            {fullCards.map((item, index) => (
              <MovieCard
                key={item.id}
                ref={(el) => {
                  slotRefs.current[index] = el;
                }}
                item={item}
                onItemClick={handleItemClick}
              />
            ))}
            {hasStack && (
              <AlbumStack
                ref={stackRef}
                items={stackCards}
                overflowCount={overflowCount}
                onFrontClick={handleItemClick}
              />
            )}
          </div>
        )}
      </div>

      {dealFlights?.map((flight) => (
        <DealFlyer
          key={flight.key}
          flight={flight}
          settling={dealPhase === "settling"}
        />
      ))}
    </div>
  );
};

export default React.memo(Grid);
