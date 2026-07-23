import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import {
  STACK_PREVIEW,
  buildHandDealFlights,
  buildStackRefillFlights,
  flightBatchDuration,
  mergeDealFlights,
  preloadPosters,
  advanceDeckToHand,
  rotateHandBackward,
  rotateHandForward,
  prefersReducedMotion,
} from "../utils/grid";

/**
 * Solitaire hand deals: stack → slots + off-screen stack refill.
 */
export function useAlbumDeal({
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
}) {
  const dealTimerRef = useRef(null);

  const clearDealTimer = useCallback(() => {
    if (dealTimerRef.current) {
      clearTimeout(dealTimerRef.current);
      dealTimerRef.current = null;
    }
  }, []);

  const finishDeal = useCallback(
    (nextDeck, nextHand) => {
      const visible = nextDeck.slice(0, slots + STACK_PREVIEW);

      const handoff = () => {
        flushSync(() => {
          setDeck(nextDeck);
          setHandIndex(nextHand);
        });

        requestAnimationFrame(() => {
          flushSync(() => {
            setDealFlights(null);
            setDealPhase(null);
          });
        });
      };

      preloadPosters(visible).then(handoff);
    },
    [slots, setDeck, setHandIndex, setDealFlights, setDealPhase]
  );

  const startDealFlights = useCallback(
    (flights, nextDeck, nextHand) => {
      setDealPhase("flying");
      setDealFlights(flights);
      preloadPosters(nextDeck.slice(0, slots + STACK_PREVIEW));

      const totalMs = flightBatchDuration(flights) + 40;
      clearDealTimer();
      dealTimerRef.current = setTimeout(() => {
        finishDeal(nextDeck, nextHand);
        dealTimerRef.current = null;
      }, totalMs);
    },
    [slots, setDealPhase, setDealFlights, clearDealTimer, finishDeal]
  );

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
      slotRefs,
      stackRef,
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
        finishDeal(advanceDeckToHand(deck, slots, activeHand, hand), hand);
        return;
      }

      const slotEls = slotRefs.current.slice(0, slots).filter(Boolean);
      const stackEl = stackRef.current;
      const dealItems =
        direction === "forward"
          ? deck.slice(slots, slots + slots)
          : rotateHandBackward(deck, slots).slice(0, slots);

      const next = advanceDeckToHand(deck, slots, activeHand, hand);
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
      slotRefs,
      stackRef,
    ]
  );

  return {
    dealHand,
    goToHand,
    finishDeal,
    clearDealTimer,
  };
}
