import React from "react";
import { Skeleton } from "../../../components/Skeleton";
import DetailsShell from "./DetailsShell";

const DetailsPageSkeleton = () => {
  return (
    <DetailsShell>
      <header className="details-hero" aria-busy="true">
        <Skeleton style={{ height: 42, width: "min(70%, 420px)" }} />
        <Skeleton style={{ height: 18, width: "min(50%, 280px)" }} />
        <Skeleton style={{ height: 16, width: "min(40%, 200px)" }} />
      </header>

      <div className="details-player-wrap">
        <Skeleton
          className="details-player"
          style={{ aspectRatio: "16 / 9", width: "100%", borderRadius: 10 }}
        />
      </div>

      <section className="details-section">
        <Skeleton style={{ height: 22, width: 110 }} />
        <Skeleton style={{ height: 14, width: "100%" }} />
        <Skeleton style={{ height: 14, width: "92%" }} />
        <Skeleton style={{ height: 14, width: "78%" }} />
      </section>
    </DetailsShell>
  );
};

export default DetailsPageSkeleton;
