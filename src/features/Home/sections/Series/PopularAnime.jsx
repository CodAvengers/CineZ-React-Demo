import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularAnime } from "../../../../api";

const PopularAnime = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getPopularAnime({ page, limit: 7 });
        setAnime(result.items);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching popular anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="section-container">
      <Grid
        title="Popular Anime"
        data={anime}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(item) => navigate(`/tv/${item.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default PopularAnime;
