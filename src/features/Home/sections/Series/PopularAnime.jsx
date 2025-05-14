import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const PopularAnime = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`
        );
        const data = await response.json();
        setAnime(data.results.slice(0, 7));
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page]);

  const handleItemClick = (item) => {
    navigate(`/tv/${item.id}`);
  };

  return (
    <div className="section-container">
      <Grid
        title="Popular Anime"
        data={anime}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        onItemClick={handleItemClick}
        showPagination={true}
        mediaType="tv" // Important for correct routing
      />
    </div>
  );
};

export default PopularAnime;