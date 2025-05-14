import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TopRatedSeries = () => {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [totalTopRatedPages, setTotalTopRatedPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedTV = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${topRatedPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setTopRated(data.results.slice(0, 7));
        setTotalTopRatedPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching top rated series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedTV();
  }, [topRatedPage]);

  const handleSeriesClick = (series) => {
    navigate(`/tv/${series.id}`);
  };

  return (
    <div className="series-container">
      <Grid
        title="Top Rated Series"
        data={topRated}
        loading={loading}
        currentPage={topRatedPage}
        totalPages={totalTopRatedPages}
        onPageChange={(page) => setTopRatedPage(page)}
        onItemClick={handleSeriesClick}
        showPagination={true}
      />
    </div>
  );
};

export default TopRatedSeries;
