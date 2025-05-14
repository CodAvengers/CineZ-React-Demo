import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/Grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const AiringTodaySeries = () => {
  const [airing, setAiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airingPage, setAiringPage] = useState(1);
  const [totalAiringPages, setTotalAiringPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAiringToday = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=${airingPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setAiring(data.results.slice(0, 7));
        setTotalAiringPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching airing today series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAiringToday();
  }, [airingPage]);

  const handleSeriesClick = (series) => {
    navigate(`/tv/${series.id}`);
  };

  return (
    <div className="series-container">
      <Grid
        title="Airing Today"
        data={airing}
        loading={loading}
        currentPage={airingPage}
        totalPages={totalAiringPages}
        onPageChange={(page) => setAiringPage(page)}
        onItemClick={handleSeriesClick}
        showPagination={true}
      />
    </div>
  );
};

export default AiringTodaySeries;
