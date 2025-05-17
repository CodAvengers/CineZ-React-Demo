import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const CultClassics = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCultClassics = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_count.desc&primary_release_date.lte=1999-12-31&vote_average.gte=7&page=${page}`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 7)); // Show first 5
      } catch (error) {
        console.error("Error fetching cult classics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCultClassics();
  }, [page]);

  const handleClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="section-container">
      <Grid
        title="Cult Classics"
        data={movies}
        loading={loading}
        onItemClick={handleClick}
        currentPage={page}
        onPageChange={setPage}
        showPagination={true}
      />
    </div>
  );
};

export default CultClassics;
