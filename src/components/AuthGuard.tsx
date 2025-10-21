'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, authUtils } from '../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  redirectTo = '/login',
  fallback 
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user, error } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Si no requiere autenticación, renderizar siempre
    if (!requireAuth) {
      setShouldRender(true);
      return;
    }

    // Si requiere autenticación pero no está autenticado
    if (!isAuthenticated) {
      authUtils.logAccessAttempt(false, `Unauthenticated access attempt to ${window.location.pathname}`);
      router.push(redirectTo);
      return;
    }

    // Si requiere admin pero no es admin
    if (requireAdmin && user && !user.isAdmin) {
      authUtils.logAccessAttempt(false, `Non-admin access attempt to ${window.location.pathname} by ${user.email}`);
      router.push('/dashboard');
      return;
    }

    // Si todo está bien, renderizar
    authUtils.logAccessAttempt(true, `Authenticated access to ${window.location.pathname} by ${user?.email || 'unknown'}`);
    setShouldRender(true);
  }, [isAuthenticated, loading, user, requireAuth, requireAdmin, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay uno
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl mb-2">Error de Autenticación</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Si no debe renderizar, no mostrar nada (se está redirigiendo)
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}

// Componente específico para rutas que requieren autenticación
export function ProtectedRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

// Componente específico para rutas de admin
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

// Componente para rutas públicas (no requieren autenticación)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
}
