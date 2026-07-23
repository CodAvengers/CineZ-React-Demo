import { useCallback, useEffect, useRef, useState } from "react";
import {
  DRAG_THRESHOLD_PX,
  STEP_DURATION_MS,
  rotateBackward,
  rotateForward,
  prefersReducedMotion,
  stepsFromGesture,
} from "../utils/grid";

/** Pointer swipe → single-card deck rotation. */
export function useDeckGesture({ hasStack, isDealing, slots, setDeck }) {
  const [animating, setAnimating] = useState(false);
  const suppressClickRef = useRef(false);
  const gestureRef = useRef(null);
  const animTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    },
    []
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
    [hasStack, animating, isDealing, slots, setDeck]
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

  return {
    animating,
    suppressClickRef,
    onPointerDown,
    onPointerMove,
    finishGesture,
  };
}
