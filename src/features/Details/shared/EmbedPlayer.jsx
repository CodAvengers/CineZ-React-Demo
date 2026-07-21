import React from "react";
import "./EmbedPlayer.css";

const IFRAME_ALLOW =
  "autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write";

/**
 * Shared iframe player used by movie and TV details pages.
 */
const EmbedPlayer = ({
  src,
  title,
  frameKey,
  className = "details-player",
}) => {
  return (
    <div className={className}>
      {!src ? (
        <div className="player-error">
          Playback is unavailable. No playback providers are configured.
        </div>
      ) : (
        <iframe
          key={frameKey}
          src={src}
          title={title}
          allow={IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="origin"
        />
      )}
    </div>
  );
};

export default EmbedPlayer;
