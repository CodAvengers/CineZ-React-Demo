import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/banner.css";
import { getHomeBanners } from "../../api";
import { BannerSkeleton } from "../Skeleton";
import "../Skeleton/styles/skeleton.css";

const SLIDE_INTERVAL_MS = 10000;
const FADE_MS = 850;

const BannerHome = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const data = await getHomeBanners({ limit: 10 });
        setBanners(data);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Failed to load banner data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return undefined;

    let cancelled = false;
    const preload = banners.map(
      (banner) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = banner.backdropUrl;
        })
    );

    Promise.all(preload).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [banners]);

  useEffect(() => {
    if (banners.length < 2 || !imagesReady) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [banners, currentIndex, imagesReady]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (loading || (banners.length > 0 && !imagesReady)) {
    return <BannerSkeleton />;
  }

  if (banners.length === 0) return null;

  const current = banners[currentIndex];
  const mediaType = current.mediaType || "movie";

  return (
    <section
      className="banner-section"
      style={{ "--banner-fade-ms": `${FADE_MS}ms` }}
    >
      <div className="banner-slide">
        <div className="banner-images">
          {banners.map((banner, index) => (
            <img
              key={`${banner.mediaType}-${banner.id}`}
              src={banner.backdropUrl}
              alt=""
              aria-hidden={index !== currentIndex}
              className={`banner-image${
                index === currentIndex ? " is-active" : ""
              }`}
            />
          ))}
        </div>
        <div className="banner-overlay" />

        <div className="banner-ui">
          <div className="banner-content" key={`${current.mediaType}-${current.id}`}>
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
      </div>
    </section>
  );
};

export default BannerHome;
