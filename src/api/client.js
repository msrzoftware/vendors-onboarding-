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

// Enhanced error handling
const getErrorMessage = (error) => {
  // Network errors (no response from server)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "Request timeout. Please check your internet connection and try again.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection.";
    }
    return "Unable to connect to the server. Please try again later.";
  }

  // HTTP error responses
  const status = error.response.status;
  const data = error.response.data;

  // Handle specific error formats from the API
  if (data?.detail) {
    // Handle both string and object detail formats
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (data.detail.message) {
      return data.detail.message;
    }
  }

  if (data?.error) {
    if (typeof data.error === "string") {
      return data.error;
    }
    if (data.error.message) {
      return data.error.message;
    }
  }

  if (data?.message) {
    return data.message;
  }

  // Default messages for common HTTP status codes
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Authentication required. Please log in and try again.";
    case 403:
      return "Access denied. You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 408:
      return "Request timeout. Please try again.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
      return "Bad gateway. The server is temporarily unavailable.";
    case 503:
      return "Service unavailable. Please try again later.";
    case 504:
      return "Gateway timeout. Please try again later.";
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
