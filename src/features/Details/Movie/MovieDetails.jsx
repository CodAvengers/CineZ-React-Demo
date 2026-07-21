import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import "./styles/MovieDetails.css";
import { getMovieDetails, movieEmbedUrl, openEmbed } from "../../../api";
import {
  CastList,
  DetailsBackdrop,
  EmbedPlayer,
  useMediaDetails,
} from "../shared";

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movie, loading, error, cast } = useMediaDetails(
    id,
    getMovieDetails,
    { fallbackError: "Movie data not found" }
  );

  const embedUrl = useMemo(() => movieEmbedUrl(id), [id]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details-container">
      <DetailsBackdrop src={movie.backdropUrl} alt={movie.title} />

      <div className="movie-details-content">
        <EmbedPlayer
          className="movie-player"
          src={embedUrl}
          frameKey={id}
          title={`${movie.title} Player`}
        />

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
                onClick={() => openEmbed(embedUrl)}
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

        <CastList cast={cast} className="movie-cast" />
      </div>
    </div>
  );
};

export default MovieDetails;
