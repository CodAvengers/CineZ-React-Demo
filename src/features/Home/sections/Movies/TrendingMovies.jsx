import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTrendingMovies } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const TrendingMovies = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getTrendingMovies({ page })
  );

  return (
    <div className="movies-container">
      <Grid
        title="Trending Movies"
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

export default TrendingMovies;