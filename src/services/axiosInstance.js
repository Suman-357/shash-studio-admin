import axios from "axios";

export const resolveBaseUrl = () => {
  let rawUrl = (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/^["']+|["']+$/g, "");

  if (!rawUrl) {
    console.error("VITE_API_URL is not configured.");
    return "";
  }

  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl =
      rawUrl.startsWith("localhost") || rawUrl.startsWith("127.0.0.1")
        ? `http://${rawUrl}`
        : `https://${rawUrl}`;
  }

  const clean = rawUrl.replace(/\/+$/, "");
  if (clean.endsWith("/api/v1")) return clean;
  if (clean.endsWith("/api")) return `${clean}/v1`;
  return `${clean}/api/v1`;
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor: Inject Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shash_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data or format error
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("shash_admin_token");
      localStorage.removeItem("shash_admin_user");
      window.dispatchEvent(new Event("shash_admin_logout"));
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred with the server.";
    console.error("API Error:", message, error.response?.status);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
