import type { AxiosError } from "axios";
import api from "./axiosInstance";
import queryClient from "./queryClient";
import { getStoredToken, clearAuth } from "@/widgets/features/login/hooks/authApi";

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
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isLoginFlow = url.includes("/auth/") || url.includes("/roles");

    if (status === 401 && !isLoginFlow) {
      clearAuth();
      queryClient.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);
