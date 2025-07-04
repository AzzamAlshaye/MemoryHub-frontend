import axios from "axios";

// pick up from env or fallback:
const API_BASE = "https://final-project-backend-playground.onrender.com";
// process.env.REACT_APP_PRIMARY_API_URL ||

export const primaryAPI = axios.create({
  baseURL: API_BASE,
});

// every request: if you have a token, add it
primaryAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
