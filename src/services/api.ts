import axios from "axios";

export const UNAUTHORIZED = 401;
export const OK = 200;

export interface IErrorResponse {
  success: false,
  errors: { msj: string }[]
}
export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === UNAUTHORIZED) {
      localStorage.removeItem("id_token");
      delete api.defaults.headers.common["Authorization"];
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;