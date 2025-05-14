import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/banner.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BannerHome = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const apiKey = TMDB_API_KEY;
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`
        );

        const movieData = await movieRes.json();
        const tvData = await tvRes.json();

        const movies = movieData.results
          .filter((m) => m.backdrop_path)
          .map((m) => ({
            ...m,
            displayTitle: m.title,
            media_type: "movie",
          }));

        const tvShows = tvData.results
          .filter((tv) => tv.backdrop_path)
          .map((tv) => ({
            ...tv,
            displayTitle: tv.name,
            media_type: "tv",
          }));

        // Interleave movie and TV entries
        const interleaved = [];
        const maxLength = Math.max(movies.length, tvShows.length);
        for (let i = 0; i < maxLength && interleaved.length < 10; i++) {
          if (i < movies.length) interleaved.push(movies[i]);
          if (i < tvShows.length) interleaved.push(tvShows[i]);
        }

        setBanners(interleaved);
      } catch (error) {
        console.error("Failed to load banner data:", error);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (banners.length === 0) return null;

  const current = banners[currentIndex];
  const mediaType = current.media_type || (current.title ? "movie" : "tv");

  return (
    <section className="banner-section">
      <div className="banner-slide">
        <img
          src={`https://image.tmdb.org/t/p/original${current.backdrop_path}`}
          alt={current.title || current.name}
          className="banner-image"
        />
        <div className="banner-overlay" />
        <div className="banner-content">
          <h2 className="Banner_Title">{current.title || current.name}</h2> 
          <p>{current.overview}</p>
          <Link to={`/${mediaType}/${current.id}`}>
            <button className="banner_play_button">PLAY NOW</button>
          </Link>
        </div>

        {/* Left Arrow */}
        <button
          className="banner-nav-button left"
          onClick={goToPrev}
          aria-label="Previous Banner"
        >
          &#8249;
        </button>

        {/* Right Arrow */}
        <button
          className="banner-nav-button right"
          onClick={goToNext}
          aria-label="Next Banner"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default BannerHome;
