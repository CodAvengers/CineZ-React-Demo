import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TrendingSeries = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPage, setTrendingPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingTV = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?language=en-US&page=${trendingPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setTrending(data.results.slice(0, 7));
      } catch (error) {
        console.error("Error fetching trending series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTV();
  }, [trendingPage]);

  const handleSeriesClick = (series) => {
    navigate(`/tv/${series.id}`);
  };

  return (
    <div className="series-container">
      <Grid
        title="Trending Series"
        data={trending}
        loading={loading}
        currentPage={trendingPage}
        totalPages={1}
        onPageChange={(page) => setTrendingPage(page)}
        onItemClick={handleSeriesClick}
        showPagination={false}
      />
    </div>
  );
};

export default TrendingSeries;
