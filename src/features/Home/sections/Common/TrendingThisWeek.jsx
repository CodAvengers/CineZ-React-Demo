import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingThisWeek } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const TrendingThisWeek = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getTrendingThisWeek({ page })
  );

  return (
    <div className="section-container">
      <Grid
        title="Trending This Week"
        data={data}
        loading={loading}
        error={error}
        onItemClick={(item) =>
          navigate(`/${item.mediaType === "movie" ? "movie" : "tv"}/${item.id}`)
        }
        mediaType="mixed"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showPagination={true}
      />
    </div>
  );
};

export default TrendingThisWeek;