import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  refreshAccessToken,
  clearTokens,
} from './authService';
import { resetToLogin } from '../navigation/NavigationService';


const BASE_URL = 'http://192.168.1.13:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Request interceptor: inyecta accessToken ---
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Helpers para cola de peticiones durante el refresh ---
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// --- Response interceptor: refresca token si 401 ---
api.interceptors.response.use(
  response => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalReq = error.config!;
    const status = error.response?.status;
    const msg = (error.response?.data as any)?.message;

    // Si es 403 por token expirado y aún no lo hemos reintentado:
    if (status === 403 && msg === 'Token inválido o expirado' && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalReq.headers!['Authorization'] = `Bearer ${token}`;
          return api(originalReq);
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalReq.headers!['Authorization'] = `Bearer ${newToken}`;
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        // aquí podrías resetear la navegación al Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  res => res,
  async error => {
    // … lógica de refresh detectando 403 …
    try {
      const newToken = await refreshAccessToken();
      // reintento…
    } catch (refreshError) {
      // 1) Limpia tokens
      await clearTokens();
      // 2) Fuerza reset al Login usando tu navigationRef
      resetToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;