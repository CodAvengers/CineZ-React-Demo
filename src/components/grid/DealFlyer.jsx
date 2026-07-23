import React, { useEffect, useState } from "react";
import { DEAL_DURATION_MS } from "../../utils/grid";
import MovieCard from "./MovieCard";
import { StackPoster } from "./AlbumStack";

function DealFlyer({ flight }) {
  const [onTable, setOnTable] = useState(false);
  const isStack = flight.kind === "stack";

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOnTable(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const w = flight.to.w;
  const h = flight.to.h;

  return (
    <div
      className={`deal-flyer${isStack ? " deal-flyer--stack" : " deal-flyer--slot"}${
        onTable ? " is-dealt" : ""
      }`}
      style={{
        width: w,
        height: h,
        transform: onTable
          ? `translate(${flight.to.x}px, ${flight.to.y}px)`
          : `translate(${flight.from.x}px, ${flight.from.y}px)`,
        transitionDuration: `${flight.duration ?? DEAL_DURATION_MS}ms`,
        transitionDelay: `${flight.delay}ms`,
        zIndex: flight.zIndex,
      }}
      aria-hidden="true"
    >
      {isStack ? (
        <div className="deal-flyer__stack-layer">
          <StackPoster item={flight.item} />
        </div>
      ) : (
        <MovieCard item={flight.item} />
      )}
    </div>
  );
}

export default DealFlyer;
