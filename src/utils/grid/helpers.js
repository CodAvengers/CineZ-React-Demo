export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function getRatingClass(rating) {
  if (rating >= 8) return "high";
  if (rating >= 5) return "medium";
  return "low";
}

export function dataSignature(items) {
  return items.map((item) => item?.id).join(",");
}

export function posterUrlFor(item) {
  return item?.posterUrl || item?.backdropUrl || item?.posterUrlSmall || null;
}

export function stepsFromGesture(dx, dtMs) {
  const absDx = Math.abs(dx);
  const velocity = absDx / Math.max(dtMs, 1);

  if (absDx < 28 && velocity < 0.35) return 0;
  if (velocity > 1.2 || absDx > 180) return 3;
  if (velocity > 0.6 || absDx > 90) return 2;
  return 1;
}

export function viewAllPath(title, mediaType) {
  if (title.includes("Netflix Originals")) {
    return `/view-all/netflix-originals-${mediaType}`;
  }
  if (title.includes("Amazon Originals")) {
    return `/view-all/amazon-originals-${mediaType}`;
  }
  if (title.includes("HBO Originals")) {
    return `/view-all/hbo-originals-${mediaType}`;
  }
  if (title.includes("Disney Originals")) {
    return `/view-all/disney-originals-${mediaType}`;
  }
  if (title.includes("Apple Originals")) {
    return `/view-all/apple-originals-${mediaType}`;
  }
  return `/view-all/${title.toLowerCase().replace(/\s+/g, "-")}`;
}
