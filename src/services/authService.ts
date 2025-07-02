import { httpClient } from './httpClient';
import type { AuthRequestConfig } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  // add other properties if needed
}
export interface RefreshResponse {
  accessToken: string;
  // add other properties if needed
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', {
    correo: email,
    password,
  });
  await AsyncStorage.multiSet([
    ['accessToken', data.accessToken],
    ['refreshToken', data.refreshToken],
  ]);
  return data;
};

export const refreshAccessToken = async (): Promise<string> => {
  const stored = await AsyncStorage.getItem('refreshToken');
  if (!stored) throw new Error('No hay refreshToken disponible');
  const { data } = await httpClient.post<RefreshResponse>(
    '/auth/refresh',
    { refreshToken: stored },
    { skipAuth: true } as AuthRequestConfig
  );
  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};

export const clearTokens = () =>
  AsyncStorage.multiRemove(['accessToken', 'refreshToken']);

// Elimina TODO import api from './api'
