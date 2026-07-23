import React, { forwardRef } from "react";
import { usePosterImage } from "../../hooks/usePosterImage";

function StackPoster({ item }) {
  const {
    imageError,
    currentImage,
    imgRef,
    imageLoaded,
    markLoaded,
    handleImageError,
    initials,
  } = usePosterImage(item);

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

export { StackPoster };
export default AlbumStack;
