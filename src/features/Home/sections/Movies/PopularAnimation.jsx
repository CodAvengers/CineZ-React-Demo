import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularAnimation } from "../../../../api";

const PopularAnimation = () => {
  const [animation, setAnimation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getPopularAnimation({ page });
        setAnimation(result.items);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching animation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="section-container">
      <Grid
        title="Popular Animation"
        data={animation}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(item) => navigate(`/movie/${item.id}`)}
        showPagination={true}
      />
    </div>
  );
};

export default PopularAnimation;
