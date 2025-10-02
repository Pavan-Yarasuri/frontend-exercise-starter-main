import React, { useContext } from "react";
import ProductListContext from "../../context/context";
import { categories, sortOptions } from "../../constants";
import "./toolbarStyles.css";

export const Toolbar = () => {
  const context = useContext(ProductListContext);
  const { query, setQuery, category, setCategory, sort, setSort, reset } =
    context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort({ ...sort, key: e.target.value });
  };

  const handleClearFilters = () => {
    reset();
  };

  return (
    <div className="toolbar-container">
      <h1 id="products-heading" className="toolbar-heading">
        Products
      </h1>
      <div className="toolbar">
        <div className="toolbar-search" role="search">
          <input
            id="toolbar-search"
            data-testid="toolbar-search"
            aria-label="Search products"
            aria-controls="products-table"
            placeholder={"Search for any product..."}
            value={query}
            onChange={handleInputChange}
            className="toolbar-input"
          />
        </div>

        <div role="region" aria-label="Filter products by category">
          <label htmlFor="category-select">Filter by category:&nbsp;</label>
          <select
            id="category-select"
            data-testid="category-select"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div role="region" aria-label="Sort products">
          <label htmlFor="sort-select">Sort by:&nbsp;</label>
          <select
            id="sort-select"
            data-testid="sort-select"
            value={sort.key}
            onChange={handleSortChange}
          >
            {sortOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {(query || category !== "All" || sort.key !== "nameAZ") && (
          <div
            id="clearFiltersContainer"
            data-testid="clearFiltersContainer"
            role="region"
            aria-label="Clear all filters"
          >
            <button
              id="clear-filters-button"
              data-testid="clear-filters-button"
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
