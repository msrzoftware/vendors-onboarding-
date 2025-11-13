import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Helper function to sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to determine if an error is retryable
const isRetryableError = (error) => {
  // Network errors are retryable
  if (!error.response) {
    return true;
  }
  // Check if status code is retryable
  const status = error.response?.status;
  return RETRY_CONFIG.retryableStatusCodes.includes(status);
};

// Retry wrapper function
const withRetry = async (fn, retries = RETRY_CONFIG.maxRetries) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error.originalError || error)) {
      await sleep(RETRY_CONFIG.retryDelay * (RETRY_CONFIG.maxRetries - retries + 1));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

export const scraperService = {
  async submitJob(sourceUrl) {
    return withRetry(async () => {
      const { data } = await apiClient.post(ENDPOINTS.SCRAPE_ASYNC, {
        source_url: sourceUrl,
      });
      return data;
    });
  },

  async getJobStatus(jobId) {
    return withRetry(async () => {
      const { data } = await apiClient.get(ENDPOINTS.JOB_STATUS(jobId));
      return data;
    });
  },

  async getJobResult(jobId) {
    return withRetry(async () => {
      const { data } = await apiClient.get(ENDPOINTS.JOB_RESULT(jobId));
      return data;
    });
  },

  createEventSource(jobId) {
    const baseURL = apiClient.defaults.baseURL;
    return new EventSource(`${baseURL}${ENDPOINTS.JOB_STREAM(jobId)}`);
  },
};
