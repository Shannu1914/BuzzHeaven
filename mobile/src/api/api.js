import axios from "axios";
import { API_BASE } from "../config";

const api = axios.create({ baseURL: API_BASE });

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function getFeed(token) {
  return api.get("/posts", { headers: { Authorization: `Bearer ${token}` } });
}

export default api;
