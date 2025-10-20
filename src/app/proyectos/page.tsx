'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Grid, 
  List, 
  ExternalLink, 
  Github, 
  Users, 
  Calendar,
  Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
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
  // Datos del participante
  participante_nombre?: string;
  participante_apellido?: string;
  participante_foto?: string;
  equipo_nombre?: string;
}

const TECH_STACK_COLORS = {
  'React': 'bg-blue-100 text-blue-800',
  'Next.js': 'bg-black text-white',
  'Vue.js': 'bg-green-100 text-green-800',
  'Angular': 'bg-red-100 text-red-800',
  'Node.js': 'bg-green-100 text-green-800',
  'Python': 'bg-yellow-100 text-yellow-800',
  'JavaScript': 'bg-yellow-100 text-yellow-800',
  'TypeScript': 'bg-blue-100 text-blue-800',
  'Solidity': 'bg-gray-100 text-gray-800',
  'Web3': 'bg-purple-100 text-purple-800',
  'DeFi': 'bg-orange-100 text-orange-800',
  'AI': 'bg-pink-100 text-pink-800',
  'Machine Learning': 'bg-indigo-100 text-indigo-800',
  'Blockchain': 'bg-gray-100 text-gray-800',
  'Ethereum': 'bg-gray-100 text-gray-800',
  'Bitcoin': 'bg-orange-100 text-orange-800',
  'default': 'bg-gray-100 text-gray-800'
};

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'name'>('recent');

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      
      // Obtener proyectos con datos del participante
      const { data, error } = await supabase
        .from('proyectos')
        .select(`
          *,
          registros_hackathon!proyectos_email_participante_fkey (
            nombre,
            apellido,
            foto_perfil,
            equipo_id,
            equipos!registros_hackathon_equipo_id_fkey (nombre)
          )
        `)
        .eq('estado', 'enviado')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proyectos:', error);
        return;
      }

      // Transformar datos
      const proyectosData = data.map(proyecto => ({
        ...proyecto,
        participante_nombre: proyecto.registros_hackathon?.nombre,
        participante_apellido: proyecto.registros_hackathon?.apellido,
        participante_foto: proyecto.registros_hackathon?.foto_perfil,
        equipo_nombre: proyecto.registros_hackathon?.equipos?.nombre
      }));

      setProyectos(proyectosData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = selectedTech.length === 0 || 
                       selectedTech.some(tech => proyecto.tech_stack.includes(tech));
    
    return matchesSearch && matchesTech;
  });

  const sortedProyectos = [...filteredProyectos].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.titulo.localeCompare(b.titulo);
      case 'popular':
        return b.created_at.localeCompare(a.created_at);
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const allTechStack = Array.from(new Set(proyectos.flatMap(p => p.tech_stack))).sort();

  const getTechColor = (tech: string) => {
    return TECH_STACK_COLORS[tech as keyof typeof TECH_STACK_COLORS] || TECH_STACK_COLORS.default;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-400 mb-2">Proyectos del Hackathon</h1>
              <p className="text-gray-400">
                {proyectos.length} proyectos enviados por la comunidad
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Link
                href="/dashboard/project"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Award className="h-4 w-4 mr-2" />
                Subir Mi Proyecto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Tech Stack Filter */}
            <div className="flex flex-wrap gap-2">
              {allTechStack.slice(0, 10).map(tech => (
                <button
                  key={tech}
                  onClick={() => {
                    setSelectedTech(prev => 
                      prev.includes(tech) 
                        ? prev.filter(t => t !== tech)
                        : [...prev, tech]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTech.includes(tech)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
              {allTechStack.length > 10 && (
                <span className="px-3 py-1 text-gray-400 text-sm">
                  +{allTechStack.length - 10} más
                </span>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recientes' | 'populares' | 'alfabetico')}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="recent">Más Recientes</option>
                <option value="popular">Más Populares</option>
                <option value="name">Por Nombre</option>
              </select>

              <div className="flex border border-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-600' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {sortedProyectos.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay proyectos aún</h3>
            <p className="text-gray-500 mb-6">Sé el primero en subir tu proyecto al hackathon</p>
            <Link
              href="/dashboard/project"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Award className="h-4 w-4 mr-2" />
              Subir Mi Proyecto
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedProyectos.map((proyecto, index) => (
              <motion.div
                key={proyecto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Project Image */}
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} relative bg-gray-800`}>
                  {proyecto.imagenes.length > 0 ? (
                    <Image
                      src={proyecto.imagenes[0]}
                      alt={proyecto.titulo}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Award className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      Enviado
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Author Info */}
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      {proyecto.participante_foto ? (
                        <Image
                          src={proyecto.participante_foto}
                          alt="Avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <Users className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {proyecto.participante_nombre} {proyecto.participante_apellido}
                      </p>
                      {proyecto.equipo_nombre && (
                        <p className="text-xs text-gray-400">Equipo: {proyecto.equipo_nombre}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {proyecto.titulo}
                  </h3>

                  {/* Project Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {proyecto.descripcion}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proyecto.tech_stack.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className={`px-2 py-1 rounded text-xs ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {proyecto.tech_stack.length > 4 && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                        +{proyecto.tech_stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 mb-4">
                    {proyecto.github_url && (
                      <a
                        href={proyecto.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}
                    {proyecto.demo_url && (
                      <a
                        href={proyecto.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span className="text-sm">Demo</span>
                      </a>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(proyecto.created_at)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
