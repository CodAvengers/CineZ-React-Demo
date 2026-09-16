import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularMovies } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const PopularMovies = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getPopularMovies({ page })
  );

  return (
    <div className="movies-container">
      <Grid
        title="Popular Movies"
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

export default PopularMovies;