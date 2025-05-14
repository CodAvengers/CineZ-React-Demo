import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TrendingThisWeek = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setTrending(data.results.slice(0, 7)); // Show first 10
      } catch (error) {
        console.error("Error fetching trending content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleClick = (item) => {
    const route = item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
    navigate(route);
  };

  return (
    <div className="section-container">
      <Grid
        title="Trending This Week"
        data={trending}
        loading={loading}
        onItemClick={handleClick}
        mediaType="mixed" // Special handling for mixed content
      />
    </div>
  );
};

export default TrendingThisWeek;