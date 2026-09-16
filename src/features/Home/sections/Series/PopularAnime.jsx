import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPopularAnime } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const PopularAnime = () => {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => getPopularAnime({ page })
  );

  return (
    <div className="section-container">
      <Grid
        title="Popular Anime"
        data={data}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(item) => navigate(`/tv/${item.id}`)}
        showPagination={true}
        mediaType="tv"
      />
    </div>
  );
};

export default PopularAnime;