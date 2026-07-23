import React from "react";

function ChevronLeft() {
  return (
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
  );
}

function ChevronRight() {
  return (
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
  );
}

export default function GridPagination({
  page,
  pageCount,
  maxPage,
  locked,
  onPageChange,
}) {
  return (
    <ul className="pagination">
      <li>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || locked}
          className="pagination-button prev-next"
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>
      </li>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
        <li key={number}>
          <button
            onClick={() => onPageChange(number)}
            disabled={locked}
            className={`pagination-button ${page === number ? "active" : ""}`}
          >
            {number}
          </button>
        </li>
      ))}

      <li>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= maxPage || locked}
          className="pagination-button prev-next"
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </li>
    </ul>
  );
}
