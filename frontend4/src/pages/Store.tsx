import React, { useState } from 'react';
import { Search, ShoppingCart, Filter, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

const Store: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  // Sample product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Vitamin D3 Supplements',
      description: '60 tablets, 1000 IU each',
      price: 19.99,
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg',
      rating: 4.5,
      category: 'vitamins'
    },
    {
      id: '2',
      name: 'Digital Blood Pressure Monitor',
      description: 'Automatic Upper Arm BP Machine',
      price: 49.99,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      rating: 4.8,
      category: 'devices'
    },
    {
      id: '3',
      name: 'First Aid Kit',
      description: 'Complete Emergency Medical Supply',
      price: 29.99,
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
      rating: 4.7,
      category: 'supplies'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'devices', name: 'Medical Devices' },
    { id: 'supplies', name: 'Medical Supplies' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Medical Store</h1>
          <button className="relative p-2">
            <ShoppingCart className="h-6 w-6 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <div className="mt-2 flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={addToCart}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;