import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/TVDetails.css";
import { getTvDetails, openEmbed, tvEmbedUrl } from "../../../api";
import {
  CastList,
  DetailsBackdrop,
  EmbedPlayer,
  useMediaDetails,
  useTvSeasonEpisodes,
} from "../shared";

const TVDetails = () => {
  const { id } = useParams();
  const { data: series, loading, error, cast } = useMediaDetails(
    id,
    getTvDetails,
    { fallbackError: "TMDB data not found" }
  );

  const seasons = series?.seasons || [];
  const [seasonOverride, setSeasonOverride] = useState(null);

  useEffect(() => {
    setSeasonOverride(null);
  }, [id]);

  const selectedSeason = seasonOverride ?? seasons[0]?.seasonNumber ?? null;
  const setSelectedSeason = setSeasonOverride;

  const { episodes, selectedEpisode, setSelectedEpisode } = useTvSeasonEpisodes(
    id,
    selectedSeason,
    Boolean(series && selectedSeason)
  );

  const embedUrl = useMemo(
    () => tvEmbedUrl(id, selectedSeason, selectedEpisode),
    [id, selectedSeason, selectedEpisode]
  );

  const frameKey = `${id}-${selectedSeason}-${selectedEpisode}`;

  const selectedEpisodeData = episodes.find(
    (ep) => ep.episodeNumber === selectedEpisode
  );

  if (loading) return <div className="loading">Loading series details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!series) return <div className="error">Series not found</div>;

  return (
    <div className="tv-details-container">
      <DetailsBackdrop src={series.backdropUrl} alt={series.title} />

      <div className="series-content">
        <EmbedPlayer
          className="series-player"
          src={embedUrl}
          frameKey={frameKey}
          title={`${series.title} Player`}
        />

        <div className="series-header">
          {series.posterUrl && (
            <div className="series-poster">
              <img src={series.posterUrl} alt={series.title} />
            </div>
          )}

          <div className="series-meta">
            <h1>{series.title}</h1>

            <div className="meta-row">
              <span>{series.firstAirDate?.split("-")[0]}</span>
              {series.episodeRuntime && <span>{series.episodeRuntime}m</span>}
              {series.genres && <span>{series.genres}</span>}
              <span>{series.status}</span>
            </div>

            <div className="rating">⭐ {series.rating?.toFixed(1)}/10</div>

            {series.creator && (
              <div className="creator">
                <strong>Creator(s):</strong> {series.creator}
              </div>
            )}

            <div className="seasons-info">
              <strong>Seasons:</strong> {series.seasonCount}
              <strong>Episodes:</strong> {series.episodeCount}
            </div>

            <div className="episode-selector">
              <div className="selector-group">
                <label htmlFor="season-select">Season:</label>
                <select
                  id="season-select"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                  {seasons.map((season) => (
                    <option
                      key={season.seasonNumber}
                      value={season.seasonNumber}
                    >
                      Season {season.seasonNumber}
                    </option>
                  ))}
                </select>
              </div>

              {episodes.length > 0 && (
                <div className="selector-group">
                  <label htmlFor="episode-select">Episode:</label>
                  <select
                    id="episode-select"
                    value={selectedEpisode}
                    onChange={(e) =>
                      setSelectedEpisode(Number(e.target.value))
                    }
                  >
                    {episodes.map((episode) => (
                      <option
                        key={episode.episodeNumber}
                        value={episode.episodeNumber}
                      >
                        {episode.episodeNumber}. {episode.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {embedUrl && (
              <button
                className="play-button"
                onClick={() => openEmbed(embedUrl)}
              >
                ▶ Play Episode {selectedEpisode}
              </button>
            )}
          </div>
        </div>

        <div className="series-overview">
          <h2>Overview</h2>
          <p>{series.overview || "No overview available."}</p>
        </div>

        {selectedEpisodeData && (
          <div className="episode-details">
            <h3>
              S{selectedSeason}E{selectedEpisode}: {selectedEpisodeData.name}
            </h3>
            <p>{selectedEpisodeData.overview || "No description available."}</p>
            {selectedEpisodeData.stillUrl && (
              <img
                src={selectedEpisodeData.stillUrl}
                alt={`S${selectedSeason}E${selectedEpisode}`}
                className="episode-image"
              />
            )}
          </div>
        )}

        <CastList cast={cast} className="series-cast" />
      </div>
    </div>
  );
};

export default TVDetails;
