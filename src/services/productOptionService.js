// useProductOptionService.js
import { useAuth } from '../context/AuthContext';
import api from '../api/latestApi';
import { successToast, errorToast } from '../core/core-index';

const ProductOptionService = () => {
  const { storeData } = useAuth();
  const storeSlug = storeData?.slug;

  const getProductOptions = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/store/option/${storeSlug}/list${queryString ? `?${queryString}` : ''}`;
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch product options');
    }
  };

  const getProductOptionById = async (optionId) => {
    try {
      const response = await api.get(`/store/option/${storeSlug}/view/${optionId}`);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch product option');
    }
  };

  const createProductOption = async (data) => {
    try {
      const response = await api.post(`/store/option/${storeSlug}/add`, data);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to create product option');
      throw new Error(error?.response?.data?.message || 'Failed to create product option');
    }
  };

  const updateProductOption = async (optionId, data) => {
    try {
      const response = await api.put(`/store/option/${storeSlug}/edit/${optionId}`, data);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update product option');
      throw new Error(error?.response?.data?.message || 'Failed to update product option');
    }
  };

  const deleteProductOption = async (optionId) => {
    try {
      const response = await api.delete(`/store/option/${storeSlug}/delete/${optionId}`);
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to delete product option');
      throw new Error(error?.response?.data?.message || 'Failed to delete product option');
    }
  };

  const toggleStatus = async (optionId) => {
    try {
      const response = await api.put(`/store/option/${storeSlug}/toggle/${optionId}`);
      successToast(response?.data?.message || 'Status updated successfully!');
      return response;
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update status');
      throw new Error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  return {
    getProductOptions,
    getProductOptionById,
    createProductOption,
    updateProductOption,
    deleteProductOption,
    toggleStatus,
  };
};

export default ProductOptionService;