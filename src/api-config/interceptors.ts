import api from "./axiosInstance";
import {
  getStoredToken,
  clearAuth,
} from "@/widgets/features/login/api/authApi";

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    const url = error.config?.url ?? "";
    const isLoginFlow = url.includes("/auth/") || url.includes("/roles");
    if (error.response?.status === 401 && !isLoginFlow) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
