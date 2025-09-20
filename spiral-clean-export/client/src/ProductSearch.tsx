import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

const mockProducts = [
  {
    id: 1,
    name: 'Blue Denim Jacket',
    price: 49.99,
    distance: 2.1,
    promoted: true,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 2,
    name: 'Vintage Leather Boots',
    price: 89.95,
    distance: 5.4,
    promoted: false,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 3,
    name: 'Handcrafted Tote Bag',
    price: 59.99,
    distance: 3.7,
    promoted: false,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 4,
    name: 'Smart LED Light Bulbs',
    price: 24.99,
    distance: 1.2,
    promoted: true,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 5,
    name: 'Wireless Bluetooth Speaker',
    price: 79.99,
    distance: 4.1,
    promoted: false,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 6,
    name: 'Ceramic Coffee Mugs Set',
    price: 34.95,
    distance: 2.8,
    promoted: false,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 7,
    name: 'Bamboo Cutting Board',
    price: 19.99,
    distance: 1.5,
    promoted: false,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 8,
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    distance: 6.2,
    promoted: true,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  },
];

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [category, setCategory] = useState('');
  const [selectedMall, setSelectedMall] = useState('');
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleMallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMall(e.target.value);
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof mockProducts[0]) => {
    e.preventDefault(); // Prevent Link navigation when clicking the button
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === '' || product.category === category) &&
      (selectedMall === '' || product.store.toLowerCase().includes(selectedMall.toLowerCase()))
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

        <select 
          onChange={handleMallChange}
          value={selectedMall}
          className="p-2 border rounded"
        >
          <option value="">All Locations</option>
          <option value="downtown">Downtown Plaza</option>
          <option value="vintage">Vintage Threads</option>
          <option value="tech">TechHub</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="relative">
            <Link href={`/products/${product.id}`}>
              <div
                className={`border p-2 rounded shadow cursor-pointer hover:shadow-lg transition-shadow ${
                  product.promoted ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-40 object-cover rounded mb-2" 
                />
                <h2 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{product.distance} miles away</p>
                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                {product.promoted && (
                  <span className="text-sm text-blue-500 font-bold">Promoted</span>
                )}
              </div>
            </Link>
            <Button
              size="sm"
              onClick={(e) => handleAddToCart(e, product)}
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
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