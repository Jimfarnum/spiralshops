import React from "react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="product-card">
      <img
        src={product.imageUrl || "/images/default-product.png"}
        alt={product.name}
        width={300}
        height={200}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>${product.price}</span>
    </div>
  );
}