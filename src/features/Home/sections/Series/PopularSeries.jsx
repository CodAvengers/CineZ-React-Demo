import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/Grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const PopularSeries = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularPage, setPopularPage] = useState(1);
  const [totalPopularPages, setTotalPopularPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularTV = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${popularPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setPopular(data.results.slice(0, 7));
        setTotalPopularPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching popular series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTV();
  }, [popularPage]);

  const handleSeriesClick = (series) => {
    navigate(`/tv/${series.id}`);
  };

  return (
    <div className="series-container">
      <Grid
        title="Popular Series"
        data={popular}
        loading={loading}
        currentPage={popularPage}
        totalPages={totalPopularPages}
        onPageChange={(page) => setPopularPage(page)}
        onItemClick={handleSeriesClick}
        showPagination={true}
      />
    </div>
  );
};

export default PopularSeries;
