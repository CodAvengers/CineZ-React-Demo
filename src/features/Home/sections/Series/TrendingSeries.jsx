import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingTv } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const TrendingSeries = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getTrendingTv({ page, window: "week" })
  );

  return (
    <div className="series-container">
      <Grid
        title="Trending Series"
        data={data}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(series) => navigate(`/tv/${series.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default TrendingSeries;