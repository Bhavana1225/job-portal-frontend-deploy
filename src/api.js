import axios from "axios";

export const api = axios.create({
  baseURL: "https://job-portal-backend-deploy.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
