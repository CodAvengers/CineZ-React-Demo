import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getAiringTodayTv } from "../../../../api";

const AiringTodaySeries = () => {
  const [airing, setAiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airingPage, setAiringPage] = useState(1);
  const [totalAiringPages, setTotalAiringPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { items, totalPages } = await getAiringTodayTv({
          page: airingPage,
          limit: 7,
        });
        setAiring(items);
        setTotalAiringPages(totalPages);
      } catch (error) {
        console.error("Error fetching airing today series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [airingPage]);

  return (
    <div className="series-container">
      <Grid
        title="Airing Today Series"
        data={airing}
        loading={loading}
        currentPage={airingPage}
        totalPages={totalAiringPages}
        onPageChange={setAiringPage}
        onItemClick={(series) => navigate(`/tv/${series.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default AiringTodaySeries;
