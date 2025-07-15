import axios from "axios";
import { loadingManager } from "../core/spinner/loadingManager";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const logoutOnTokenExpire = () => {
  localStorage.clear();
  window.location.href = "/login";
};

const latestApi = {
  method: async (httpMethod, endpoint, data = null) => {
    const token = localStorage.getItem("token");

    try {
      loadingManager.start();
      const response = await axios({
        method: httpMethod,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        validateStatus: (status) => status < 500, // So 401/403 don’t throw
      });

      if (
        response.status === 401 ||
        response.data?.code === 401 ||
        response.data?.message === "Token expired"
      ) {
        logoutOnTokenExpire();
        return;
      }

      return response.data; 
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      loadingManager.stop();
    }
  },

  get: (endpoint) => latestApi.method("get", endpoint),
  post: (endpoint, data) => latestApi.method("post", endpoint, data),
  put: (endpoint, data) => latestApi.method("put", endpoint, data),
  delete: (endpoint) => latestApi.method("delete", endpoint),
};

export default latestApi;
