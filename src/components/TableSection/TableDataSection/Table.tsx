// src/components/TableSection.tsx
import React from "react";

export type Column<T> = {
  key: string;
  header: string | React.ReactNode;
  width?: string | number;
  render?: (row: T) => React.ReactNode;
};

type TableSectionProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
};

export function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
}: TableSectionProps<T>) {
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table
          id="products-table"
          data-testid="products-table"
          className="products-table"
          role="table"
          aria-label="Products table"
        >
          <thead className="products-thead">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="products-th"
                  style={{
                    width: col.width,
                  }}
                  role="columnheader"
                  scope="col"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody aria-live="polite">
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan={columns.length} className="no-rows">
                  No rows
                </td>
              </tr>
            )}

            {data.length > 0 &&
              !loading &&
              data.map((row) => {
                const k = rowKey(row);
                return (
                  <tr key={k} role="row">
                    {columns.map((col) => (
                      <td key={col.key} className="products-td" role="cell">
                        {col.render ? col.render(row) : (row as any)[col.key]}{" "}
                        {/* render the cell according to the custom render function. If no function, directly render the corresponding cell value */}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
