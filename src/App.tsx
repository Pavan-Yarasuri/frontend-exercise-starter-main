import { Routes, Route } from "react-router-dom";
import { ProductList } from "./features/products/ProductList";
import { ProductDetails } from "./features/products/ProductDetails/ProductDetails";

export default function App() {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  );
}
