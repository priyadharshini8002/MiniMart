// services/api.js
// One Axios instance used by the whole app.
// It automatically adds the login token to every request.

import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxied to the backend by vite.config.js
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("minimart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gets a readable message out of an Axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  (error?.request ? "Cannot reach the server. Is the backend running?" : "Something went wrong");

export default api;
