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
  // Sends/receives the HttpOnly JWT cookie on every request instead of an
  // Authorization header. Requires the backend CORS config to set
  // `credentials: true` and to not use a wildcard origin.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === UNAUTHORIZED || error.code === "ERR_NETWORK") {
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;