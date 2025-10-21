'use client';

import { useState } from 'react';
import { 
  Home, 
  User, 
  FolderOpen, 
  Users,
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/AuthGuard';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { refreshToken, isSessionExpiringSoon } = useTokenRefresh({
    onRefresh: () => console.log('Sesión refrescada'),
    onExpired: () => console.log('Sesión expirada')
  });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mi Perfil', href: '/dashboard/profile', icon: User },
    { name: 'Mi Proyecto', href: '/dashboard/project', icon: FolderOpen },
    { name: 'Equipos', href: '/dashboard/equipos', icon: Users },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">COD3.0</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 border-r border-gray-700 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-xl font-bold text-white">COD3.0</h2>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="text-sm text-gray-300">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span>{user.nombre} {user.apellido}</span>
                    {user.isAdmin && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                    {isSessionExpiringSoon() && (
                      <button
                        onClick={refreshToken}
                        className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs hover:bg-yellow-500/30"
                        title="Sesión próxima a expirar - Click para refrescar"
                      >
                        ⏰
                      </button>
                    )}
                  </div>
                ) : (
                  <span>No autenticado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
