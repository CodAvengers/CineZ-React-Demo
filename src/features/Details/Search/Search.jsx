import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../../../components/grid";
import "./styles/Search.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("query") || "";
    setQuery(searchQuery);

    if (searchQuery) {
      fetchSearchResults(searchQuery, page);
    }
  }, [location.search, page]);

  const fetchSearchResults = async (searchQuery, pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=${pageNum}&include_adult=false`
      );
      const data = await response.json();
      setResults(
        data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        )
      );
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    navigate(`/${item.media_type}/${item.id}`);
  };

  return (
    <div className="search-page">
      <h1 className="search-page-title">Search Results for "{query}"</h1>

      {results.length > 0 ? (
        <>
          <Grid
            data={results}
            loading={loading}
            onItemClick={handleItemClick}
            mediaType="mixed"
            showViewAll={false}
            showPagination={false}
          />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="no-results">No results found for "{query}"</div>
        )
      )}
    </div>
  );
};

export default Search;
