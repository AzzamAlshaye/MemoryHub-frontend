// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://final-project-backend-playground.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export default api;
