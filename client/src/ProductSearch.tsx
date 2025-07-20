import React, { useState } from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Blue Denim Jacket',
    price: 49.99,
    distance: 2.1,
    promoted: true,
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 2,
    name: 'Vintage Leather Boots',
    price: 89.95,
    distance: 5.4,
    promoted: false,
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 3,
    name: 'Handcrafted Tote Bag',
    price: 59.99,
    distance: 3.7,
    promoted: false,
    image: 'https://via.placeholder.com/200',
  },
];

const ProductSearch = () => {
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');

  const sortedProducts = [...mockProducts].sort((a, b) =>
    sortBy === 'price' ? a.price - b.price : a.distance - b.distance
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full mr-4"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'distance')}
          className="p-2 border rounded"
        >
          <option value="price">Sort by Price</option>
          <option value="distance">Sort by Distance</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className={`border p-2 rounded shadow ${
              product.promoted ? 'border-blue-500' : ''
            }`}
          >
            <img src={product.image} alt={product.name} className="w-full mb-2" />
            <h2 className="font-semibold">{product.name}</h2>
            <p>${product.price.toFixed(2)}</p>
            <p>{product.distance} miles away</p>
            {product.promoted && (
              <span className="text-sm text-blue-500 font-bold">Promoted</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;