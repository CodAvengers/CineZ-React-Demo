import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularTv } from "../../../../api";

const PopularSeries = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularPage, setPopularPage] = useState(1);
  const [totalPopularPages, setTotalPopularPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getPopularTv({
          page: popularPage,
        });
        setPopular(items);
        setTotalPopularPages(totalPages);
      } catch (error) {
        console.error("Error fetching popular series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [popularPage]);

  return (
    <div className="series-container">
      <Grid
        title="Popular Series"
        data={popular}
        loading={loading}
        currentPage={popularPage}
        totalPages={totalPopularPages}
        onPageChange={setPopularPage}
        onItemClick={(series) => navigate(`/tv/${series.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default PopularSeries;
