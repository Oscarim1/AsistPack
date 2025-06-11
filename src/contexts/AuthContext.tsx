// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { loginUser, refreshAccessToken, clearTokens } from '../services/authService';

// Define Usuario interface here if not exported from elsewhere
interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface AuthContextType {
  initializing: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initializing, setInitializing] = useState(true);
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
        // Decodificamos el token para extraer user
        try {
          const decoded = jwtDecode<{
            id: number;
            nombre: string;
            rol: string;
          }>(storedAccess);
          setUser({
            id: decoded.id,
            nombre: decoded.nombre,
            rol: decoded.rol,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${storedAccess}`;
          setIsAuthenticated(true);
        } catch {
          // token corrupto: limpiamos
          await clearTokens();
          setIsAuthenticated(false);
        }
      }
      setInitializing(false);
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
      // si falla el refresh, hacemos logout
      await logout();
    }
  }, [accessToken, refreshToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken: newAccess, refreshToken: newRefresh } =
        await loginUser(email, password);
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      try {
        const decoded = jwtDecode<{
          id: number;
          nombre: string;
          rol: string;
        }>(newAccess);
        setUser({
          id: decoded.id,
          nombre: decoded.nombre,
          rol: decoded.rol,
        });
      } catch {
        setUser(null);
      }
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
    },
    []
  );

  const logout = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    await clearTokens();
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider
      value={{
        initializing,
        isAuthenticated,
        accessToken,
        refreshToken,
        user,
        login,
        logout,
      }}
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
