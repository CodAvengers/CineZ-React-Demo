import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularMovies } from "../../../../api";

const PopularMovies = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularPage, setPopularPage] = useState(1);
  const [totalPopularPages, setTotalPopularPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getPopularMovies({
          page: popularPage,
        });
        setPopular(items);
        setTotalPopularPages(totalPages);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [popularPage]);

  return (
    <div className="movies-container">
      <Grid
        title="Popular Movies"
        data={popular}
        loading={loading}
        currentPage={popularPage}
        totalPages={totalPopularPages}
        onPageChange={setPopularPage}
        onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
        showPagination={true}
      />
    </div>
  );
};

export default PopularMovies;
