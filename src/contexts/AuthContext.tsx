import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; // Axios configurado con baseURL
import { loginUser, refreshAccessToken, clearTokens, Usuario } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carga inicial de tokens y usuario desde AsyncStorage
  useEffect(() => {
    (async () => {
      const [storedAccess, storedRefresh] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);
      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        // Decode minimal user info del token
        try {
          const decoded = jwtDecode<{ id: number; nombre: string; rol: string }>(storedAccess);
          setUser({ id: decoded.id, nombre: decoded.nombre, rol: decoded.rol });
        } catch {
          setUser(null);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${storedAccess}`;
        setIsAuthenticated(true);
      }
    })();
  }, []);

  // Escucha AppState para refrescar tokens al volver al foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [accessToken, refreshToken]);

  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      maybeRefreshTokens();
    }
  };

  const isTokenExpired = (token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      // Considera expirado con un margen de 1 minuto
      return Date.now() >= exp * 1000 - 60 * 1000;
    } catch {
      return true;
    }
  };

  const maybeRefreshTokens = useCallback(async () => {
    if (!refreshToken) return;
    if (accessToken && !isTokenExpired(accessToken)) return;
    try {
      const newAccess = await refreshAccessToken();
      setAccessToken(newAccess);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      setIsAuthenticated(true);
    } catch {
      // Si falla el refresh, hace logout
      await logout();
    }
  }, [accessToken, refreshToken]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken: newAccess, refreshToken: newRefresh, usuario } = await loginUser(email, password);
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    setUser(usuario);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
  }, []);

  const logout = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    clearTokens();
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, refreshToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
