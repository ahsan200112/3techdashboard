import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tags,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
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
  TrendingUp
} from 'lucide-react';
import CategoryModal from '../../components/categories/CategoryModal';
import categoryService from '../../services/categoryService';
import { errorToast, successToast } from '../../core/core-index';
import ToggleSwitch from "../../components/ui/ToggleSwitch";

const CategoriesPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  // State management
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { getCategories, deleteCategory, toggleStatus } = categoryService();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [search, statusFilter, levelFilter, i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown only if click target is outside any open dropdown
      if (!event.target.closest('.category-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const loadCategories = async () => {
    try {
      setLoading(true);

      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (statusFilter !== 'all') filters.isActive = statusFilter === 'active';
      if (levelFilter !== 'all') filters.level = levelFilter;

      const response = await getCategories(filters);
      setCategories(response.data.categories);
      setCategoriesData(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      showNotification('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory._id);
      successToast('Category deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      errorToast('Failed to delete category', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setDeletingCategory(null);
    }
  };

  const getDisplayName = (category) => {
    return i18n.language === 'ar' ? category.nameAr : category.nameEn;
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('nav.categories')}
              </h1>
              <p className="text-purple-100 text-lg">
                Organize your products into categories for better management
              </p>
              <div className="mt-4 flex items-center space-x-6 text-purple-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">
                    {categoriesData.activeCount} Active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm">
                    {categoriesData.inactiveCount} Inactive
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Category</span>
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
              placeholder="Search categories..."
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
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
            >
              <option value="all">All Levels</option>
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
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
          <p className="text-slate-600">Loading categories...</p>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={category._id} className="group relative">
              {/* Beautiful Category Box */}
              <div className="bg-white rounded-3xl border border-slate-200/60 hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transform hover:-translate-y-1">
                {/* Category Image or Icon */}
                <div className="relative h-36 md:h-40 lg:h-44 xl:h-48 bg-slate-100 overflow-hidden rounded-t-3xl p-2">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={getDisplayName(category)}
                      className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-101"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                      <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <Tags className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${category.isActive
                      ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-100/90 text-slate-700 border border-slate-200/50'
                      }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="relative category-dropdown">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === category._id ? null : category._id)
                        }
                        className="p-2 text-slate-600 bg-slate-100 rounded-xl transition-all duration-200"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === category._id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl z-10 min-w-[100px]">
                          <button
                            onClick={() => {
                              handleEditCategory(category);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteCategory(category);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              alert('View coming soon');
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                <div className="px-4 py-3">
                  {/* Category Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                    {getDisplayName(category)}
                  </h3>

                  {/* Category Description */}
                  {/*
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {getDisplayDescription(category) || 'No description available'}
                  </p> */}

                  {/* Category Stats */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-slate-600">
                        <Package className="w-4 h-4 mr-1.5" />
                        <span className="text-sm font-medium">
                          {category.productCount || 0}
                        </span>
                      </div>
                    </div>

                    <ToggleSwitch
                      checked={category.isActive}
                      onChange={async () => {
                        try {
                          await toggleStatus(category._id);
                          loadCategories(); // Refresh the categories
                        } catch (error) {
                          console.error("Status toggle failed:", error);
                        }
                      }}
                    />
                  </div>

                  {/* Category Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                      <span className="text-xs text-slate-500 font-medium">
                        {category.level || 0} Level
                      </span>
                    </div>
                    {category.path && (
                      <span className="text-xs text-slate-400 ml-2">
                        path: {category.path}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Tags className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {search || statusFilter !== 'all' ? 'No categories found' : 'No categories yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first category to organize your products'
            }
          </p>
          <button
            onClick={handleAddCategory}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-medium"
          >
            Add Your First Category
          </button>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        category={editingCategory}
        parentCategories={categories}
        onDone={() => {
          setShowModal(false);
          successToast(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
          loadCategories();
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Category</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{getDisplayName(deletingCategory)}"?
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

export default CategoriesPage;