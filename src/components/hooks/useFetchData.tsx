import { useState, useEffect, useContext } from "react";
import { ListResponse } from "../../types";
import utils from "../../utils";
import ProductListContext from "../../context/context";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";

interface FetchState {
  data: ListResponse | null;
  loading: boolean;
  error: Error | null;
}

function useFetchData(pageSize?: number) {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  const { query, category, page, limit, sort } = useContext(ProductListContext);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (category && category !== "All") params.set("category", category);
    params.set("page", String(page || 1));
    params.set("limit", String(limit ?? 10));

    if (sort?.key) params.set("sortKey", sort?.key);

    const url = `/products?${params.toString()}`;

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) toast.error(`Network response was not ok (${res.status})`);
        const json = await res.json();
        const items = utils.processData(json?.items || []);
        const response: ListResponse = {
          items,
          page: json.page ?? page,
          limit: json.limit ?? pageSize ?? 10,
          total: json.total ?? items.length,
        };
        if (isMounted)
          setState({ data: response, loading: false, error: null });
      } catch (err: unknown) {
        const error = new Error(String(err));

        toast.error(error.message);
        if (isMounted) setState({ data: null, loading: false, error });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, category, page, limit, sort?.key]);

  return state;
}

export default useFetchData;
