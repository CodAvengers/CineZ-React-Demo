import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../../../../components/grid";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const NetflixOriginals = ({ mediaType = "tv" }) => {
  const [originals, setOriginals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNetflixOriginals = async () => {
      setLoading(true);
      try {
        const endpoint =
          mediaType === "movie"
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=8&watch_region=US&sort_by=popularity.desc&page=${page}`
            : `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&sort_by=popularity.desc&page=${page}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        setOriginals(data.results.slice(0, 7)); // Show first 7
      } catch (error) {
        console.error("Error fetching Netflix originals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetflixOriginals();
  }, [page, mediaType]);

  const handleClick = (item) => {
    navigate(`/view-all/netflix-originals-${mediaType}`, {
      state: {
        title: `Netflix Originals (${
          mediaType === "movie" ? "Movies" : "TV Shows"
        })`,
      },
    });
  };
  return (
    <div className="section-container">
      <Grid
        title={`Netflix Originals (${
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

export default NetflixOriginals;
