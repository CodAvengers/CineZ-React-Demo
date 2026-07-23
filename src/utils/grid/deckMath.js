/** Single-card carousel steps within a hand. */
export function rotateForward(deck, slots) {
  if (deck.length <= slots) return deck;
  const next = [...deck];
  const [card] = next.splice(slots, 1);
  next.unshift(card);
  return next;
}

export function rotateBackward(deck, slots) {
  if (deck.length <= slots) return deck;
  const next = [...deck];
  const [card] = next.splice(0, 1);
  next.splice(slots, 0, card);
  return next;
}

/** Rotate so the next hand (currently in the stack) becomes the slots. */
export function rotateHandForward(deck, slots) {
  if (deck.length <= slots) return deck;
  return [...deck.slice(slots), ...deck.slice(0, slots)];
}

export function rotateHandBackward(deck, slots) {
  if (deck.length <= slots) return deck;
  const n = deck.length;
  const take = Math.min(slots, n - slots);
  return [...deck.slice(n - take), ...deck.slice(0, n - take)];
}

export function advanceDeckToHand(deck, slots, fromHand, toHand) {
  let next = deck;
  const step = toHand > fromHand ? 1 : -1;
  let idx = fromHand;
  while (idx !== toHand) {
    next =
      step > 0
        ? rotateHandForward(next, slots)
        : rotateHandBackward(next, slots);
    idx += step;
  }
  return next;
}
