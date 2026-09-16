import React, { useMemo } from "react";
import UiSelect from "../../../components/UiSelect";

const EpisodePanel = ({
  seasons = [],
  selectedSeason,
  onSeasonChange,
  episodes = [],
  selectedEpisode,
  onEpisodeChange,
}) => {
  const seasonOptions = useMemo(
    () =>
      seasons.map((season) => ({
        value: season.seasonNumber,
        label: `Season ${season.seasonNumber}`,
      })),
    [seasons]
  );

  return (
    <section className="details-episode">
      <div className="details-episode__header">
        <span className="details-episode__label">Season</span>
        <UiSelect
          id="season-select"
          value={selectedSeason}
          onChange={onSeasonChange}
          options={seasonOptions}
          placeholder="Select season"
        />
      </div>

      <div className="details-episode__queue">
        {episodes.map((ep) => (
          <div
            key={ep.episodeNumber}
            className={`details-episode__item ${
              ep.episodeNumber === selectedEpisode ? "is-active" : ""
            }`}
            onClick={() => onEpisodeChange(ep.episodeNumber)}
          >
            {ep.stillUrl ? (
              <img
                className="details-episode__thumb"
                src={ep.stillUrl}
                alt={ep.name}
              />
            ) : (
              <div className="details-episode__thumb details-episode__thumb--empty" />
            )}
            <div className="details-episode__item-info">
              <h4>
                {ep.episodeNumber}. {ep.name}
              </h4>
              <p>{ep.overview || "No description available."}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EpisodePanel;