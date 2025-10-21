'use client';

import { useAccount } from 'wagmi';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  authMethod: 'email' | 'wallet';
  isAdmin: boolean;
  lastLogin: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Hook para gestión centralizada de autenticación
export function useAuth() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  // Verificar autenticación
  const checkAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const storedAuthMethod = localStorage.getItem('authMethod');
      
      if (storedAuthMethod === 'email') {
        // Usuario autenticado por email
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setAuthState({
            user: {
              id: userData.id || '',
              email: userData.email,
              nombre: userData.nombre,
              apellido: userData.apellido,
              authMethod: 'email',
              isAdmin: false,
              lastLogin: new Date().toISOString()
            },
            loading: false,
            error: null,
            isAuthenticated: true
          });
          return;
        }
      } else if (isConnected && address) {
        // Usuario autenticado por wallet
        const { data, error } = await supabase
          .from('registros_hackathon')
          .select('*')
          .eq('email', address)
          .single();

        if (error) {
          throw new Error('Usuario no encontrado');
        }

        setAuthState({
          user: {
            id: data.id || '',
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            authMethod: 'wallet',
            isAdmin: true, // Los usuarios con wallet son admins
            lastLogin: new Date().toISOString()
          },
          loading: false,
          error: null,
          isAuthenticated: true
        });
        return;
      }

      // No autenticado
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });

    } catch (error) {
      console.error('Error en autenticación:', error);
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Error de autenticación',
        isAuthenticated: false
      });
    }
  }, [address, isConnected]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('authMethod');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false
    });
    router.push('/login');
  }, [router]);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificar autenticación cuando cambie la conexión de wallet
  useEffect(() => {
    if (isConnected !== undefined) {
      checkAuth();
    }
  }, [isConnected, checkAuth]);

  return {
    ...authState,
    checkAuth,
    logout
  };
}

// Hook para protección de rutas
export function useAuthGuard(redirectTo: string = '/login') {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return { isAuthenticated, loading, user };
}

// Hook para verificar permisos de admin
export function useAdminGuard(redirectTo: string = '/dashboard') {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user && !user.isAdmin) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, user, router, redirectTo]);

  return { isAuthenticated, loading, user, isAdmin: user?.isAdmin || false };
}

// Utilidades de autenticación
export const authUtils = {
  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const authMethod = localStorage.getItem('authMethod');
    if (authMethod === 'email') {
      return !!localStorage.getItem('user');
    }
    return false;
  },

  // Obtener datos del usuario actual
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    
    const authMethod = localStorage.getItem('authMethod');
    if (authMethod === 'email') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          id: userData.id || '',
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          authMethod: 'email',
          isAdmin: false,
          lastLogin: new Date().toISOString()
        };
      }
    }
    return null;
  },

  // Logout
  logout: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('authMethod');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Logging de intentos de acceso
  logAccessAttempt: (success: boolean, details: string) => {
    console.log(`[AUTH] ${success ? 'SUCCESS' : 'FAILED'}: ${details}`);
    
    // En un entorno de producción, esto debería enviarse a un servicio de logging
    if (!success) {
      console.warn(`[AUTH] Failed access attempt: ${details}`);
    }
  }
};
