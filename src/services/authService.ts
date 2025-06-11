// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AxiosInstance } from 'axios';

let client: AxiosInstance;

/**
 * Debe llamarse una única vez al iniciar la app,
 * pasándole la instancia configurada en api.ts
 */
export function initAuthService(axiosInstance: AxiosInstance) {
  client = axiosInstance;
}

// tipos de respuesta...
export interface LoginResponse { /* ... */ }
export interface RefreshResponse { /* ... */ }

/** LOGIN */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await client.post<LoginResponse>('/auth/login', {
    correo: email,
    password,
  });
  await AsyncStorage.multiSet([
    ['accessToken', data.accessToken],
    ['refreshToken', data.refreshToken],
  ]);
  return data;
};

/** REFRESH */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No hay refreshToken');
  const { data } = await client.post<RefreshResponse>('/auth/refresh', {
    refreshToken,
  });
  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};

export const clearTokens = () =>
  AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
