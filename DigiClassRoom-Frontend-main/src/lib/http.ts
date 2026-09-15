import axios from "axios";

// Resolve API base URL precedence:
// 1. `VITE_API_BASE_URL` (set in .env or environment)
// 2. If running in development mode, `http://localhost:3001`
// 3. Otherwise the stable production backend URL
const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const envUrl = viteEnv?.VITE_API_BASE_URL;
const isDev = viteEnv?.MODE === 'development';
const DEFAULT_BACKEND = 'https://digiclassroom-backend.netlify.app';
const BASE_URL = envUrl || (isDev ? 'http://localhost:3001' : DEFAULT_BACKEND);

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const headers: Record<string, string> = { ...(config.headers as any) };
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers as any;
  }
  return config;
});
