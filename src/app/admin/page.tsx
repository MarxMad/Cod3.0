'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';
import { Download, FileText, Users, FolderOpen, Database } from 'lucide-react';

interface Registro {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  experiencia: string;
  equipo: string;
  nombreEquipo?: string;
  universidad?: string;
  carrera?: string;
  created_at: string;
}

interface Proyecto {
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
  estado: string;
  email_participante: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistros, setSelectedRegistros] = useState<string[]>([]);
  const [emailType, setEmailType] = useState('welcome');
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [sending, setSending] = useState(false);
  const [queueStatus, setQueueStatus] = useState({ pending: 0, processing: false, totalProcessed: 'N/A' });
  // Filtros para futuras funcionalidades
  // const [filters, setFilters] = useState({
  //   experiencia: '',
  //   equipo: '',
  //   universidad: '',
  //   fecha_desde: '',
  //   fecha_hasta: ''
  // });
  const [activeTab, setActiveTab] = useState('participantes');

  // Verificar si el usuario es admin
  const checkAdminStatus = useCallback(async () => {
    if (!isConnected || !address) return;
    
    try {
      // Usar la instancia de supabase importada
      const { data, error } = await supabase
        .from('registros_hackathon')
        .select('*')
        .eq('email', address)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return;
      }

      if (data) {
        setIsAuthenticated(true);
        // Cargar datos después de autenticación
        loadAllData();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  // Cargar todos los datos
  const loadAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      // Usar la instancia de supabase importada
      
      // Cargar registros
      const { data: registrosData, error: registrosError } = await supabase
        .from('registros_hackathon')
        .select('*')
        .order('created_at', { ascending: false });

      if (registrosError) {
        console.error('Error cargando registros:', registrosError);
      } else {
        setRegistros(registrosData || []);
      }

      // Cargar proyectos
      const { data: proyectosData, error: proyectosError } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

      if (proyectosError) {
        console.error('Error cargando proyectos:', proyectosError);
      } else {
        setProyectos(proyectosData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar estado de la cola
  const loadQueueStatus = async () => {
    try {
      const response = await fetch('/api/email-queue-status');
      const data = await response.json();
      
      if (data.success) {
        setQueueStatus(data.queueStatus);
      }
    } catch (error) {
      console.error('Error cargando estado de la cola:', error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      checkAdminStatus();
    }
  }, [isConnected, address, checkAdminStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      loadQueueStatus();
      
      // Actualizar estado de la cola cada 5 segundos
      const interval = setInterval(loadQueueStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Seleccionar/deseleccionar todos
  const toggleSelectAll = () => {
    if (selectedRegistros.length === registros.length) {
      setSelectedRegistros([]);
    } else {
      setSelectedRegistros(registros.map(r => r.id));
    }
  };

  // Enviar emails
  const sendEmails = async () => {
    if (selectedRegistros.length === 0) {
      alert('Selecciona al menos un destinatario');
      return;
    }

    try {
      setSending(true);
      
      const recipients = registros.filter(r => selectedRegistros.includes(r.id));
      const customData = emailType === 'custom' ? {
        subject: customSubject,
        content: customContent
      } : {};

      const response = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType,
          recipients,
          customData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Emails agregados a la cola: ${data.summary.queued} emails. Los emails se enviarán automáticamente respetando el rate limit de Resend.`);
        setSelectedRegistros([]);
        loadQueueStatus(); // Actualizar estado de la cola
      } else {
        alert('Error enviando emails: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error enviando emails');
    } finally {
      setSending(false);
    }
  };

  // Descargar datos como CSV
  const downloadCSV = (data: unknown[], filename: string) => {
    if (data.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = (row as Record<string, unknown>)[header];
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          return `"${value || ''}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar todos los registros
  const downloadRegistros = () => {
    downloadCSV(registros, `registros_hackathon_${new Date().toISOString().split('T')[0]}`);
  };

  // Descargar todos los proyectos
  const downloadProyectos = () => {
    downloadCSV(proyectos, `proyectos_hackathon_${new Date().toISOString().split('T')[0]}`);
  };

  // Descargar datos completos
  const downloadAllData = () => {
    const combinedData = registros.map(registro => {
      const proyecto = proyectos.find(p => p.email_participante === registro.email);
      return {
        ...registro,
        proyecto_titulo: proyecto?.titulo || '',
        proyecto_descripcion: proyecto?.descripcion || '',
        proyecto_estado: proyecto?.estado || '',
        proyecto_github: proyecto?.github_url || '',
        proyecto_demo: proyecto?.demo_url || '',
        proyecto_tech_stack: proyecto?.tech_stack?.join('; ') || '',
        proyecto_created_at: proyecto?.created_at || ''
      };
    });
    
    downloadCSV(combinedData, `datos_completos_hackathon_${new Date().toISOString().split('T')[0]}`);
  };

  // Si no está conectado, mostrar pantalla de login
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Database className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Panel de Administración
            </h2>
            <p className="text-gray-400">
              Conecta tu wallet para acceder al panel
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-400">
              No tienes permisos de administrador
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-green-400 mb-2">
                🛠️ Panel de Administración
              </h1>
              <p className="text-gray-300">
                Gestiona participantes, proyectos y envía comunicaciones
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Conectado como:</div>
              <div className="text-green-400 font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('participantes')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'participantes'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="inline h-4 w-4 mr-2" />
              Participantes ({registros.length})
            </button>
            <button
              onClick={() => setActiveTab('proyectos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'proyectos'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderOpen className="inline h-4 w-4 mr-2" />
              Proyectos ({proyectos.length})
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'emails'
                  ? 'bg-green-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Emails
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'participantes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Download Actions */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-green-400 mb-4">📊 Descargar Datos</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={downloadRegistros}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Registros CSV
                </button>
                <button
                  onClick={downloadProyectos}
                  className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Proyectos CSV
                </button>
                <button
                  onClick={downloadAllData}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Datos Completos
                </button>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-green-400 mb-4">
                👥 Participantes ({registros.length})
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
                  <p className="mt-4 text-gray-300">Cargando registros...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3">Nombre</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Experiencia</th>
                        <th className="text-left p-3">Participación</th>
                        <th className="text-left p-3">Universidad</th>
                        <th className="text-left p-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registros.map((registro) => (
                        <tr key={registro.id} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="p-3">{registro.nombre} {registro.apellido}</td>
                          <td className="p-3">{registro.email}</td>
                          <td className="p-3 capitalize">{registro.experiencia}</td>
                          <td className="p-3">{registro.equipo === 'equipo' ? 'Equipo' : 'Individual'}</td>
                          <td className="p-3">{registro.universidad || '-'}</td>
                          <td className="p-3">{new Date(registro.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'proyectos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Projects Table */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-green-400 mb-4">
                📁 Proyectos ({proyectos.length})
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
                  <p className="mt-4 text-gray-300">Cargando proyectos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3">Título</th>
                        <th className="text-left p-3">Estado</th>
                        <th className="text-left p-3">Tech Stack</th>
                        <th className="text-left p-3">GitHub</th>
                        <th className="text-left p-3">Demo</th>
                        <th className="text-left p-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proyectos.map((proyecto) => (
                        <tr key={proyecto.id} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="p-3 font-medium">{proyecto.titulo}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              proyecto.estado === 'enviado' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {proyecto.estado}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {proyecto.tech_stack.slice(0, 3).map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                              {proyecto.tech_stack.length > 3 && (
                                <span className="px-2 py-1 bg-gray-600 text-xs rounded">
                                  +{proyecto.tech_stack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {proyecto.github_url ? (
                              <a
                                href={proyecto.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Ver
                              </a>
                            ) : '-'}
                          </td>
                          <td className="p-3">
                            {proyecto.demo_url ? (
                              <a
                                href={proyecto.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300"
                              >
                                Ver
                              </a>
                            ) : '-'}
                          </td>
                          <td className="p-3">{new Date(proyecto.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
              )}
          </div>
        </motion.div>
        )}

        {activeTab === 'emails' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Email Configuration */}
            <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-green-400 mb-4">📝 Configuración de Email</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Email</label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="welcome">Bienvenida</option>
                <option value="reminder">Recordatorio</option>
                <option value="update">Actualización</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={sendEmails}
                disabled={sending || selectedRegistros.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {sending ? 'Enviando...' : `Enviar a ${selectedRegistros.length} destinatarios`}
              </button>
            </div>
          </div>

          {emailType === 'custom' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Asunto</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Asunto del email..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenido (HTML)</label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Contenido del email en HTML..."
                  rows={8}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

              {/* Estado de la cola de emails */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">📧 Estado de la Cola de Emails</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${queueStatus.processing ? 'bg-yellow-400 animate-pulse' : queueStatus.pending > 0 ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                  <span className="text-gray-300">
                    {queueStatus.processing ? 'Procesando...' : queueStatus.pending > 0 ? `${queueStatus.pending} pendientes` : 'Cola vacía'}
                  </span>
                </div>
              </div>
            </div>

            {/* Participants Selection for Emails */}
            <div className="bg-gray-900 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">
                  👥 Seleccionar Participantes
            </h2>
            <button
              onClick={toggleSelectAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {selectedRegistros.length === registros.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
            </button>
          </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        checked={selectedRegistros.length === registros.length && registros.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Experiencia</th>
                    <th className="text-left p-3">Participación</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro) => (
                    <tr key={registro.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedRegistros.includes(registro.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRegistros([...selectedRegistros, registro.id]);
                            } else {
                              setSelectedRegistros(selectedRegistros.filter(id => id !== registro.id));
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">{registro.nombre} {registro.apellido}</td>
                      <td className="p-3">{registro.email}</td>
                      <td className="p-3 capitalize">{registro.experiencia}</td>
                      <td className="p-3">{registro.equipo === 'equipo' ? 'Equipo' : 'Individual'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </motion.div>
          )}

      </div>
    </div>
  );
}
