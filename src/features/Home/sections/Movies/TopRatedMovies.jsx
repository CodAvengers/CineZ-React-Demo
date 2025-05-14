import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TopRatedMovies = () => {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [totalTopRatedPages, setTotalTopRatedPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${topRatedPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setTopRated(data.results.slice(0, 7));
        setTotalTopRatedPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, [topRatedPage]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movies-container">
      <Grid
        title="Top Rated Movies"
        data={topRated}
        loading={loading}
        currentPage={topRatedPage}
        totalPages={totalTopRatedPages}
        onPageChange={(page) => setTopRatedPage(page)}
        onItemClick={handleMovieClick}
        showPagination={true}
      />
    </div>
  );
};

export default TopRatedMovies;
