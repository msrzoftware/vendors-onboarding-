import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://13.203.134.199:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
