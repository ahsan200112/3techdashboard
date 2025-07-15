import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  ChevronDown,
  MoreHorizontal,
  Tags,
  BarChart3,
  Upload,
  Printer,
  Eye
} from 'lucide-react';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

const ProductPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [showAddNewProduct, setShowAddNewProduct] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const additionalOptionsRef = useRef(null);
  const addNewProductRef = useRef(null);

  const { getProducts, deleteProduct, toggleStatus } = productService();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'normal', label: 'Normal Product' },
    { key: 'voucher', label: 'Voucher' },
    { key: 'grouped', label: 'Grouped Product' }
  ];

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when search term or active filter changes
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, activeFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const name = product.name?.toLowerCase() || '';
        const sku = product.sku?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || sku.includes(search);
      });
    }

    // Filter by type (if needed)
    if (activeFilter !== 'all') {
      // This would filter by product type if you have that field
      // filtered = filtered.filter(product => product.type === activeFilter);
    }

    setFilteredProducts(filtered);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddProduct = () => {
    setShowAddNewProduct(false);
    navigate('/products/add');
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete._id);
      showNotification('Product deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
      await loadProducts();
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Failed to delete product', 'error');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await toggleStatus(product._id);
      loadProducts();
    } catch (error) {
      console.error('Status toggle failed:', error);
    }
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (additionalOptionsRef.current && !additionalOptionsRef.current.contains(event.target)) {
        setShowAdditionalOptions(false);
      }
      if (addNewProductRef.current && !addNewProductRef.current.contains(event.target)) {
        setShowAddNewProduct(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-lg border ${notification.type === 'error'
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-green-50 border-green-200 text-green-700'
          } flex items-center space-x-3 animate-in slide-in-from-right duration-300`}>
          {notification.type === 'error' ? (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header with Dropdowns */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p className="text-indigo-100 text-lg">
                Manage your store products and inventory
              </p>
            </div>

            {/* Dropdown Buttons */}
            <div className="flex items-center space-x-4">
              {/* Additional Options Dropdown */}
              <div className="relative" ref={additionalOptionsRef}>
                <button
                  onClick={() => {
                    setShowAdditionalOptions(!showAdditionalOptions);
                    setShowAddNewProduct(false);
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="font-medium">Additional Options</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdditionalOptions ? 'rotate-180' : ''}`} />
                </button>

                {showAdditionalOptions && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-white/20 z-[60] overflow-hidden">
                    <div className="p-2">
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Additional Options</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage your product settings</p>
                      </div>
                      <div className="py-2">
                        <button className="flex items-center w-full px-4 py-4 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 rounded-2xl mx-2 group">
                          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                            <Tags className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Product Categories</div>
                            <div className="text-xs text-slate-500">Manage product categories</div>
                          </div>
                        </button>
                        <button className="flex items-center w-full px-4 py-4 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-200 rounded-2xl mx-2 group">
                          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                            <BarChart3 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Show Analytics</div>
                            <div className="text-xs text-slate-500">View product performance</div>
                          </div>
                        </button>
                        <button className="flex items-center w-full px-4 py-4 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 rounded-2xl mx-2 group">
                          <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                            <Upload className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Import Products</div>
                            <div className="text-xs text-slate-500">Bulk import from CSV</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add New Product Dropdown */}
              <div className="relative" ref={addNewProductRef}>
                <button
                  onClick={() => {
                    setShowAddNewProduct(!showAddNewProduct);
                    setShowAdditionalOptions(false);
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add New Product</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAddNewProduct ? 'rotate-180' : ''}`} />
                </button>

                {showAddNewProduct && (
                  <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-white/20 z-[60] overflow-hidden">
                    <div className="p-2">
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Add New Product</h3>
                        <p className="text-sm text-slate-500 mt-1">Choose product type</p>
                      </div>
                      <div className="py-2">
                        <button className="flex items-center w-full px-4 py-4 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 rounded-2xl mx-2 group" onClick={handleAddProduct}>
                          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                            <Package
                              className="w-5 h-5 text-blue-600"
                            />
                          </div>
                          <div className="text-left">
                            <div
                              className="font-medium"
                            >
                              Single Product
                            </div>
                            <div className="text-xs text-slate-500">Add individual product</div>
                          </div>
                        </button>
                        <button className="flex items-center w-full px-4 py-4 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-200 rounded-2xl mx-2 group" onClick={handleAddProduct}>
                          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-colors">
                            <Package className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Grouped Product</div>
                            <div className="text-xs text-slate-500">Bundle multiple products</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${activeFilter === filter.key
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200 text-lg"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      )}

      {/* Product Table */}
      {!loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {product.isPublish ? 'Published' : 'Draft'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          /*
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteModal(true);
                            }} */
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200" title="Print Barcode">
                          <Printer className="w-4 h-4" />
                        </button>
                        <div className='d-flex align-items-center'>
                        <ToggleSwitch
                          checked={product.isPublish}
                          onChange={() => handleToggleStatus(product)}
                        />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {selectedProducts.length > 0 && (
                  <span className="font-medium">
                    {selectedProducts.length} of {filteredProducts.length} products selected
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600">
                Showing {filteredProducts.length} products
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Are you sure?</h2>
            <p className="text-slate-600 mb-6">You are about to delete <strong>{productToDelete?.name}</strong></p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Create your first product to start selling'
            }
          </p>
          <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;