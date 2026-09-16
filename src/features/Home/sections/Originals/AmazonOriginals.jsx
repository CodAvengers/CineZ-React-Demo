import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPlatformMovies, getPlatformTv } from "../../../../api";
import { useSectionData } from "../../../../hooks/useSectionData";

const AmazonOriginals = ({ mediaType = "tv" }) => {
  const navigate = useNavigate();
  const fetcher = mediaType === "movie" ? getPlatformMovies : getPlatformTv;
  const { data, loading, error, page, setPage, totalPages } = useSectionData(
    (page) => fetcher("amazon", { page }),
    [mediaType]
  );

  return (
    <div className="section-container">
      <Grid
        title={`Amazon Originals (${
          mediaType === "movie" ? "Movies" : "TV Shows"
        })`}
        data={data}
        loading={loading}
        error={error}
        onItemClick={(item) => navigate(`/${mediaType}/${item.id}`)}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showPagination={true}
        mediaType={mediaType}
      />
    </div>
  );
};

export default AmazonOriginals;