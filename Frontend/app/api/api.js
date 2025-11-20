import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://pro-kick-tips-qzee8qrrf-abyalews-projects.vercel.app/api",
  withCredentials: true,
});

export default api;
