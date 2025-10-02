const categories = [
  "All",
  "Automotive",
  "Beauty",
  "Books",
  "Clothing",
  "Electronics",
  "Garden",
  "Grocery",
  "Home",
  "Sports",
  "Toys",
];

const sortOptions = [
  { key: "nameAZ", label: "Name: A to Z" },
  { key: "nameZA", label: "Name: Z to A" },
  { key: "categoryAZ", label: "Category: A to Z" },
  { key: "categoryZA", label: "Category: Z to A" },
  { key: "priceLH", label: "Price: Low to High" },
  { key: "priceHL", label: "Price: High to Low" },
];

const offsetOptions = [10, 20, 50, 100];

export { categories, sortOptions, offsetOptions };
