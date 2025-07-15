// Product API Service using latestApi
import { useAuth } from '../context/AuthContext';
import api from '../api/latestApi';
import { successToast, errorToast } from '../core/core-index';

const productService = () => {
  const { storeData } = useAuth();
  const storeSlug = storeData?.slug;

  const getProducts = async () => {
    try {
      const response = await api.get(`/store/products/${storeSlug}/list`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to fetch products');
      throw new Error(error?.response?.data?.message || 'Failed to fetch products');
    }
  }

  const getProductById = async (productId) => {
    try {
      const response = await api.get(`/store/products/${storeSlug}/view/${productId}`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to fetch product');
      throw new Error(error?.response?.data?.message || 'Failed to fetch product');
    }
  }

  const createProduct = async (data) => {
    try {
      const response = await api.post(
        `/store/products/${storeSlug}/add`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to create product');
      throw new Error(error?.response?.data?.message || 'Failed to create product');
    }
  }

  const updateProduct = async (productId, data) => {
    try {
      const response = await api.put(
        `/store/products/${storeSlug}/edit/${productId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update product');
      throw new Error(error?.response?.data?.message || 'Failed to update product');
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/store/products/${storeSlug}/delete/${productId}`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to delete product');
      throw new Error(error?.response?.data?.message || 'Failed to delete product');
    }
  }

  const toggleStatus = async (productId) => {
    try {
      const response = await api.put(`/store/products/${storeSlug}/toggle/${productId}`);
      successToast(response?.data?.message || 'Status updated successfully!');
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update status');
      throw new Error(error?.response?.data?.message || 'Failed to update status');
    }
  }

  const getCategoriesList = async () => {
    try {
      const response = await api.get(`/store/dropdown/${storeSlug}/categoryList`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to load categories');
      throw new Error(error?.response?.data?.message || 'Failed to load categories');
    }
  }

  const getProductOptions = async () => {
    try {
      const response = await api.get(`/store/dropdown/${storeSlug}/optionList`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to load product options');
      throw new Error(error?.response?.data?.message || 'Failed to load product options');
    }
  }
  return {
    getProductOptions,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    getCategoriesList,
  };
}
export default productService;

