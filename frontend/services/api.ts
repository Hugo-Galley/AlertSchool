// Client axios : injecte automatiquement le token JWT sur chaque requête.
import axios from "axios";
import { API_BASE_URL } from "../constants/config";
import { storage } from "./storage";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
