// api.ts
import axios from "axios";

export const OK = 200;
export const CREATED = 201;
export const UNAUTHORIZED = 401;

export interface ISuccessfulDelete {
  successful: true;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const canUseStorage = typeof window !== "undefined";

export const tokenManager = {
  getToken: (): string | null => {
    if (!canUseStorage) return null;
    return localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
  },

  setToken: (token: string, rememberMe: boolean = false): void => {
    if (!canUseStorage) return;
    if (rememberMe) {
      localStorage.setItem("id_token", token);
    } else {
      sessionStorage.setItem("id_token", token);
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeToken: (): void => {
    if (!canUseStorage) return;
    localStorage.removeItem("id_token");
    sessionStorage.removeItem("id_token");
    delete api.defaults.headers.common["Authorization"];
  },

  hasToken: (): boolean => {
    if (!canUseStorage) return false;
    return !!(localStorage.getItem("id_token") || sessionStorage.getItem("id_token"));
  },

  isTokenPersistent: (): boolean => {
    if (!canUseStorage) return false;
    return !!localStorage.getItem("id_token");
  }
};

const persistentToken = canUseStorage ? localStorage.getItem("id_token") : null;
if (persistentToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${persistentToken}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === UNAUTHORIZED || error.code === "ERR_NETWORK") {
      tokenManager.removeToken();
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;