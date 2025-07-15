import React from 'react';
import { ArrowRight, Star, Truck, Shield, Headphones, RefreshCw, Timer, Zap, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      price: '$1,299.99',
      originalPrice: '$1,599.99',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 256,
      discount: '19%',
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Wireless Earbuds Pro',
      price: '$199.99',
      originalPrice: '$249.99',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 189,
      discount: '20%',
      badge: 'Hot Deal'
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      price: '$299.99',
      originalPrice: '$399.99',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 134,
      discount: '25%',
      badge: 'Limited Time'
    },
    {
      id: 4,
      name: 'Professional Camera Kit',
      price: '$899.99',
      originalPrice: '$1,199.99',
      image: 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 78,
      discount: '25%',
      badge: 'Editor\'s Choice'
    }
  ];

  const categories = [
    { name: 'Electronics', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300', count: '500+ Products', color: 'from-blue-500 to-blue-700' },
    { name: 'Fashion', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300', count: '300+ Products', color: 'from-pink-500 to-pink-700' },
    { name: 'Home & Living', image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300', count: '250+ Products', color: 'from-green-500 to-green-700' },
    { name: 'Sports & Fitness', image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=300', count: '180+ Products', color: 'from-orange-500 to-orange-700' }
  ];

  const deals = [
    { title: 'Flash Sale', subtitle: 'Up to 70% Off', time: '23:59:45', color: 'bg-red-600' },
    { title: 'Weekend Deal', subtitle: 'Buy 2 Get 1 Free', time: '47:23:12', color: 'bg-purple-600' },
    { title: 'Clearance', subtitle: 'Extra 30% Off', time: '71:45:30', color: 'bg-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Limited Time Offer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Mega Sale
                <span className="block text-yellow-300">Up to 80% Off</span>
              </h1>
              <p className="text-xl mb-8 text-red-100 leading-relaxed">
                Don't miss out on our biggest sale of the year! Premium products at unbeatable prices. 
                Shop now and save big on your favorite items.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-colors">
                  View Deals
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm">
                <img
                  src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Hero Product"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-800 rounded-full w-20 h-20 flex items-center justify-center font-bold text-lg shadow-lg">
                  80%<br/>OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Countdown */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <div key={index} className={`${deal.color} rounded-lg p-6 text-center`}>
                <h3 className="text-xl font-bold mb-1">{deal.title}</h3>
                <p className="text-sm opacity-90 mb-3">{deal.subtitle}</p>
                <div className="flex items-center justify-center space-x-2 text-2xl font-mono font-bold">
                  <Timer className="w-5 h-5" />
                  <span>{deal.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                <Truck className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $75 worldwide</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure and encrypted transactions</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Headphones className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Expert customer support around the clock</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <RefreshCw className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free 30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our extensive collection across multiple categories
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white text-sm opacity-90">{category.count}</p>
                    <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Handpicked products with the best deals and highest ratings
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                      -{product.discount}
                    </span>
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-full">
                      {product.badge}
                    </span>
                  </div>
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
                      <span className="text-2xl font-bold text-red-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                    </div>
                  </div>
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Join Our VIP Club</h2>
            <p className="text-red-100 mb-8 text-lg leading-relaxed">
              Get exclusive access to flash sales, new product launches, and special member-only discounts. 
              Plus, receive a 15% welcome bonus on your first order!
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-4 focus:ring-red-300 text-lg"
              />
              <button className="bg-yellow-400 text-red-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
                Join Now
              </button>
            </div>
            <p className="text-red-200 text-sm mt-4">
              * No spam, unsubscribe anytime. Terms and conditions apply.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;