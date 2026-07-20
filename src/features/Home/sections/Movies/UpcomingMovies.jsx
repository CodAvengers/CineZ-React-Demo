import React, { useEffect, useState } from "react";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        setMovies((data.results || []).slice(0, 7));
      } catch (err) {
        console.error("Failed to fetch upcoming movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <Grid
      title="Coming Soon to Theaters"
      data={movies}
      loading={loading}
    />
  );
};

export default UpcomingMovies;
