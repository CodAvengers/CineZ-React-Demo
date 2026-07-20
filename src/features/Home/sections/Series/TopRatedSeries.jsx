import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTopRatedTv } from "../../../../api";

const TopRatedSeries = () => {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [totalTopRatedPages, setTotalTopRatedPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getTopRatedTv({
          page: topRatedPage,
          limit: 7,
        });
        setTopRated(items);
        setTotalTopRatedPages(totalPages);
      } catch (error) {
        console.error("Error fetching top rated series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topRatedPage]);

  return (
    <div className="series-container">
      <Grid
        title="Top Rated Series"
        data={topRated}
        loading={loading}
        currentPage={topRatedPage}
        totalPages={totalTopRatedPages}
        onPageChange={setTopRatedPage}
        onItemClick={(series) => navigate(`/tv/${series.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default TopRatedSeries;
