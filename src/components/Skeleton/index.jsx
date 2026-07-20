import React from "react";
import "./styles/skeleton.css";

export function Skeleton({ className = "", style }) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}

export function BannerSkeleton() {
  return (
    <section className="banner-section banner-section--skeleton" aria-busy="true">
      <div className="banner-slide">
        <div className="skeleton skeleton--banner-image" />
        <div className="banner-ui">
          <div className="banner-content banner-content--skeleton">
            <Skeleton className="skeleton--banner-title" />
            <Skeleton className="skeleton--banner-line" />
            <Skeleton className="skeleton--banner-line skeleton--banner-line-short" />
            <Skeleton className="skeleton--banner-button" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="movie-card movie-card--skeleton" aria-hidden="true">
      <div className="movie-poster">
        <Skeleton className="skeleton--fill" />
      </div>
      <div className="movie-info">
        <Skeleton className="skeleton--title" />
        <Skeleton className="skeleton--rating" />
      </div>
    </div>
  );
}

export function MovieRowSkeleton({ count = 6 }) {
  return (
    <div
      className="movies-grid movies-grid--single-row"
      style={{ "--items-per-row": count }}
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GenreCardSkeleton() {
  return (
    <div className="genre-card genre-card--skeleton" aria-hidden="true">
      <div className="genre-collage genre-collage--skeleton">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="skeleton--fill" />
        ))}
      </div>
      <div className="genre-info">
        <Skeleton className="skeleton--genre-title" />
      </div>
    </div>
  );
}

export function GenreRowSkeleton({ count = 7 }) {
  return (
    <div
      className="genres-grid"
      style={{ "--items-per-row": count }}
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <GenreCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
