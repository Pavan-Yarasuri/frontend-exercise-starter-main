import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { SpinnerRound } from "spinners-react";
import "./productDetails.css";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description?: string;
};

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error("No product id provided");

        const res = await fetch(`/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found (404)");
          throw new Error(`Failed to fetch product (${res.status})`);
        }

        const data: Product = await res.json();
        setProduct(data);
      } catch (err: any) {
        const error = new Error(String(err));
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return (
    <div
      className="product-details-container"
      aria-labelledby="product-heading"
    >
      <h1
        className="heading"
        id="product-heading"
        data-testid="product-heading"
      >
        Product Details
      </h1>

      {loading && (
        <div className="loading-container" role="status" aria-live="polite">
          <SpinnerRound size={50} enabled={loading} color="#0366d6" />
        </div>
      )}

      {error && (
        <div className="error-container" role="alert" aria-live="assertive">
          <Toaster position="bottom-left" />
        </div>
      )}

      {product && (
        <div
          className="product-card"
          aria-label="Product information"
          role="region"
          id="product-info"
          data-testid="product-info"
        >
          <h2 className="product-title">{product.name}</h2>
          <div className="product-info">
            <p id="product-price" data-testid="product-price">
              <strong>Price:&nbsp;</strong>
              <span aria-label={`Price ${product.price}`}>
                ${product.price}
              </span>
            </p>
            <p id="product-category" data-testid="product-category">
              <strong>Category:&nbsp;</strong>
              <span aria-label={`Category ${product.category}`}>
                {product.category}
              </span>
            </p>
            <p
              id="product-stock"
              data-testid="product-stock"
              className={`stock ${product.inStock ? "in-stock" : "out-stock"}`}
            >
              <strong>In Stock:&nbsp;</strong>
              <span aria-label={product.inStock ? "In stock" : "Out of stock"}>
                {product.inStock ? "Yes" : "No"}
              </span>
            </p>
            <p id="product-description" data-testid="product-description">
              <strong>Description:&nbsp;</strong>
              <span aria-label="Product description">
                {product.description || "-"}
              </span>
            </p>
          </div>
        </div>
      )}

      <p className="back-link-container" id="back-link" data-testid="back-link">
        <Link className="back-link" to="/" aria-label="Back to products list">
          Back
        </Link>
      </p>
    </div>
  );
}
