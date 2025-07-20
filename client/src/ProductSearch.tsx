import React, { useState } from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Blue Denim Jacket',
    price: 49.99,
    distance: 2.1,
    promoted: true,
    category: 'clothing',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 2,
    name: 'Vintage Leather Boots',
    price: 89.95,
    distance: 5.4,
    promoted: false,
    category: 'clothing',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 3,
    name: 'Handcrafted Tote Bag',
    price: 59.99,
    distance: 3.7,
    promoted: false,
    category: 'clothing',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 4,
    name: 'Smart LED Light Bulbs',
    price: 24.99,
    distance: 1.2,
    promoted: true,
    category: 'electronics',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 5,
    name: 'Wireless Bluetooth Speaker',
    price: 79.99,
    distance: 4.1,
    promoted: false,
    category: 'electronics',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 6,
    name: 'Ceramic Coffee Mugs Set',
    price: 34.95,
    distance: 2.8,
    promoted: false,
    category: 'home',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 7,
    name: 'Bamboo Cutting Board',
    price: 19.99,
    distance: 1.5,
    promoted: false,
    category: 'home',
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 8,
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    distance: 6.2,
    promoted: true,
    category: 'electronics',
    image: 'https://via.placeholder.com/200',
  },
];

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [category, setCategory] = useState('');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === '' || product.category === category)
    )
    .sort((a, b) => {
      if (sortOption === 'price-low-high') return a.price - b.price;
      if (sortOption === 'price-high-low') return b.price - a.price;
      if (sortOption === 'distance') return a.distance - b.distance;
      return 0;
    });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      <div className="filter-sort-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select 
          onChange={handleSortChange}
          value={sortOption}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="distance">Distance (Nearby First)</option>
        </select>

        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />

        <select 
          onChange={handleCategoryChange}
          value={category}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`border p-2 rounded shadow ${
              product.promoted ? 'border-blue-500' : ''
            }`}
          >
            <img src={product.image} alt={product.name} className="w-full mb-2" />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{product.distance} miles away</p>
            <p className="text-xs text-gray-500 capitalize">{product.category}</p>
            {product.promoted && (
              <span className="text-sm text-blue-500 font-bold">Promoted</span>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;