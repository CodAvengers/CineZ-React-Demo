import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/TVDetails.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      setEpisodes(data.episodes || []);
      if (data.episodes?.length > 0) {
        setSelectedEpisode(1); // Reset to first episode when season changes
      }
    } catch (err) {
      console.error('Error fetching episodes:', err);
      setEpisodes([]);
    }
  };

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        
        // Fetch series details from TMDB
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,content_ratings`
        );
        
        if (!tmdbResponse.ok) throw new Error('TMDB data not found');
        
        const tmdbData = await tmdbResponse.json();
        
        setSeries({
          title: tmdbData.name,
          overview: tmdbData.overview,
          posterUrl: tmdbData.poster_path 
            ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
            : null,
          backdropUrl: tmdbData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
            : null,
          rating: tmdbData.vote_average,
          firstAirDate: tmdbData.first_air_date,
          lastAirDate: tmdbData.last_air_date,
          genres: tmdbData.genres?.map(g => g.name).join(', '),
          creator: tmdbData.created_by?.map(c => c.name).join(', '),
          episodeRuntime: tmdbData.episode_run_time?.[0],
          seasons: tmdbData.number_of_seasons,
          episodes: tmdbData.number_of_episodes,
          status: tmdbData.status,
        });

        // Get top 5 cast members
        setCast(
          tmdbData.credits?.cast
            .slice(0, 6)
            .map(person => ({
              name: person.name,
              character: person.character,
              profileUrl: person.profile_path
                ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                : null
            })) || []
        );

        // Prepare seasons data
        if (tmdbData.seasons) {
          const filteredSeasons = tmdbData.seasons.filter(s => s.season_number > 0);
          setSeasons(filteredSeasons);
          
          // Load episodes for first season by default
          if (filteredSeasons.length > 0) {
            await fetchEpisodes(filteredSeasons[0].season_number);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id]);

  useEffect(() => {
    if (selectedSeason > 0) {
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
    if (!id || !selectedSeason || !selectedEpisode) return '';
    return `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`;
  };

  if (loading) return <div className="loading">Loading series details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!series) return <div className="error">Series not found</div>;

  return (
    <div className="tv-details-container">
      {/* Backdrop Image */}
      {series.backdropUrl && (
        <div className="backdrop-image">
          <img src={series.backdropUrl} alt={series.title} />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="series-content">
        {/* Embed Player */}
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

        {/* Series Info */}
        <div className="series-header">
          {series.posterUrl && (
            <div className="series-poster">
              <img src={series.posterUrl} alt={series.title} />
            </div>
          )}

          <div className="series-meta">
            <h1>{series.title}</h1>
            
            <div className="meta-row">
              <span>{series.firstAirDate?.split('-')[0]}</span>
              {series.episodeRuntime && <span>{series.episodeRuntime}m</span>}
              {series.genres && <span>{series.genres}</span>}
              <span>{series.status}</span>
            </div>

            <div className="rating">
              ⭐ {series.rating?.toFixed(1)}/10
            </div>

            {series.creator && (
              <div className="creator">
                <strong>Creator(s):</strong> {series.creator}
              </div>
            )}

            <div className="seasons-info">
              <strong>Seasons:</strong> {series.seasons}
              <strong>Episodes:</strong> {series.episodes}
            </div>

            {/* Season and Episode Selector */}
            <div className="episode-selector">
              <div className="selector-group">
                <label htmlFor="season-select">Season:</label>
                <select
                  id="season-select"
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                >
                  {seasons.map(season => (
                    <option key={season.season_number} value={season.season_number}>
                      Season {season.season_number}
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
                    onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                  >
                    {episodes.map(episode => (
                      <option key={episode.episode_number} value={episode.episode_number}>
                        {episode.episode_number}. {episode.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button 
              className="play-button"
              onClick={() => window.open(getEmbedUrl(), '_blank')}
            >
              ▶ Play Episode {selectedEpisode}
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="series-overview">
          <h2>Overview</h2>
          <p>{series.overview || 'No overview available.'}</p>
        </div>

        {/* Selected Episode Details */}
        {episodes.length > 0 && episodes[selectedEpisode - 1] && (
          <div className="episode-details">
            <h3>
              S{selectedSeason}E{selectedEpisode}: {episodes[selectedEpisode - 1].name}
            </h3>
            <p>{episodes[selectedEpisode - 1].overview || 'No description available.'}</p>
            {episodes[selectedEpisode - 1].still_path && (
              <img 
                src={`https://image.tmdb.org/t/p/w400${episodes[selectedEpisode - 1].still_path}`} 
                alt={`S${selectedSeason}E${selectedEpisode}`}
                className="episode-image"
              />
            )}
          </div>
        )}

        {/* Cast */}
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