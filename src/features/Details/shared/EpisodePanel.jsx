import React from "react";

const EpisodePanel = ({
  seasons = [],
  selectedSeason,
  onSeasonChange,
  episodes = [],
  selectedEpisode,
  onEpisodeChange,
  episode,
}) => {
  return (
    <section className="details-episode">
      <h2>Episodes</h2>

      <div className="details-episode__controls">
        <div className="details-episode__field">
          <label htmlFor="season-select">Season</label>
          <select
            id="season-select"
            value={selectedSeason ?? ""}
            onChange={(e) => onSeasonChange(Number(e.target.value))}
          >
            {seasons.map((season) => (
              <option key={season.seasonNumber} value={season.seasonNumber}>
                Season {season.seasonNumber}
              </option>
            ))}
          </select>
        </div>

        {episodes.length > 0 && (
          <div className="details-episode__field">
            <label htmlFor="episode-select">Episode</label>
            <select
              id="episode-select"
              value={selectedEpisode ?? ""}
              onChange={(e) => onEpisodeChange(Number(e.target.value))}
            >
              {episodes.map((ep) => (
                <option key={ep.episodeNumber} value={ep.episodeNumber}>
                  {ep.episodeNumber}. {ep.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {episode && (
        <div className="details-episode__info">
          <h3>
            S{selectedSeason}E{selectedEpisode}: {episode.name}
          </h3>
          <p>{episode.overview || "No description available."}</p>
          {episode.stillUrl && (
            <img
              src={episode.stillUrl}
              alt=""
              className="details-episode__still"
            />
          )}
        </div>
      )}
    </section>
  );
};

export default EpisodePanel;
