import React, { useState } from 'react';
import { productCategories } from '@/data/productCategories';

interface Product {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  quantity: string;
  variant: string;
  image: string;
  discount: string;
}

function RetailerInventoryDashboard() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    name: '', category: '', subcategory: '', price: '', quantity: '', variant: '', image: '', discount: ''
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (product.name && product.category && product.price && product.quantity) {
      setInventory(prev => [...prev, { ...product, id: Date.now().toString() }]);
      setProduct({ name: '', category: '', subcategory: '', price: '', quantity: '', variant: '', image: '', discount: '' });
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1).filter(line => line.trim());
      const products = lines.map(line => {
        const [name, category, subcategory, price, quantity, variant, image, discount] = line.split(',');
        return { name: name?.trim() || '', category: category?.trim() || '', subcategory: subcategory?.trim() || '', price: price?.trim() || '', quantity: quantity?.trim() || '', variant: variant?.trim() || '', image: image?.trim() || '', discount: discount?.trim() || '' };
      }).filter(p => p.name && p.category);
      
      setInventory(prev => [...prev, ...products]);
    };
    reader.readAsText(file);
  };

  const removeProduct = (index: number) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  const selectedCategory = productCategories.find(cat => cat.name === product.category);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Retailer Inventory Dashboard</h2>

      {/* Product Entry Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            name="name"
            value={product.name}
            onChange={handleInput}
            placeholder="Product Name"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <select
            name="category"
            value={product.category}
            onChange={handleInput}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            {productCategories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            name="subcategory"
            value={product.subcategory}
            onChange={handleInput}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedCategory}
          >
            <option value="">Select Subcategory</option>
            {selectedCategory?.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <input
            name="price"
            value={product.price}
            onChange={handleInput}
            placeholder="Price ($)"
            type="number"
            step="0.01"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <input
            name="quantity"
            value={product.quantity}
            onChange={handleInput}
            placeholder="Quantity"
            type="number"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <input
            name="variant"
            value={product.variant}
            onChange={handleInput}
            placeholder="Variant (Color, Size, etc.)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            name="image"
            value={product.image}
            onChange={handleInput}
            placeholder="Image URL"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            name="discount"
            value={product.discount}
            onChange={handleInput}
            placeholder="Discount (%)"
            type="number"
            min="0"
            max="100"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <button 
            onClick={addProduct} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Add Product
          </button>
          
          <div className="flex items-center">
            <label className="mr-3 text-gray-700 font-medium">Bulk Upload CSV:</label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCSVUpload} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-800">Total Products</h4>
          <p className="text-2xl font-bold text-blue-600">{inventory.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800">Categories</h4>
          <p className="text-2xl font-bold text-green-600">{new Set(inventory.map(item => item.category)).size}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-purple-800">Total Value</h4>
          <p className="text-2xl font-bold text-purple-600">
            ${inventory.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 border-b bg-gray-50">Current Inventory</h3>
        {inventory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No products in inventory yet.</p>
            <p>Add your first product above or upload a CSV file.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold">Product Name</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Subcategory</th>
                  <th className="text-left p-3 font-semibold">Price</th>
                  <th className="text-left p-3 font-semibold">Quantity</th>
                  <th className="text-left p-3 font-semibold">Variant</th>
                  <th className="text-left p-3 font-semibold">Discount</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.subcategory}</td>
                    <td className="p-3 font-semibold text-green-600">${item.price}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.variant || '-'}</td>
                    <td className="p-3">{item.discount ? `${item.discount}%` : '-'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV Template Download */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">CSV Upload Format:</h4>
        <p className="text-sm text-gray-600 mb-2">
          Your CSV file should have the following columns: Name, Category, Subcategory, Price, Quantity, Variant, Image, Discount
        </p>
        <button
          onClick={() => {
            const csvContent = "Name,Category,Subcategory,Price,Quantity,Variant,Image,Discount\nSample Product,Fashion & Apparel,Women's Clothing,29.99,50,Red Medium,,10";
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inventory_template.csv';
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Download CSV Template
        </button>
      </div>
    </div>
  );
}

export default RetailerInventoryDashboard;