import axios from "axios";

// Check if a live environment variable exists, otherwise fall back to your local server
const baseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL: baseUrl,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
