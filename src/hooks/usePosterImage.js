import { useEffect, useState } from "react";
import { useImageLoaded } from "./useImageLoaded";
import { posterUrlFor } from "../utils/grid";

/** Shared poster load/fallback state for MovieCard and StackPoster. */
export function usePosterImage(item) {
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

  return {
    imageError,
    currentImage,
    imgRef,
    imageLoaded,
    markLoaded,
    handleImageError,
    titleText,
    initials: titleText.substring(0, 2).toUpperCase(),
    rating: item.rating ?? 0,
  };
}
