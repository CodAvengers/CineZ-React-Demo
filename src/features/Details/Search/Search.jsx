import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../../../components/grid";
import "./styles/Search.css";
import { searchMulti } from "../../../api";

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
      const data = await searchMulti({ query: searchQuery, page: pageNum });
      setResults(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    navigate(`/${item.mediaType}/${item.id}`);
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
            singleRow={false}
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
