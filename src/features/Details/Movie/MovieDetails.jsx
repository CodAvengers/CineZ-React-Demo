import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./styles/MovieDetails.css";
import { getMovieDetails, movieEmbedUrl, PLAYBACK_BASE_URL } from "../../../api";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        setMovie(null);
        setCast([]);

        const data = await getMovieDetails(id);
        if (cancelled) return;

        setMovie(data);
        setCast(data.cast || []);
      } catch (err) {
        if (cancelled) return;
        console.error("Error:", err);
        setError(err.message || "Movie data not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const embedUrl = useMemo(() => {
    if (!id || !PLAYBACK_BASE_URL) return "";
    return movieEmbedUrl(id, {
      primaryColor: "ff0000",
      secondaryColor: "a2a2a2",
      iconColor: "ffebeb",
    });
  }, [id]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details-container">
      {movie.backdropUrl && (
        <div className="backdrop-image">
          <img src={movie.backdropUrl} alt={movie.title} />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="movie-details-content">
        <div className="movie-player">
          {!embedUrl ? (
            <div className="player-error">
              Playback is unavailable. Check that{" "}
              <code>VITE_PLAYBACK_BASE_URL</code> is set in your <code>.env</code>
              .
            </div>
          ) : (
            <iframe
              key={id}
              src={embedUrl}
              title={`${movie.title} Player`}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              referrerPolicy="origin"
            />
          )}
        </div>

        <div className="movie-details-header">
          {movie.posterUrl ? (
            <div className="movie-details-poster">
              <img src={movie.posterUrl} alt={movie.title} />
            </div>
          ) : (
            <div className="movie-details-poster-placeholder">🎬</div>
          )}

          <div className="movie-details-meta">
            <h1>{movie.title}</h1>

            <div className="movie-details-meta-row">
              <span>{movie.releaseDate?.split("-")[0]}</span>
              {movie.runtime && (
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.genres && <span>{movie.genres}</span>}
            </div>

            <div className="movie-details-rating">
              ⭐ {movie.rating?.toFixed(1)}/10
            </div>

            {movie.director && (
              <div className="director">
                <strong>Director:</strong> {movie.director}
              </div>
            )}

            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="financial-info">
                {movie.budget > 0 && (
                  <div>
                    <strong>Budget:</strong> ${movie.budget.toLocaleString()}
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {embedUrl && (
              <button
                className="play-button"
                onClick={() => window.open(embedUrl, "_blank", "noopener,noreferrer")}
              >
                ▶ Play Movie
              </button>
            )}
          </div>
        </div>

        <div className="movie-details-overview">
          <h2>Overview</h2>
          <p>{movie.overview || "No overview available."}</p>
        </div>

        {cast.length > 0 && (
          <div className="movie-cast">
            <h2>Cast</h2>
            <div className="cast-grid">
              {cast.map((person, index) => (
                <div key={`${person.name}-${index}`} className="cast-member">
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

export default MovieDetails;
