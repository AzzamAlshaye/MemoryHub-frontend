// src/api/client.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_PRIMARY_API_URL 
  // || "http://localhost:3000";

export const primaryAPI = axios.create({ baseURL: API_BASE });

primaryAPI.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token) {
    // if they already saved "Bearer abc123", use it as-is;
    // otherwise prefix it.
    if (!token.startsWith("Bearer ")) {
      token = `Bearer ${token}`;
    }
    config.headers = config.headers || {};
    config.headers.Authorization = token;
  }
  return config;
});
