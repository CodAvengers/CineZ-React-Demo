import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/TVDetails.css";
import { getTvDetails, getTvSeason, tvEmbedUrl } from "../../../api";

const TVDetails = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [embedError, setEmbedError] = useState(false);

  const fetchEpisodes = async (seasonNumber) => {
    try {
      const data = await getTvSeason(id, seasonNumber);
      setEpisodes(data.episodes || []);
      if (data.episodes?.length > 0) {
        setSelectedEpisode(1);
      }
    } catch (err) {
      console.error("Error fetching episodes:", err);
      setEpisodes([]);
    }
  };

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        const data = await getTvDetails(id);
        setSeries(data);
        setCast(data.cast || []);
        setSeasons(data.seasons || []);

        if (data.seasons?.length > 0) {
          const firstSeason = data.seasons[0].seasonNumber;
          setSelectedSeason(firstSeason);
          await fetchEpisodes(firstSeason);
        }

        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "TMDB data not found");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id]);

  useEffect(() => {
    if (selectedSeason > 0 && series) {
      fetchEpisodes(selectedSeason);
    }
  }, [selectedSeason]);

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setEmbedError(false);
  };

  const handleEpisodeChange = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    setEmbedError(false);
  };

  const getEmbedUrl = () => {
    if (!id || !selectedSeason || !selectedEpisode) return "";
    return tvEmbedUrl(id, selectedSeason, selectedEpisode);
  };

  const selectedEpisodeData = episodes.find(
    (ep) => ep.episodeNumber === selectedEpisode
  );

  if (loading) return <div className="loading">Loading series details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!series) return <div className="error">Series not found</div>;

  return (
    <div className="tv-details-container">
      {series.backdropUrl && (
        <div className="backdrop-image">
          <img src={series.backdropUrl} alt={series.title} />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="series-content">
        <div className="series-player">
          {embedError ? (
            <div className="embed-error">
              Failed to load player. Please try another episode.
            </div>
          ) : (
            <iframe
              src={getEmbedUrl()}
              frameBorder="0"
              allowFullScreen
              title={`${series.title} Player`}
              onError={() => setEmbedError(true)}
            ></iframe>
          )}
        </div>

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
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
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
                      handleEpisodeChange(Number(e.target.value))
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

            <button
              className="play-button"
              onClick={() => window.open(getEmbedUrl(), "_blank")}
            >
              ▶ Play Episode {selectedEpisode}
            </button>
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

        {cast.length > 0 && (
          <div className="series-cast">
            <h2>Cast</h2>
            <div className="cast-grid">
              {cast.map((person, index) => (
                <div key={index} className="cast-member">
                  {person.profileUrl ? (
                    <img src={person.profileUrl} alt={person.name} />
                  ) : (
                    <div className="cast-placeholder"></div>
                  )}
                  <div className="cast-info">
                    <strong>{person.name}</strong>
                    <span>{person.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVDetails;
