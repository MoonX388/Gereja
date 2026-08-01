import axios from "axios";

const api = axios.create({
  baseURL:
    "https://api2.gerejapintar.id", // Ganti dengan URL server Anda
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
