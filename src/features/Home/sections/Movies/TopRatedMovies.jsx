import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTopRatedMovies } from "../../../../api";

const TopRatedMovies = () => {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [totalTopRatedPages, setTotalTopRatedPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getTopRatedMovies({
          page: topRatedPage,
          limit: 7,
        });
        setTopRated(items);
        setTotalTopRatedPages(totalPages);
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topRatedPage]);

  return (
    <div className="movies-container">
      <Grid
        title="Top Rated Movies"
        data={topRated}
        loading={loading}
        currentPage={topRatedPage}
        totalPages={totalTopRatedPages}
        onPageChange={setTopRatedPage}
        onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
        showPagination={true}
      />
    </div>
  );
};

export default TopRatedMovies;
