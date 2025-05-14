import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/MovieDetails.css"; // Import your CSS file for styling

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        );

        if (!tmdbResponse.ok) throw new Error("TMDB data not found");

        const tmdbData = await tmdbResponse.json(); 

        setMovie({
          title: tmdbData.title,
          overview: tmdbData.overview,
          posterUrl: tmdbData.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
            : null,
          backdropUrl: tmdbData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
            : null,
          rating: tmdbData.vote_average,
          releaseDate: tmdbData.release_date,
          runtime: tmdbData.runtime,
          genres: tmdbData.genres?.map((g) => g.name).join(", "),
          director: tmdbData.credits?.crew.find(
            (person) => person.job === "Director"
          )?.name,
          budget: tmdbData.budget,
          revenue: tmdbData.revenue,
          embedUrl: `https://vidlink.pro/movie/${tmdbData.id}`,
        });

        setCast(
          tmdbData.credits?.cast.slice(0, 9).map((person) => ({
            name: person.name,
            character: person.character,
            profileUrl: person.profile_path
              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
              : null,
          })) || []
        );

        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const getEmbedUrl = () => { 
    if (!movie) return '';
    return `https://vidlink.pro/movie/${id}?primaryColor=ff0000&secondaryColor=a2a2a2&iconColor=ffebeb`;
  };

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details-container">
      {/* Backdrop Image */}
      {movie.backdropUrl && (
        <div className="backdrop-image">
          <img src={movie.backdropUrl} alt={movie.title} />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="movie-details-content">
        {/* Embed Player */}
        <div className="movie-player">
          {embedError ? (
            <div className="embed-error">
              Failed to load player. Please try again later.
            </div>
          ) : (
            <iframe
              src={getEmbedUrl()}
              frameBorder="0"
              allowFullScreen
              title={`${movie.title} Player`}
              onError={() => setEmbedError(true)}
            ></iframe>
          )}
        </div>

        {/* Movie Header - Poster and Info */}
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

            <button 
              className="play-button"
              onClick={() => window.open(getEmbedUrl(), '_blank')}
            >
              ▶ Play Movie
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="movie-details-overview">
          <h2>Overview</h2>
          <p>{movie.overview || "No overview available."}</p>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="movie-cast">
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

export default MovieDetails;