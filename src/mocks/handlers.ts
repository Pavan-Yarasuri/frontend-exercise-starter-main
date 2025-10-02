import { http, HttpResponse, delay } from "msw";
import data from "./data/products.json";
import { ListResponse, Product } from "../types";

let products: Product[] = JSON.parse(JSON.stringify(data));

function paginate(items: Product[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

function sort(data: Product[], sortKey: string) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    switch (sortKey) {
      case "nameAZ":
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        }); /* ignores case */
      case "nameZA":
        return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
      case "categoryAZ":
        return a.category.localeCompare(b.category, undefined, {
          sensitivity: "base",
        });
      case "categoryZA":
        return b.category.localeCompare(a.category, undefined, {
          sensitivity: "base",
        });
      case "priceLH":
        return a.price - b.price;
      case "priceHL":
        return b.price - a.price;
      default:
        return 0;
    }
  });
}

function sortAndPaginate(
  items: Product[],
  page: number,
  limit: number,
  sortKey?: string
) {
  const sortedData = sortKey ? sort(items, sortKey) : items;
  const paginatedData = paginate(sortedData, page, limit);
  return paginatedData;
}

export const handlers = [
  http.get("/products", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 8);
    const query = url.searchParams.get("query")?.toLowerCase() || "";
    const category = url.searchParams.get("category") || "";
    const sortKey = url.searchParams.get("sortKey") || "";
    await delay(200);
    let list = products.filter((p) => p.name.toLowerCase().includes(query));
    if (category) list = list.filter((p) => p.category === category);
    const body: ListResponse = {
      items: sortAndPaginate(list, page, limit, sortKey),
      page,
      limit,
      total: list.length,
    };
    return HttpResponse.json(body);
  }),

  http.get("/products/:id", async ({ params }) => {
    await delay(150);
    const found = products.find((p) => p.id === params.id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
];
