import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "../../components/grid";
import "./styles/ViewAllPage.css";
import { getCatalogSection } from "../../api";

const ViewAllPage = () => {
  const { section } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState("View All");
  const [mediaType, setMediaType] = useState("movie");
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [section]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCatalogSection(section, { page });
        if (!result) {
          console.error("Invalid section:", section);
          return navigate("/not-found", { replace: true });
        }

        setData(result.items);
        setTotalPages(result.totalPages);
        setTitle(result.title);
        setMediaType(result.mediaType);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section, page, navigate]);

  const handleItemClick = (item) => {
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div className="view-all-wrapper">
      <h1 className="section-title">{title}</h1>

      <Grid
        data={data}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={handleItemClick}
        showViewAll={false}
        showPagination={false}
        singleRow={false}
        mediaType={mediaType}
      />

      {totalPages > 1 && (
        <ul className="pagination-view-all">
          <li>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="pagination-button prev-next"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pagination-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          <li>
            <button className="pagination-button-active" disabled>
              {page}
            </button>
          </li>

          <li>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="pagination-button prev-next"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pagination-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ViewAllPage;
