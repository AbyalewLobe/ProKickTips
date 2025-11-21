import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://prokicktips-backend.onrender.com/api",
  withCredentials: true,
});

export default api;
