// Category API Service using latestApi
import api from '../api/latestApi';
import { successToast, errorToast } from '../core/core-index';
import { useAuth } from '../context/AuthContext';

const CategoryService = () => {
  const { storeData } = useAuth();
  const storeSlug = storeData?.slug;

  const getCategories = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/store/category/${storeSlug}/list${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch categories');
    }
  }

  const getCategoryById = async (categoryId) => {
    try {
      const response = await api.get(`/store/category/${storeSlug}/view/${categoryId}`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to fetch category');
      throw new Error(error?.response?.data?.message || 'Failed to fetch category');
    }
  }

  const createCategory = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nameEn', data.nameEn);
      formData.append('nameAr', data.nameAr);
      formData.append('descriptionEn', data.descriptionEn || '');
      formData.append('descriptionAr', data.descriptionAr || '');
      if (data.parentCategory) {
        formData.append('parentCategory', data.parentCategory);
      }
      formData.append('isActive', data.isActive);

      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      const response = await api.post(
        `/store/category/${storeSlug}/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to create category');
      throw new Error(error?.response?.data?.message || 'Failed to create category');
    }
  }

  const updateCategory = async (categoryId, data) => {
    try {
      const formData = new FormData();
      formData.append('nameEn', data.nameEn);
      formData.append('nameAr', data.nameAr);
      formData.append('descriptionEn', data.descriptionEn || '');
      formData.append('descriptionAr', data.descriptionAr || '');
      if (data.parentCategory) {
        formData.append('parentCategory', data.parentCategory);
      }
      formData.append('isActive', data.isActive);

      // Handle image update logic
      if (data.image && !data.imageFile) {
        formData.append('existingImage', data.image);
      }

      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      const response = await api.put(
        `/store/category/${storeSlug}/edit/${categoryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update category');
      throw new Error(error?.response?.data?.message || 'Failed to update category');
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const response = await api.delete(`/store/category/${storeSlug}/delete/${categoryId}`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to delete category');
      throw new Error(error?.response?.data?.message || 'Failed to delete category');
    }
  }

  const toggleStatus = async (categoryId) => {
    try {
      const response = await api.put(`/store/category/${storeSlug}/toggle-status/${categoryId}`);
      successToast(response?.data?.message || 'Status updated successfully!');
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update status');
      throw new Error(error?.response?.data?.message || 'Failed to update status');
    }
  }
  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
  };

}
export default CategoryService;

