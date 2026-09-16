import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularAnimation } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const PopularAnimation = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getPopularAnimation({ page })
  );

  return (
    <div className="section-container">
      <Grid
        title="Popular Animation"
        data={data}
        loading={loading}
        error={error}
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