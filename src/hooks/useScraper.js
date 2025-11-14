import { useState, useEffect, useCallback, useRef } from "react";
import { scraperService } from "../api/scraper";

const STORAGE_KEY = "__onboarding-Vendors-SDN";
const JOB_ID_KEY = "currentJobId";
const JOB_START_TIME_KEY = "jobStartTime";
const JOB_URL_KEY = "jobUrl";
const JOB_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const useScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const clearJobFromStorage = useCallback(() => {
    localStorage.removeItem(JOB_ID_KEY);
    localStorage.removeItem(JOB_START_TIME_KEY);
    localStorage.removeItem(JOB_URL_KEY);
  }, []);

  const saveJobToStorage = useCallback((jobId, sourceUrl) => {
    localStorage.setItem(JOB_ID_KEY, jobId);
    localStorage.setItem(JOB_START_TIME_KEY, Date.now().toString());
    localStorage.setItem(JOB_URL_KEY, sourceUrl);
  }, []);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const connectToStream = useCallback(
    (jobId) => {
      closeEventSource();
      setIsLoading(true);
      setError(null);

      const eventSource = scraperService.createEventSource(jobId);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.event) {
            case "start":
            case "reading":
            case "update":
              setProgress((prev) => [...prev, data.message].slice(-2));
              break;

            case "complete":
              setProgress((prev) => [...prev, data.message].slice(-2));
              setResult(data.data);
              setIsLoading(false);
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  success: true,
                  data: data.data,
                  error: null,
                })
              );
              clearJobFromStorage();
              closeEventSource();
              break;

            case "error":
              setError(data.error || data.message);
              setIsLoading(false);
              clearJobFromStorage();
              closeEventSource();
              break;

            default:
              break;
          }
        } catch (err) {
          console.error("Failed to parse event data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        setError("Connection to server lost. Please try again.");
        setIsLoading(false);
        clearJobFromStorage();
        closeEventSource();
      };
    },
    [closeEventSource, clearJobFromStorage]
  );

  const startScraping = useCallback(
    async (sourceUrl) => {
      try {
        setIsLoading(true);
        setProgress([]);
        setResult(null);
        setError(null);

        const jobData = await scraperService.submitJob(sourceUrl);
        saveJobToStorage(jobData.job_id, sourceUrl);
        connectToStream(jobData.job_id);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    },
    [saveJobToStorage, connectToStream]
  );

  const resumeJob = useCallback(async () => {
    const jobId = localStorage.getItem(JOB_ID_KEY);
    const startTime = localStorage.getItem(JOB_START_TIME_KEY);

    if (!jobId || !startTime) return false;

    const elapsed = Date.now() - parseInt(startTime, 10);
    if (elapsed > JOB_EXPIRY_MS) {
      clearJobFromStorage();
      return false;
    }

    try {
      const status = await scraperService.getJobStatus(jobId);

      if (status.status === "finished") {
        const resultData = await scraperService.getJobResult(jobId);
        setResult(resultData.result);
        clearJobFromStorage();
        return true;
      }

      if (status.status === "failed") {
        setError(status.error || "Job failed");
        clearJobFromStorage();
        return false;
      }

      connectToStream(jobId);
      return true;
    } catch (err) {
      clearJobFromStorage();
      return false;
    }
  }, [connectToStream, clearJobFromStorage]);

  useEffect(() => {
    return () => closeEventSource();
  }, [closeEventSource]);

  return {
    isLoading,
    progress,
    result,
    error,
    startScraping,
    resumeJob,
  };
};
