import { Product } from "./types";

const processData = (data: Array<any>): Product[] =>
  data.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category,
    inStock: item.inStock,
    description: item.description,
  }));

const getSortedData = (data: Product[], sortKey: string) => {
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
};

export default { processData, getSortedData };
