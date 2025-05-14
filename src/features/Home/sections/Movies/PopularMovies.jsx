import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const PopularMovies = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularPage, setPopularPage] = useState(1);
  const [totalPopularPages, setTotalPopularPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${popularPage}&api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        setPopular(data.results.slice(0, 7));
        setTotalPopularPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, [popularPage]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movies-container">
      <Grid
        title="Popular Movies"
        data={popular}
        loading={loading}
        currentPage={popularPage}
        totalPages={totalPopularPages}
        onPageChange={(page) => setPopularPage(page)}
        onItemClick={handleMovieClick}
        showPagination={true}
      />
    </div>
  );
};

export default PopularMovies;
