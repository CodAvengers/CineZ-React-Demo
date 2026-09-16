import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getUpcomingMovies } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const UpcomingMovies = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getUpcomingMovies({ page })
  );

  return (
    <Grid
      title="Coming Soon to Theaters"
      data={data}
      loading={loading}
      error={error}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      onItemClick={(movie) => navigate(`/movie/${movie.id}`)}
      showPagination={true}
    />
  );
};

export default UpcomingMovies;