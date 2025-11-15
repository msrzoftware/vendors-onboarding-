export const ENDPOINTS = {
  HEALTH: "/health",
  SCRAPE_ASYNC: "/scrape/async",
  JOB_STREAM: (jobId) => `/jobs/${jobId}/stream`,
  JOB_STATUS: (jobId) => `/jobs/${jobId}/status`,
  JOB_RESULT: (jobId) => `/jobs/${jobId}/result`,
};
