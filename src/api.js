import axios from "axios";

// ✅ Create axios instance with base URL
export const api = axios.create({
  baseURL: "https://job-portal-backend-deploy.onrender.com/api", // deployed backend URL
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
