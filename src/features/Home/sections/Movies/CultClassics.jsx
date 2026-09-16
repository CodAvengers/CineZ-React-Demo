import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getCultClassics } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const CultClassics = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getCultClassics({ page })
  );

  return (
    <div className="section-container">
      <Grid
        title="Cult Classics"
        data={data}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
        showPagination={true}
      />
    </div>
  );
};

export default CultClassics;