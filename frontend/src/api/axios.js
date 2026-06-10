import axios from "axios";

// In production: VITE_API_URL is the Render backend URL (e.g. https://talentflow.onrender.com)
// In local dev: use relative /api so Vite proxy forwards to localhost:5000 (no CORS needed)
const baseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

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
