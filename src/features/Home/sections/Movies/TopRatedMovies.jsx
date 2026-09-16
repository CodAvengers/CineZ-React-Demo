import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getTopRatedMovies } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const TopRatedMovies = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getTopRatedMovies({ page })
  );

  return (
    <div className="movies-container">
      <Grid
        title="Top Rated Movies"
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

export default TopRatedMovies;