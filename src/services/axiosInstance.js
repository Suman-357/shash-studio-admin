import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
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
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred with the server.";
    console.error("API Error:", message, error.response?.status);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
