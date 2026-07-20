import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingMovies } from "../../../../api";

const TrendingMovies = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPage, setTrendingPage] = useState(1);
  const [totalTrendingPages, setTotalTrendingPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getTrendingMovies({
          page: trendingPage,
          limit: 7,
        });
        setTrending(items);
        setTotalTrendingPages(totalPages);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trendingPage]);

  return (
    <div className="movies-container">
      <Grid
        title="Trending Movies"
        data={trending}
        loading={loading}
        currentPage={trendingPage}
        totalPages={totalTrendingPages}
        onPageChange={setTrendingPage}
        onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
        showPagination={false}
      />
    </div>
  );
};

export default TrendingMovies;
