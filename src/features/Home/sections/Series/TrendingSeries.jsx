import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingTv } from "../../../../api";

const TrendingSeries = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPage, setTrendingPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items } = await getTrendingTv({
          page: trendingPage,
          limit: 7,
          window: "week",
        });
        setTrending(items);
      } catch (error) {
        console.error("Error fetching trending series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trendingPage]);

  return (
    <div className="series-container">
      <Grid
        title="Trending Series"
        data={trending}
        loading={loading}
        currentPage={trendingPage}
        totalPages={1}
        onPageChange={setTrendingPage}
        onItemClick={(series) => navigate(`/tv/${series.id}`)}
        showPagination={false}
        mediaType="tv"
      />
    </div>
  );
};

export default TrendingSeries;
