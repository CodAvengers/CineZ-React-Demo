import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/Grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TrendingMovies = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPage, setTrendingPage] = useState(1);
  const [totalTrendingPages, setTotalTrendingPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${trendingPage}&api_key=${TMDB_API_KEY}`
        );

        const data = await response.json();
        setTrending(data.results.slice(0, 7)); // Only take 5 movies
        setTotalTrendingPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [trendingPage]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movies-container">
      <Grid
        title="Trending Movies"
        data={trending}
        loading={loading}
        currentPage={trendingPage}
        totalPages={totalTrendingPages}
        onPageChange={(page) => setTrendingPage(page)}
        onItemClick={handleMovieClick}
        showPagination={false}
      />
    </div>
  );
};

export default TrendingMovies;
