import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";
import { getPlatformMovies, getPlatformTv } from "../../../../api";

const AppleTVOriginals = ({ mediaType = "tv" }) => {
  const [originals, setOriginals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetcher =
          mediaType === "movie" ? getPlatformMovies : getPlatformTv;
        const { items } = await fetcher("apple", { page, limit: 7 });
        setOriginals(items);
      } catch (error) {
        console.error("Error fetching Apple originals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, mediaType]);

  return (
    <div className="section-container">
      <Grid
        title={`Apple Originals (${
          mediaType === "movie" ? "Movies" : "TV Shows"
        })`}
        data={originals}
        loading={loading}
        onItemClick={(item) => navigate(`/${mediaType}/${item.id}`)}
        currentPage={page}
        onPageChange={setPage}
        showPagination={true}
        mediaType={mediaType}
      />
    </div>
  );
};

export default AppleTVOriginals;
