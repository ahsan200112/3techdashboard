import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Filter,
  MoreVertical,
  Eye,
  Copy,
  Archive,
  Star,
  Calendar,
  TrendingUp,
  Type,
  Palette
} from 'lucide-react';
import ProductOptionModal from '../../components/productOptions/ProductOptionModal';
import productOptionService from '../../services/productOptionService';
import { errorToast, successToast } from '../../core/core-index';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

const ProductOptionsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State management
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [deletingOption, setDeletingOption] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const dropdownRefs = useRef({});

  const {
    getProductOptions,
    getProductOptionById,
    toggleStatus,
    deleteProductOption,
  } = productOptionService();


  // Load product options on component mount
  useEffect(() => {
    loadProductOptions();
  }, [search, statusFilter, typeFilter,]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      const clickedInsideAnyDropdown = Object.values(dropdownRefs.current).some(ref =>
        ref && ref.contains(event.target)
      );

      if (!clickedInsideAnyDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadProductOptions = async () => {
    try {
      setLoading(true);

      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (statusFilter !== 'all') filters.isActive = statusFilter === 'active';
      if (typeFilter !== 'all') filters.type = typeFilter;

      const response = await getProductOptions(filters);
      setProductOptions(response.data.options);
    } catch (error) {
      console.error('Error loading product options:', error);
      errorToast('Failed to load product options', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setEditingOption(null);
    setShowModal(true);
  };

  const handleEditOption = async (option) => {
    // Close dropdown immediately
    setOpenDropdown(null);

    try {
      const response = await getProductOptionById(option._id);
      if (response?.data || response) {
        setEditingOption(response.data || response);
      } else {
        setEditingOption(option);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching option details:', error);
      // Fallback: use the option data we already have
      setEditingOption(option);
      setShowModal(true);
      errorToast('Using cached data - some details may be limited', 'warning');
    }
  };

  const handleDeleteOption = (option) => {
    setOpenDropdown(null); // Close dropdown
    setDeletingOption(option);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingOption) return;

    try {
      await deleteProductOption(deletingOption._id);
      successToast('Product option deleted successfully');
      loadProductOptions();
    } catch (error) {
      console.error('Error deleting product option:', error);
      errorToast('Failed to delete product option', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setDeletingOption(null);
    }
  };

  const handleToggleStatus = async (option) => {
    try {
      await toggleStatus(option._id);
      loadProductOptions();
    } catch (error) {
      console.error('Status toggle failed:', error);
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
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Product Options
              </h1>
              <p className="text-indigo-100 text-lg">
                Manage product options like size, color, and other variants
              </p>
              <div className="mt-4 flex items-center space-x-6 text-indigo-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">
                    {productOptions.filter(opt => opt.isActive).length} Active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm">
                    {productOptions.filter(opt => !opt.isActive).length} Inactive
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddOption}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Product Option</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 ${isRTL ? 'right-4' : 'left-4'
              }`} />
            <input
              type="text"
              placeholder="Search product options..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200 ${isRTL ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'
                }`}
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="color">Color</option>
            </select>

            <button className="flex items-center space-x-2 px-6 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading product options...</p>
        </div>
      )}

      {/* Product Options Grid */}
      {!loading && productOptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productOptions.map((option, index) => (
            <div key={option._id} className="group relative">
              {/* Beautiful Option Box */}
              <div className="bg-white rounded-3xl border border-slate-200/60 hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transform hover:-translate-y-1">
                {/* Option Header */}
                <div className="relative h-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {option.type === 'color' ? (
                        <Palette className="w-6 h-6 text-white" />
                      ) : (
                        <Type className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${option.isActive
                      ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-100/90 text-slate-700 border border-slate-200/50'
                      }`}>
                      {option.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions Dropdown */}
                  <div
                    className="absolute top-4 right-4"
                    ref={el => dropdownRefs.current[option._id] = el}
                  >
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === option._id ? null : option._id)
                        }
                        className="p-2 text-slate-600 bg-slate-100 rounded-xl transition-all duration-200"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === option._id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl z-20 min-w-[120px] border border-slate-200">
                          <button
                            onClick={() => {
                              handleEditOption(option);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 first:rounded-t-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteOption(option);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 last:rounded-b-xl transition-all border-t border-slate-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Option Content */}
                <div className="px-4 py-3">
                  {/* Option Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                    {option.name}
                  </h3>

                  {/* Option Type */}
                  <div className="flex items-center mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${option.type === 'color'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {option.type === 'color' ? 'Color' : 'Text'}
                    </span>
                  </div>

                  {/* Toggle Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      {option.valuesCount} values
                    </span>
                    <ToggleSwitch
                      checked={option.isActive}
                      onChange={() => handleToggleStatus(option)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && productOptions.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {search || statusFilter !== 'all' || typeFilter !== 'all' ? 'No options found' : 'No product options yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first product option to manage product variants'
            }
          </p>
          <button
            onClick={handleAddOption}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-medium"
          >
            Add Your First Product Option
          </button>
        </div>
      )}

      {/* Product Option Modal */}
      <ProductOptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productOption={editingOption}
        onDone={() => {
          setShowModal(false);
          successToast(`Product Option ${editingOption ? 'updated' : 'created'} successfully`);
          loadProductOptions();
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Product Option</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{deletingOption?.name}"? This will also delete all its values.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptionsPage;