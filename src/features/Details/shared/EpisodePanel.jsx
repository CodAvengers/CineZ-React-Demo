import React, { useMemo } from "react";
import UiSelect from "../../../components/UiSelect";

const EpisodePanel = ({
  seasons = [],
  selectedSeason,
  onSeasonChange,
  episodes = [],
  selectedEpisode,
  onEpisodeChange,
  episode,
}) => {
  const seasonOptions = useMemo(
    () =>
      seasons.map((season) => ({
        value: season.seasonNumber,
        label: `Season ${season.seasonNumber}`,
      })),
    [seasons]
  );

  const episodeOptions = useMemo(
    () =>
      episodes.map((ep) => ({
        value: ep.episodeNumber,
        label: `${ep.episodeNumber}. ${ep.name}`,
      })),
    [episodes]
  );

  return (
    <section className="details-episode">
      <h2>Episodes</h2>

      <div className="details-episode__controls">
        <div className="details-episode__field">
          <label htmlFor="season-select">Season</label>
          <UiSelect
            id="season-select"
            value={selectedSeason}
            onChange={onSeasonChange}
            options={seasonOptions}
            placeholder="Select season"
          />
        </div>

        {episodes.length > 0 && (
          <div className="details-episode__field">
            <label htmlFor="episode-select">Episode</label>
            <UiSelect
              id="episode-select"
              value={selectedEpisode}
              onChange={onEpisodeChange}
              options={episodeOptions}
              placeholder="Select episode"
            />
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
