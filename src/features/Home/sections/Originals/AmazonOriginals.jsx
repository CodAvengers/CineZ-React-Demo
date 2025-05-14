import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/Grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const AmazonOriginals = ({ mediaType = "tv" }) => {
  const [originals, setOriginals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmazonOriginals = async () => {
      setLoading(true);
      try {
        const endpoint =
          mediaType === "movie"
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=9&watch_region=US&sort_by=popularity.desc&page=${page}`
            : `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=1024&sort_by=popularity.desc&page=${page}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        setOriginals(data.results.slice(0, 7));
      } catch (error) {
        console.error("Error fetching Amazon originals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmazonOriginals();
  }, [page, mediaType]);

  const handleClick = (item) => {
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div className="section-container">
      <Grid
        title={`Amazon Originals (${
          mediaType === "movie" ? "Movies" : "TV Shows"
        })`}
        data={originals}
        loading={loading}
        onItemClick={handleClick}
        currentPage={page}
        onPageChange={setPage}
        showPagination={true}
        mediaType={mediaType}
      />
    </div>
  );
};

export default AmazonOriginals;
