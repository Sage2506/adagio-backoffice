import axios from "axios";

export const OK = 200;
export const CREATED = 201
export const UNAUTHORIZED = 401;

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
    if (error.code === "ERR_NETWORK") {
      localStorage.removeItem("id_token");
      delete api.defaults.headers.common["Authorization"];
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

const initialToken = localStorage.getItem("id_token");
if (initialToken) {
  api.defaults.headers.common['Authorization'] = initialToken;
}
export default api;