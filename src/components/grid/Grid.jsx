import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { movieRowMetrics, useFitPerRow } from "../../hooks/useFitPerRow";
import { useAlbumDeal } from "../../hooks/useAlbumDeal";
import { useDeckGesture } from "../../hooks/useDeckGesture";
import { STACK_PREVIEW, dataSignature, viewAllPath } from "../../utils/grid";
import { MovieCardSkeleton, MovieRowSkeleton } from "../Skeleton";
import "../Skeleton/styles/skeleton.css";
import "./styles/grid.css";
import AlbumStack from "./AlbumStack";
import DealFlyer from "./DealFlyer";
import GridPagination from "./GridPagination";
import MovieCard from "./MovieCard";

function Grid({
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
}) {
  const navigate = useNavigate();
  const measureRef = useRef(null);
  const itemsPerRow = useFitPerRow(measureRef, movieRowMetrics);

  const [deck, setDeck] = useState(() => data);
  const [handIndex, setHandIndex] = useState(0);
  const [dealFlights, setDealFlights] = useState(null);
  const [dealPhase, setDealPhase] = useState(null);
  const sourceSigRef = useRef(dataSignature(data));
  const slotRefs = useRef([]);
  const stackRef = useRef(null);

  const isDealing = dealPhase != null || Boolean(dealFlights?.length);

  useEffect(() => {
    const sig = dataSignature(data);
    if (sig === sourceSigRef.current) return;
    sourceSigRef.current = sig;
    setDeck(data);
    setHandIndex(0);
    setDealFlights(null);
    setDealPhase(null);
  }, [data]);

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

  const totalHands = useMemo(() => {
    if (!singleRow || !hasStack) return Math.max(totalPages, 1);
    return Math.max(1, Math.ceil(deck.length / slots));
  }, [singleRow, hasStack, deck.length, slots, totalPages]);

  const visiblePageCount = Math.min(totalHands, 4);
  const activeHand = Math.min(handIndex, totalHands - 1);

  const skeletonCount = singleRow
    ? Math.max(itemsPerRow, 4)
    : Math.min(Math.max(data.length, 12), 20);

  const {
    animating,
    suppressClickRef,
    onPointerDown,
    onPointerMove,
    finishGesture,
  } = useDeckGesture({
    hasStack,
    isDealing,
    slots,
    setDeck,
  });

  const { dealHand, goToHand, clearDealTimer } = useAlbumDeal({
    deck,
    setDeck,
    setHandIndex,
    slots,
    hasStack,
    isDealing,
    animating,
    activeHand,
    totalHands,
    setDealFlights,
    setDealPhase,
    slotRefs,
    stackRef,
  });

  useEffect(() => () => clearDealTimer(), [clearDealTimer]);

  const handleViewAll = useCallback(() => {
    navigate(viewAllPath(title, mediaType));
  }, [navigate, title, mediaType]);

  const handleItemClick = useCallback(
    (item) => {
      if (suppressClickRef.current || isDealing) return;
      onItemClick?.(item);
    },
    [onItemClick, isDealing, suppressClickRef]
  );

  const beginPageChange = useCallback(
    (nextPage) => {
      if (loading || isDealing) return;

      if (singleRow && hasStack) {
        const targetHand = nextPage - 1;
        if (targetHand === activeHand) return;
        if (targetHand === activeHand + 1) dealHand("forward");
        else if (targetHand === activeHand - 1) dealHand("backward");
        else goToHand(targetHand);
        return;
      }

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

  const paginationLocked = loading || isDealing;
  const showSkeleton = loading && deck.length === 0;
  const uiPage = singleRow && hasStack ? activeHand + 1 : currentPage;
  const uiTotal =
    singleRow && hasStack ? visiblePageCount : Math.min(totalPages, 4);
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
          <GridPagination
            page={uiPage}
            pageCount={uiTotal}
            maxPage={uiMaxPage}
            locked={paginationLocked}
            onPageChange={beginPageChange}
          />
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
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              singleRow ? { "--items-per-row": gridItemCount } : undefined
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
        <DealFlyer key={flight.key} flight={flight} />
      ))}
    </div>
  );
}

export default React.memo(Grid);
