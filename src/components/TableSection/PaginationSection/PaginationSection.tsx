import React, { useContext } from "react";
import ProductListContext from "../../../context/context";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import "./paginationStyles.css";
import { offsetOptions } from "../../../constants";

const PaginationSection = ({ rowTotal }: { rowTotal: number }) => {
  const context = useContext(ProductListContext);
  const { page, setPage, limit, setLimit } = context;

  const handleLeftClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRightClick = () => {
    if (page < Math.ceil(rowTotal / limit)) {
      setPage(page + 1);
    }
  };

  const handleButtonClick = (page: number) => {
    setPage(page);
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLimit(Number(value));
    setPage(1); // reset to first page when page size changes
  };

  const totalPages = Math.ceil(rowTotal / limit);

  const firstSet = [1, 2]; // Always show first two pages
  const changeSet =
    totalPages > 10 && page > 2 && page < totalPages - 1 ? page : 3; // Middle page
  const lastSet = [totalPages - 1, totalPages]; // Always show last two pages

  return (
    <div className="pagination-main-container">
      {/* Pagination section */}
      <div
        className="pagination-container"
        role="navigation"
        aria-label="Pagination"
        id="pagination-section"
        data-testid="pagination-section"
      >
        <div>
          <button
            aria-label="Previous page"
            onClick={handleLeftClick}
            disabled={page <= 1}
            className={`pagination-arrow-btn ${page <= 1 ? "disabled" : ""}`}
            id="prev-page-button"
            data-testid="prev-page-button"
          >
            <AiOutlineArrowLeft aria-hidden="true" />
          </button>
        </div>
        <div>
          {totalPages > 10 ? (
            <div>
              {firstSet.map((page) => (
                <button
                  key={page}
                  onClick={() => handleButtonClick(page)}
                  className={`pagination-btn ${
                    page === context.page ? "active" : ""
                  }`}
                  aria-current={page === context.page ? "page" : undefined}
                  id={`page-button-${page}`}
                  data-testid={`page-button-${page}`}
                >
                  {page}
                </button>
              ))}
              <button
                key={changeSet}
                onClick={() => handleButtonClick(changeSet)}
                className={`pagination-btn ${
                  changeSet === context.page ? "active" : ""
                }`}
                aria-current={changeSet === context.page ? "page" : undefined}
                id={`page-button-${changeSet}`}
                data-testid={`page-button-${changeSet}`}
              >
                {changeSet}
              </button>
              <span aria-hidden="true" className="ellipsis">
                ...
              </span>
              {lastSet.map((page) => (
                <button
                  key={page}
                  onClick={() => handleButtonClick(page)}
                  className={`pagination-btn ${
                    page === context.page ? "active" : ""
                  }`}
                  aria-current={page === context.page ? "page" : undefined}
                  id={`page-button-${page}`}
                  data-testid={`page-button-${page}`}
                >
                  {page}
                </button>
              ))}
            </div>
          ) : (
            Array.from(
              { length: Math.ceil(rowTotal / limit) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => handleButtonClick(page)}
                className={`pagination-btn ${
                  page === context.page ? "active" : ""
                }`}
                aria-current={page === context.page ? "page" : undefined}
                id={`page-button-${page}`}
                data-testid={`page-button-${page}`}
              >
                {page}
              </button>
            ))
          )}
        </div>
        <div>
          <button
            aria-label="Next page"
            onClick={handleRightClick}
            disabled={page >= Math.ceil(rowTotal / limit)}
            className={`pagination-arrow-btn ${
              page >= Math.ceil(rowTotal / limit) ? "disabled" : ""
            }`}
            id="next-page-button"
            data-testid="next-page-button"
          >
            <AiOutlineArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* Custom page offset selector */}
      <div
        className="page-offset-container"
        id="page-offset-selector"
        data-testid="page-offset-selector"
      >
        <div>
          <label htmlFor="page-size-select">Page Offset:&nbsp;</label>
          <select
            aria-label="Items per page"
            value={limit}
            onChange={handleOffsetChange}
            id="page-size-select"
            data-testid="page-size-select"
          >
            {offsetOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                id={`page-size-option-${opt}`}
                data-testid={`page-size-option-${opt}`}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default PaginationSection;
