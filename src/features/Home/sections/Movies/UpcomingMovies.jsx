import React, { useEffect, useState } from "react";
import Grid from "../../../../components/grid";
import { getUpcomingMovies } from "../../../../api";

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const { items } = await getUpcomingMovies();
        setMovies(items);
      } catch (err) {
        console.error("Failed to fetch upcoming movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <Grid title="Coming Soon to Theaters" data={movies} loading={loading} />
  );
};

export default UpcomingMovies;
