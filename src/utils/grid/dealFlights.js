import {
  DEAL_DURATION_MS,
  DEAL_STAGGER_MS,
  STACK_LAYER_STEP_PX,
} from "./constants";
import { posterUrlFor } from "./helpers";

function layerRect(stackEl, depth) {
  const layer = stackEl.querySelector(`[data-stack-depth="${depth}"]`);
  if (layer) return layer.getBoundingClientRect();

  const stackRect = stackEl.getBoundingClientRect();
  const step = STACK_LAYER_STEP_PX;
  return {
    left: stackRect.left + depth * step,
    top: stackRect.top,
    width: stackRect.width * 0.92,
    height: stackRect.height,
    right: stackRect.left + depth * step + stackRect.width * 0.92,
    bottom: stackRect.bottom,
  };
}

export function buildHandDealFlights(dealItems, stackEl, slotEls) {
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
export function buildStackRefillFlights(nextStackItems, stackEl, direction) {
  if (!stackEl || !nextStackItems.length) return [];

  const viewportW =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  return nextStackItems.map((item, index) => {
    const toRect = layerRect(stackEl, index);
    const w = Math.max(toRect.width, 40);
    const h = Math.max(toRect.height, 40);

    const fromX =
      direction === "forward"
        ? viewportW + 24 + index * 16
        : -w - 24 - index * 16;

    return {
      key: `stack-in-${item.id}-${index}`,
      kind: "stack",
      item,
      from: { x: fromX, y: toRect.top, w, h },
      to: { x: toRect.left, y: toRect.top, w, h },
      delay: 90 + index * 45,
      zIndex: 350 - index,
      duration: DEAL_DURATION_MS + 40,
    };
  });
}

export function preloadPosters(items) {
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

export function mergeDealFlights(slotFlights, stackFlights) {
  return [...slotFlights, ...stackFlights];
}

export function flightBatchDuration(flights) {
  if (!flights.length) return 0;
  return Math.max(
    ...flights.map((f) => (f.delay || 0) + (f.duration || DEAL_DURATION_MS))
  );
}
