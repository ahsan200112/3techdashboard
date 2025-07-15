import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye, GitCompare as Compare, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Gaming Laptop Pro Max',
      price: 1299.99,
      originalPrice: 1599.99,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 256,
      category: 'electronics',
      inStock: true,
      isNew: false,
      isSale: true,
      discount: 19,
      badge: 'Best Seller',
      description: 'High-performance gaming laptop with RTX graphics and ultra-fast SSD storage.'
    },
    {
      id: 2,
      name: 'Wireless Earbuds Pro',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 189,
      category: 'electronics',
      inStock: true,
      isNew: true,
      isSale: false,
      discount: 20,
      badge: 'Hot Deal',
      description: 'Premium wireless earbuds with active noise cancellation and long battery life.'
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 134,
      category: 'electronics',
      inStock: true,
      isNew: false,
      isSale: true,
      discount: 25,
      badge: 'Limited Time',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS capabilities.'
    },
    {
      id: 4,
      name: 'Designer Leather Jacket',
      price: 249.99,
      originalPrice: 349.99,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 89,
      category: 'fashion',
      inStock: true,
      isNew: false,
      isSale: true,
      discount: 29,
      badge: 'Trending',
      description: 'Premium genuine leather jacket with modern design and superior craftsmanship.'
    },
    {
      id: 5,
      name: 'Professional Camera Kit',
      price: 899.99,
      originalPrice: 1199.99,
      image: 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 78,
      category: 'electronics',
      inStock: false,
      isNew: false,
      isSale: true,
      discount: 25,
      badge: 'Editor\'s Choice',
      description: 'Complete professional camera kit with multiple lenses and accessories.'
    },
    {
      id: 6,
      name: 'Bluetooth Speaker Pro',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      reviews: 156,
      category: 'electronics',
      inStock: true,
      isNew: true,
      isSale: true,
      discount: 20,
      badge: 'New Arrival',
      description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
    { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'fashion').length },
    { id: 'home', name: 'Home & Garden', count: 0 },
    { id: 'sports', name: 'Sports & Fitness', count: 0 }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-green-50 transition-colors">
            <Compare className="w-4 h-4 text-gray-600 hover:text-green-600" />
          </button>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-red-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <button 
          className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-64 h-40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 p-6 flex justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-red-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.badge && (
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-full">
                {product.badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between ml-6">
          <div className="flex gap-2 mb-4">
            <button className="bg-gray-100 p-2 rounded-lg border hover:bg-red-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-600" />
            </button>
            <button className="bg-gray-100 p-2 rounded-lg border hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
            </button>
          </div>
          <button 
            className={`py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
              product.inStock
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Products</h1>
          <p className="text-gray-600 text-lg">Discover our complete collection of high-quality products at unbeatable prices</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                      <input
                        type="number"
                        placeholder="$0"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                      <input
                        type="number"
                        placeholder="$2000"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Apply Filter
                  </button>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="checkbox" className="mr-3 text-red-600 focus:ring-red-500" />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-medium">
                    Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
                  </span>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="bestseller">Best Sellers</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Previous
                </button>
                <button className="px-4 py-3 bg-red-600 text-white rounded-lg font-bold">1</button>
                <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  2
                </button>
                <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  3
                </button>
                <span className="px-4 py-3 text-gray-500">...</span>
                <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  10
                </button>
                <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;