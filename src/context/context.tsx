import React, { createContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

export type SortState = {
  key: string;
};

export type ProductListContextState = {
  query: string;
  category: string;
  sort: SortState;
  page: number;
  limit: number;
  // setters
  setQuery: (q: string) => void;
  setCategory: (c: string) => void;
  setSort: (s: SortState) => void;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  reset: () => void;
};

const defaultState: ProductListContextState = {
  query: "",
  category: "All",
  sort: { key: "nameAZ" },
  page: 1,
  limit: 50,
  setQuery: () => {},
  setCategory: () => {},
  setSort: () => {},
  setPage: () => {},
  setLimit: () => {},
  reset: () => {},
};

const ProductListContext = createContext<ProductListContextState>(defaultState);

export const ProductListProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<ProductListContextState>;
}) => {
  const [query, setQuery] = useState<string>(
    initialState?.query ?? defaultState.query
  );
  const [category, setCategory] = useState<string>(
    initialState?.category ?? defaultState.category
  );
  const [sort, setSort] = useState<SortState>(
    initialState?.sort ?? defaultState.sort
  );
  const [page, setPage] = useState<number>(
    initialState?.page ?? defaultState.page
  );
  const [limit, setLimit] = useState<number>(
    initialState?.limit ?? defaultState.limit
  );

  const reset = useCallback(() => {
    setQuery("");
    setCategory("All");
    setSort({ key: "nameAZ" });
    setPage(1);
  }, []);

  const value = useMemo(
    () => ({
      query,
      category,
      sort,
      page,
      limit,
      setQuery,
      setCategory,
      setSort,
      setPage,
      setLimit,
      reset,
    }),
    [query, category, sort, page, limit, reset]
  );

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListContext;
