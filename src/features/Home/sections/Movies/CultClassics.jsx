import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getCultClassics } from "../../../../api";

const CultClassics = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items } = await getCultClassics({ page, limit: 7 });
        setMovies(items);
      } catch (error) {
        console.error("Error fetching cult classics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="section-container">
      <Grid
        title="Cult Classics"
        data={movies}
        loading={loading}
        currentPage={page}
        onPageChange={setPage}
        onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
        showPagination={true}
      />
    </div>
  );
};

export default CultClassics;
