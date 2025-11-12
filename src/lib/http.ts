/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type InternalAxiosRequestConfig, AxiosError } from "axios";

// ✅ Your Express server uses 8080 by default
const baseURL = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

// Optional: public key for read-only endpoints (if you use one)
const PUBLIC_X_API_KEY = (import.meta.env.VITE_PUBLIC_X_API_KEY ?? "").trim();

// ⚠️ Do NOT hardcode admin key in code or Vite env for production.
// Let the user paste it once and persist locally:
const ADMIN_API_KEY_STORAGE = "admin_api_key";

// JWT token storage (primary auth method now)
const JWT_TOKEN_STORAGE = "admin_token";

// Legacy admin token storage (keep for backward compatibility)
const ADMIN_ACCESS_TOKEN_STORAGE = "admin_access_token";

// ---- simple local stores ----
const getAdminApiKey = () => localStorage.getItem(ADMIN_API_KEY_STORAGE);
const setAdminApiKey = (k: string | null) =>
  k ? localStorage.setItem(ADMIN_API_KEY_STORAGE, k) : localStorage.removeItem(ADMIN_API_KEY_STORAGE);

// JWT token helpers (primary auth method)
const getJwtToken = () => localStorage.getItem(JWT_TOKEN_STORAGE);
const setJwtToken = (t: string | null) =>
  t ? localStorage.setItem(JWT_TOKEN_STORAGE, t) : localStorage.removeItem(JWT_TOKEN_STORAGE);

// Legacy admin token helpers (keep for backward compatibility)
const getAdminToken = () => localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE);
const setAdminToken = (t: string | null) =>
  t ? localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE, t) : localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE);

// ---- axios instance ----
export const http = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: false,
});

// Updated request interceptor - prioritize JWT Bearer token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers || null;

  // 1. Primary: JWT Bearer token (for admin operations)
  const jwtToken = getJwtToken();
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  } else {
    // 2. Fallback: Legacy admin token
    const legacyToken = getAdminToken();
    if (legacyToken) {
      config.headers.Authorization = `Bearer ${legacyToken}`;
    }
  }

  // 3. Also include x-api-key (for backward compatibility or public routes)
  const adminKey = getAdminApiKey();
  if (adminKey) {
    config.headers["x-api-key"] = adminKey;
  } else if (PUBLIC_X_API_KEY) {
    config.headers["x-api-key"] = PUBLIC_X_API_KEY;
  }

  return config;
});

// Updated response interceptor - handle JWT token expiration
http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    // Handle auth errors - clear tokens and redirect to login
    if (err.response?.status === 401) {
      setJwtToken(null);
      setAdminToken(null);

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(new Error("Authentication required. Please log in again."));
    }

    // Helpful message for 403 (likely wrong/missing credentials)
    if (err.response?.status === 403) {
      return Promise.reject(new Error("Forbidden - insufficient permissions or invalid credentials."));
    }

    const msg =
      (err.response?.data && (err.response.data.message || err.response.data.error)) ||
      err.message ||
      "Network error";
    return Promise.reject(new Error(msg));
  }
);

// Updated exports - adminToken now points to JWT token for api.ts compatibility
export const adminToken = { get: getJwtToken, set: setJwtToken };
export const adminApiKey = { get: getAdminApiKey, set: setAdminApiKey };
