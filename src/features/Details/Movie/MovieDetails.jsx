import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, movieEmbedUrl } from "../../../api";
import {
  CastList,
  DetailsHero,
  DetailsPageSkeleton,
  DetailsSection,
  DetailsShell,
  EmbedPlayer,
  useMediaDetails,
} from "../shared";

function formatRuntime(runtime) {
  if (!runtime) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movie, loading, error, cast } = useMediaDetails(
    id,
    getMovieDetails,
    { fallbackError: "Movie data not found" }
  );

  const embedUrl = useMemo(() => movieEmbedUrl(id), [id]);

  if (loading) return <DetailsPageSkeleton />;
  if (error) {
    return (
      <DetailsShell>
        <div className="details-status details-status--error">Error: {error}</div>
      </DetailsShell>
    );
  }
  if (!movie) {
    return (
      <DetailsShell>
        <div className="details-status details-status--error">Movie not found</div>
      </DetailsShell>
    );
  }

  const extras = [];
  if (movie.budget > 0) {
    extras.push({ label: "Budget", value: `$${movie.budget.toLocaleString()}` });
  }
  if (movie.revenue > 0) {
    extras.push({
      label: "Revenue",
      value: `$${movie.revenue.toLocaleString()}`,
    });
  }

  return (
    <DetailsShell backdropUrl={movie.backdropUrl} backdropAlt={movie.title}>
      <DetailsHero
        title={movie.title}
        meta={[
          movie.releaseDate?.split("-")[0],
          formatRuntime(movie.runtime),
          movie.genres,
        ]}
        rating={movie.rating}
        credit={
          movie.director ? (
            <>
              <strong>Director</strong> {movie.director}
            </>
          ) : null
        }
      />

      <div className="details-player-wrap">
        <EmbedPlayer
          src={embedUrl}
          frameKey={id}
          title={`${movie.title} Player`}
        />
      </div>

      <DetailsSection title="Overview">
        <p>{movie.overview || "No overview available."}</p>
      </DetailsSection>

      <CastList cast={cast} />

      {extras.length > 0 && (
        <ul className="details-extras">
          {extras.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              {item.value}
            </li>
          ))}
        </ul>
      )}
    </DetailsShell>
  );
};

export default MovieDetails;
