import type { Product } from "../types";

export type ProductsQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
};

const API_BASE = "/products";
const GET_PRODUCTS = `${API_BASE}?query=&category=&page=1&limit=1000`;
const GET_PRODUCT_DETAILS = (id: string) => `${API_BASE}/:${id}`;

// async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     ...options,
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`API request failed (${res.status}): ${text}`);
//   }

//   // try to parse JSON; if empty body, return undefined
//   const text = await res.text();
//   return text ? JSON.parse(text) : (undefined as unknown as T);
// }

// export async function getProducts(query?: ProductsQuery) {
//   const params = new URLSearchParams();
//   if (query?.q) params.append("q", query.q);
//   if (query?.page) params.append("page", String(query.page));
//   if (query?.pageSize) params.append("pageSize", String(query.pageSize));

//   const path = `/products${params.toString() ? `?${params.toString()}` : ""}`;
//   return fetcher<{ items: Product[]; total: number }>(path);
// }

// export async function getProduct(id: string) {
//   return fetcher<Product>(`/products/${encodeURIComponent(id)}`);
// }

// export async function createProduct(payload: Partial<Product>) {
//   return fetcher<Product>(`/products`, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

export default {
  GET_PRODUCTS,
  GET_PRODUCT_DETAILS,
};
