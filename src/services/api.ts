import { httpClient } from './httpClient';
import {
  refreshAccessToken,
  clearTokens,
} from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetToLogin } from '../navigation/NavigationService';
import type { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Extension of AxiosRequestConfig that allows skipping auth header injection.
 */
export interface AuthRequestConfig extends AxiosRequestConfig {
  /**
   * When true, the request interceptor will not attach the Authorization header.
   */
  skipAuth?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (err: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token!)));
  failedQueue = [];
};

// Request interceptor: attach access token
httpClient.interceptors.request.use(
  async (config: AuthRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh token on expired token errors
httpClient.interceptors.response.use(
  (res) => res,
  async (
    error: AxiosError & { config?: AuthRequestConfig & { _retry?: boolean } }
  ) => {
    const originalReq = error.config!;
    const status = error.response?.status;
    const msg = (error.response?.data as any)?.message;

    const tokenError =
      (status === 401 || status === 403) &&
      typeof msg === 'string' &&
      /token.*(expirado|expired|inv\u00e1lido)/i.test(msg);

    if (tokenError && !originalReq._retry) {
      originalReq._retry = true;
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalReq.headers!['Authorization'] = `Bearer ${token}`;
          return httpClient(originalReq);
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalReq.headers!['Authorization'] = `Bearer ${newToken}`;
        return httpClient(originalReq);
      } catch (err) {
        processQueue(err, null);
        await clearTokens();
        resetToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
