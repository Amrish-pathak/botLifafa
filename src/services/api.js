import axios from "axios";

const api = axios.create({
  baseURL: "https://server.taskwalasolution.in",
  timeout: 15000, // 15s ke baad fail maano, hang mat hone do
});

// Slow/flaky network pe auto-retry (network error ya timeout pe)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 2) return Promise.reject(error);

    const isRetryable =
      !error.response || error.code === "ECONNABORTED" || error.response.status >= 500;
    if (!isRetryable) return Promise.reject(error);

    config.__retryCount = (config.__retryCount || 0) + 1;
    await new Promise((r) => setTimeout(r, 800 * config.__retryCount)); // backoff
    return api(config);
  }
);

export default api;
