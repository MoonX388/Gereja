import axios from "axios";

const api = axios.create({
  baseURL:
    "https://super-duper-space-bassoon-5g4j6p44ww6w3p69-3001.app.github.dev/",
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
