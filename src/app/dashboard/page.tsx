'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  FolderOpen, 
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  universidad?: string;
  carrera?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  experiencia: string;
  equipo: string;
  nombreEquipo?: string;
  proyecto?: string;
  motivacion: string;
  created_at: string;
}

interface ProjectData {
  id: string;
  titulo: string;
  descripcion: string;
  problema: string;
  solucion: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  video_url: string;
  imagenes: string[];
  estado: 'borrador' | 'enviado';
  email_participante: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [authMethod, setAuthMethod] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      // Verificar método de autenticación
      const storedAuthMethod = localStorage.getItem('authMethod');

      if (storedAuthMethod === 'email') {
        // Usuario autenticado por email
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          // Redirigir a login si no hay datos de usuario
          window.location.href = '/login';
          return;
        }
      } else {
        // Usuario autenticado por wallet (admin)
        if (!isConnected || !address) {
          window.location.href = '/login';
          return;
        }

        const { data, error } = await supabase
          .from('registros_hackathon')
          .select('*')
          .eq('email', address)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          window.location.href = '/login';
          return;
        }

        setUserData(data);
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  const fetchProjectData = useCallback(async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('email_participante', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project:', error);
        return;
      }

      if (data) {
        console.log('Proyecto encontrado:', data);
        setProjectData(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData) {
      fetchProjectData(userData.email);
    }
  }, [userData, fetchProjectData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No se encontraron datos</h2>
        <p className="text-gray-400">Por favor, verifica tu registro en el hackathon.</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Estado del Proyecto',
      value: projectData ? (projectData.estado === 'enviado' ? 'Enviado' : 'Borrador') : 'No Iniciado',
      icon: FolderOpen,
      color: projectData ? (projectData.estado === 'enviado' ? 'text-green-400' : 'text-yellow-400') : 'text-gray-400'
    },
    {
      name: 'Tipo de Participación',
      value: userData.equipo === 'individual' ? 'Individual' : 'Equipo',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      name: 'Nivel de Experiencia',
      value: userData.experiencia,
      icon: Award,
      color: 'text-purple-400'
    },
    {
      name: 'Días Restantes',
      value: '15 días',
      icon: Calendar,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          ¡Hola, {userData.nombre}! 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Bienvenido al dashboard del COD3.0 Hackathon
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/profile"
            className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-400 mr-3" />
            <div>
              <h3 className="font-semibold text-white">Completar Perfil</h3>
              <p className="text-sm text-gray-400">Actualiza tu información personal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/project"
            className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FolderOpen className="h-6 w-6 text-green-400 mr-3" />
            <div>
              <h3 className="font-semibold text-white">Subir Proyecto</h3>
              <p className="text-sm text-gray-400">Comparte tu proyecto con el mundo</p>
            </div>
          </Link>

          <div className="flex items-center p-4 bg-gray-800 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400 mr-3" />
            <div>
              <h3 className="font-semibold text-white">Ver Rankings</h3>
              <p className="text-sm text-gray-400">Próximamente disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Estado de tu Proyecto</h2>
          {projectData && (
            <Link
              href="/dashboard/project"
              className="text-green-400 hover:text-green-300 text-sm font-medium"
            >
              Editar Proyecto →
            </Link>
          )}
        </div>
        
        {projectData ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              projectData.estado === 'enviado' 
                ? 'bg-green-500/20 border-green-400/30' 
                : 'bg-yellow-500/20 border-yellow-400/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${
                  projectData.estado === 'enviado' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {projectData.estado === 'enviado' ? 'Proyecto Enviado' : 'Proyecto en Borrador'}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  projectData.estado === 'enviado' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white'
                }`}>
                  {projectData.estado === 'enviado' ? 'Enviado' : 'Borrador'}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{projectData.titulo}</h4>
              <p className="text-gray-300 mb-3">{projectData.descripcion}</p>
              
              {projectData.tech_stack && projectData.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {projectData.tech_stack.slice(0, 5).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {projectData.tech_stack.length > 5 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      +{projectData.tech_stack.length - 5} más
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                {projectData.github_url && (
                  <a
                    href={projectData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    GitHub
                  </a>
                )}
                {projectData.demo_url && (
                  <a
                    href={projectData.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300"
                  >
                    Demo
                  </a>
                )}
                <span className="text-gray-500">
                  Actualizado: {new Date(projectData.updated_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No has subido un proyecto aún</h3>
            <p className="text-gray-500 mb-4">Comienza a trabajar en tu idea y compártela con nosotros</p>
            <Link
              href="/dashboard/project"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Subir Proyecto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
