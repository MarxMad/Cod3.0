'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../lib/auth';

interface TokenRefreshOptions {
  refreshInterval?: number; // en milisegundos
  onRefresh?: () => void;
  onExpired?: () => void;
}

export function useTokenRefresh(options: TokenRefreshOptions = {}) {
  const { refreshInterval = 5 * 60 * 1000, onRefresh, onExpired } = options; // 5 minutos por defecto
  const { user, isAuthenticated, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(Date.now());

  const refreshToken = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      // Verificar si el token/sesión sigue siendo válida
      const authMethod = localStorage.getItem('authMethod');
      
      if (authMethod === 'email') {
        // Para usuarios de email, verificar que los datos siguen en localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('Sesión expirada');
        }
        
        // Verificar que no han pasado más de 24 horas desde el último login
        const userData = JSON.parse(storedUser);
        const lastLogin = new Date(userData.lastLogin || 0);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          throw new Error('Sesión expirada por tiempo');
        }
        
        // Actualizar timestamp
        userData.lastLogin = now.toISOString();
        localStorage.setItem('user', JSON.stringify(userData));
        
      } else if (authMethod === 'wallet') {
        // Para usuarios de wallet, verificar que la wallet sigue conectada
        // Esto se maneja automáticamente por wagmi
        console.log('Wallet session refreshed');
      }
      
      lastRefreshRef.current = Date.now();
      onRefresh?.();
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      onExpired?.();
      logout();
    }
  }, [isAuthenticated, user, logout, onRefresh, onExpired]);

  // Configurar refresh automático
  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Configurar intervalo de refresh
    intervalRef.current = setInterval(refreshToken, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, refreshToken, refreshInterval]);

  // Refresh manual
  const manualRefresh = useCallback(() => {
    refreshToken();
  }, [refreshToken]);

  // Verificar si la sesión está próxima a expirar
  const isSessionExpiringSoon = useCallback(() => {
    const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
    const timeUntilExpiry = refreshInterval - timeSinceLastRefresh;
    return timeUntilExpiry < 60000; // 1 minuto antes de expirar
  }, [refreshInterval]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    refreshToken: manualRefresh,
    isSessionExpiringSoon,
    lastRefresh: lastRefreshRef.current
  };
}
