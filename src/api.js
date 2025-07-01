import axios from "axios";

const api = axios.create({
  baseURL: "https://6849109a45f4c0f5ee6fdc32.mockapi.io",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
