import axios from "axios";

// ✅ ADD THIS
export const BASE_URL = "https://edutest-backend-0r41.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = token;
  }
  return req;
});

export default API;