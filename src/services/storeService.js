// Store API Service using latestApi
import api from '../api/latestApi';
import { getCurrentCustomer } from '../api/apiEndpoints';
import { successToast, errorToast } from '../core/core-index';

class StoreService {
  async getStoreInfo() {
    try {
      const response = await api.get(getCurrentCustomer);
      if (response.code === 200 || response.status === "Success") {
        // Extract store information from the response
        const storeData = response.data?.store || response.store;
        return { data: storeData };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch store information');
      }
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch store information');
    }
  }

  async selectTheme(themeId) {
    try {
      const response = await api.post(`/api/store/theme-selection/${themeId}`);
      if (response.code === 200 || response.status === "Success") {
        return response;
      } else {
        throw new Error(response.data?.message || 'Failed to select theme');
      }
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to select theme');
      throw new Error(error?.response?.data?.message || 'Failed to select theme');
    }
  }

  async updateStore(storeData) {
    try {
      const response = await api.put('/api/store/update', storeData);
      if (response.code === 200 || response.status === "Success") {
        successToast('Store updated successfully!');
        return response;
      } else {
        throw new Error(response.data?.message || 'Failed to update store');
      }
    } catch (error) {
      errorToast(error?.response?.data?.message || 'Failed to update store');
      throw new Error(error?.response?.data?.message || 'Failed to update store');
    }
  }

  getStoreDomain(storeData) {
    // Extract domain from store data
    return storeData?.domain || `${storeData?.slug || 'store'}.lvh.me`;
  }

  openStoreWebsite(storeData) {
    const domain = this.getStoreDomain(storeData);
    const url = domain.startsWith('http') ? domain : `http://${domain}`;
    window.open(url, '_blank');
  }
}

export default new StoreService();