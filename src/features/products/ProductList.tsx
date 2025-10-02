import { useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../../components/Toolbar/Toolbar";
import TableSection from "../../components/TableSection/TableDataSection/TableSection";
import { ProductListProvider } from "../../context/context";

export function ProductList() {
  return (
    <ProductListProvider>
      <section aria-labelledby="products-heading">
        <Toolbar />
        <TableSection />
      </section>
    </ProductListProvider>
  );
}
