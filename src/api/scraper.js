import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export const scraperService = {
  async submitJob(sourceUrl) {
    const { data } = await apiClient.post(ENDPOINTS.SCRAPE_ASYNC, {
      source_url: sourceUrl,
    });
    return data;
  },

  async getJobStatus(jobId) {
    const { data } = await apiClient.get(ENDPOINTS.JOB_STATUS(jobId));
    return data;
  },

  async getJobResult(jobId) {
    const { data } = await apiClient.get(ENDPOINTS.JOB_RESULT(jobId));
    return data;
  },

  createEventSource(jobId) {
    const baseURL = apiClient.defaults.baseURL;
    return new EventSource(`${baseURL}${ENDPOINTS.JOB_STREAM(jobId)}`);
  },
};
