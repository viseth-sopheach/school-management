import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If VITE_API_URL is configured and isn't the local proxy route, use it
  if (envUrl && envUrl !== "/api") {
    return envUrl;
  }
  // For local development on localhost, use the Vite proxy
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "/api";
  }
  // Otherwise default to the hosted backend
  return "https://school-management-2ito.onrender.com/api";
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
