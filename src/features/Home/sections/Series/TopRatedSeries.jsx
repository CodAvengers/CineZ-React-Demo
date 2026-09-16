import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTopRatedTv } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const TopRatedSeries = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getTopRatedTv({ page })
  );

  return (
    <div className="series-container">
      <Grid
        title="Top Rated Series"
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

export default TopRatedSeries;