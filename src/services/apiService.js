import axios from "axios";

const API = axios.create({
  baseURL: "https://edutest-backend-0r41.onrender.com/api",
  // baseURL:"http://localhost:5000/api",
});

// ✅ ADD THIS (auto attach token)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = token;
  }

  return req;
});

export default API;