'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Crown, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink,
  Calendar,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Equipo {
  id: string;
  nombre: string;
  descripcion: string;
  lider_email: string;
  max_miembros: number;
  estado: 'activo' | 'inactivo' | 'completo';
  banner_url?: string;
  created_at: string;
  miembros_actuales: number;
  miembros_activos: number;
  invitaciones_pendientes: number;
}

interface MiembroEquipo {
  id: string;
  equipo_id: string;
  email_miembro: string;
  rol: 'lider' | 'miembro';
  estado_invitacion: 'pendiente' | 'aceptada' | 'rechazada';
  invitado_por: string;
  created_at: string;
  miembro_nombre?: string;
  miembro_apellido?: string;
  miembro_foto?: string;
  miembro_github?: string;
  miembro_linkedin?: string;
  miembro_portfolio?: string;
}

interface ProyectoEquipo {
  id: string;
  titulo: string;
  descripcion: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  imagenes: string[];
  estado: 'borrador' | 'enviado';
  created_at: string;
}

export default function EquipoDetailPage() {
  const params = useParams();
  const equipoId = params.id as string;
  
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [proyectos, setProyectos] = useState<ProyectoEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedAuthMethod = localStorage.getItem('authMethod');
    if (storedAuthMethod === 'email') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email);
      }
    }
    fetchEquipoData();
  }, [equipoId]);

  const fetchEquipoData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del equipo
      const { data: equipoData, error: equipoError } = await supabase
        .from('estadisticas_equipos')
        .select('*')
        .eq('id', equipoId)
        .single();

      if (equipoError) {
        console.error('Error fetching equipo:', equipoError);
        return;
      }

      setEquipo(equipoData);

      // Obtener miembros del equipo
      const { data: miembrosData, error: miembrosError } = await supabase
        .from('equipo_miembros')
        .select(`
          *,
          registros_hackathon!equipo_miembros_email_miembro_fkey (
            nombre,
            apellido,
            foto_perfil,
            github,
            linkedin,
            portfolio
          )
        `)
        .eq('equipo_id', equipoId);

      if (!miembrosError && miembrosData) {
        const miembrosTransformados = miembrosData.map(miembro => ({
          ...miembro,
          miembro_nombre: miembro.registros_hackathon?.nombre,
          miembro_apellido: miembro.registros_hackathon?.apellido,
          miembro_foto: miembro.registros_hackathon?.foto_perfil,
          miembro_github: miembro.registros_hackathon?.github,
          miembro_linkedin: miembro.registros_hackathon?.linkedin,
          miembro_portfolio: miembro.registros_hackathon?.portfolio
        }));
        setMiembros(miembrosTransformados);
      }

      // Obtener proyectos del equipo
      const { data: proyectosData, error: proyectosError } = await supabase
        .from('proyectos')
        .select('*')
        .eq('equipo_id', equipoId)
        .eq('estado', 'enviado')
        .order('created_at', { ascending: false });

      if (!proyectosError && proyectosData) {
        setProyectos(proyectosData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Equipo no encontrado</h1>
          <p className="text-gray-400 mb-6">El equipo que buscas no existe o ha sido eliminado.</p>
          <Link
            href="/dashboard/equipos"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Equipos
          </Link>
        </div>
      </div>
    );
  }

  const miembrosActivos = miembros.filter(m => m.estado_invitacion === 'aceptada');
  const esLider = equipo.lider_email === userEmail;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/dashboard/equipos"
                className="flex items-center text-gray-400 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Equipos
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-green-400">{equipo.nombre}</h1>
                <p className="text-gray-400 mt-1">Equipo del Hackathon</p>
              </div>
            </div>
            {esLider && (
              <Link
                href={`/dashboard/equipos?edit=${equipo.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Gestionar Equipo
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner y Info Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-8"
        >
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-green-600 to-blue-600 relative">
            {equipo.banner_url ? (
              <Image
                src={equipo.banner_url}
                alt={`Banner de ${equipo.nombre}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Users className="h-16 w-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Info del Equipo */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{equipo.nombre}</h2>
                <p className="text-gray-400 mb-4">{equipo.descripcion}</p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{equipo.miembros_activos}/{equipo.max_miembros} miembros</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Creado el {formatDate(equipo.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  equipo.estado === 'activo' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {equipo.estado === 'activo' ? 'Activo' : equipo.estado}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Miembros del Equipo */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Miembros del Equipo ({miembrosActivos.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {miembrosActivos.map((miembro) => (
                  <div key={miembro.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        {miembro.miembro_foto ? (
                          <Image
                            src={miembro.miembro_foto}
                            alt="Avatar"
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <Users className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {miembro.miembro_nombre} {miembro.miembro_apellido}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center">
                          {miembro.rol === 'lider' ? (
                            <>
                              <Crown className="h-4 w-4 mr-1 text-yellow-400" />
                              Líder del Equipo
                            </>
                          ) : (
                            'Miembro'
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {/* Enlaces sociales */}
                    <div className="flex items-center gap-3">
                      {miembro.miembro_github && (
                        <a
                          href={miembro.miembro_github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {miembro.miembro_linkedin && (
                        <a
                          href={miembro.miembro_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {miembro.miembro_portfolio && (
                        <a
                          href={miembro.miembro_portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Proyectos del Equipo */}
            {proyectos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Proyectos del Equipo</h3>
                
                <div className="space-y-4">
                  {proyectos.map((proyecto) => (
                    <div key={proyecto.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white">{proyecto.titulo}</h4>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          Enviado
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {proyecto.descripcion}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {proyecto.tech_stack.slice(0, 4).map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {proyecto.tech_stack.length > 4 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            +{proyecto.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {proyecto.github_url && (
                          <a
                            href={proyecto.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                          >
                            <Github className="h-4 w-4 mr-1" />
                            GitHub
                          </a>
                        )}
                        {proyecto.demo_url && (
                          <a
                            href={proyecto.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Estadísticas del Equipo</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Miembros Activos</span>
                  <span className="text-white font-semibold">{equipo.miembros_activos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Capacidad Máxima</span>
                  <span className="text-white font-semibold">{equipo.max_miembros}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Proyectos Enviados</span>
                  <span className="text-white font-semibold">{proyectos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <span className={`font-semibold ${
                    equipo.estado === 'activo' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {equipo.estado === 'activo' ? 'Activo' : equipo.estado}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
