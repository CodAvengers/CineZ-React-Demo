import React from "react";
import "./EmbedPlayer.css";

/**
 * Nested providers (SuperEmbed / 2Embed) often put the real player in a
 * child iframe. `fullscreen *` (and friends) delegates permission down the
 * frame tree — plain `fullscreen` is not enough for those cases.
 */
const IFRAME_ALLOW = [
  "autoplay *",
  "fullscreen *",
  "encrypted-media *",
  "picture-in-picture *",
  "clipboard-write *",
  "web-share *",
].join("; ");

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
          // Legacy attribute checks still used by some embed scripts
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        />
      )}
    </div>
  );
};

export default EmbedPlayer;
