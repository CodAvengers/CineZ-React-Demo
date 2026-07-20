import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/banner.css";
import { getHomeBanners } from "../../api";

const BannerHome = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getHomeBanners({ limit: 10 });
        setBanners(data);
      } catch (error) {
        console.error("Failed to load banner data:", error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return undefined;
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
  const mediaType = current.mediaType || "movie";

  return (
    <section className="banner-section">
      <div className="banner-slide">
        <img
          src={current.backdropUrl}
          alt={current.title}
          className="banner-image"
        />
        <div className="banner-overlay" />
        <div className="banner-content">
          <h2 className="Banner_Title">{current.title}</h2>
          <p>{current.overview}</p>
          <Link to={`/${mediaType}/${current.id}`}>
            <button className="banner_play_button">PLAY NOW</button>
          </Link>
        </div>

        <button
          className="banner-nav-button left"
          onClick={goToPrev}
          aria-label="Previous Banner"
        >
          &#8249;
        </button>

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
