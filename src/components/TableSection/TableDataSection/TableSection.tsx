import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import Table from "./Table";
import { Product } from "../../../types";
import PaginationSection from "../PaginationSection/PaginationSection";
import { SpinnerRound } from "spinners-react";
import { Toaster } from "react-hot-toast";
import "./tableStyles.css";

const TableSection = () => {
  const state = useFetchData();
  const { data: listResponse, loading, error } = state;
  const [responseData, setResponseData] = React.useState<Product[]>([]);

  useEffect(() => {
    // when server-side pagination is active, the hook returns items for the current page
    if (!listResponse) return;
    setResponseData(listResponse.items);
  }, [listResponse]);

  return loading ? (
    <div className="loading-container" data-testid="loading-state">
      <SpinnerRound
        size={50}
        enabled={loading}
        color="#0366d6"
        data-testid="loading-spinner"
      />
    </div>
  ) : error ? (
    <div data-testid="error-state">
      <Toaster position="bottom-left" />
    </div>
  ) : (
    <div>
      {!!responseData && (
        <Table
          data={responseData}
          columns={[
            {
              key: "name",
              header: "Name",
              width: 200,
              render: (row) => (
                <Link
                  to={`/products/${row.id}`}
                  className="product-link"
                  data-testid={`product-link-${row.id}`}
                  aria-label={`View details for ${row.name}`}
                >
                  {row.name}
                </Link>
              ),
            },
            {
              key: "price",
              header: "Price",
              width: 100,
              render: (row) => `$${row.price.toFixed(2)}`,
            },
            {
              key: "category",
              header: "Category",
              width: 150,
              render: (row) => row.category,
            },
            {
              key: "stock",
              header: "Stock",
              width: 100,
              render: (row) => (row.inStock ? "In Stock" : "Out of Stock"),
            },
          ]}
          rowKey={(row) => row.id}
          loading={loading}
        />
      )}
      <PaginationSection rowTotal={listResponse?.total || 0} />
    </div>
  );
};

export default TableSection;
