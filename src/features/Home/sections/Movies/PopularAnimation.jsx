import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const PopularAnimation = () => {
  const [animation, setAnimation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimation = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc&page=${page}`
        );
        const data = await response.json();
        setAnimation(data.results.slice(0, 7));
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching animation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimation();
  }, [page]);

  const handleItemClick = (item) => {
    navigate(`/movie/${item.id}`);
  };

  return (
    <div className="section-container">
      <Grid
        title="Popular Animation"
        data={animation}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        onItemClick={handleItemClick}
        showPagination={true}
      />
    </div>
  );
};

export default PopularAnimation;
