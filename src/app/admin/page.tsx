'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function AdminPage() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistros, setSelectedRegistros] = useState<string[]>([]);
  const [emailType, setEmailType] = useState('welcome');
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [sending, setSending] = useState(false);
  const [filters, setFilters] = useState({
    experiencia: '',
    equipo: '',
    universidad: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  // Cargar registros
  const loadRegistros = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRegistros(data.data);
      } else {
        console.error('Error cargando registros:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistros();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

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
        alert(`Emails enviados: ${data.summary.successful} exitosos, ${data.summary.failed} fallidos`);
        setSelectedRegistros([]);
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            📧 Panel de Administración de Emails
          </h1>
          <p className="text-gray-300">
            Gestiona y envía correos personalizados a los participantes
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-xl mb-6"
        >
          <h2 className="text-xl font-bold text-green-400 mb-4">🔍 Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Experiencia</label>
              <select
                value={filters.experiencia}
                onChange={(e) => setFilters({...filters, experiencia: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Todas</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Participación</label>
              <select
                value={filters.equipo}
                onChange={(e) => setFilters({...filters, equipo: e.target.value})}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Todas</option>
                <option value="individual">Individual</option>
                <option value="equipo">Equipo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Universidad</label>
              <input
                type="text"
                value={filters.universidad}
                onChange={(e) => setFilters({...filters, universidad: e.target.value})}
                placeholder="Buscar universidad..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Configuración de Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-xl mb-6"
        >
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
        </motion.div>

        {/* Lista de Registros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">
              👥 Participantes ({registros.length})
            </h2>
            <button
              onClick={toggleSelectAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {selectedRegistros.length === registros.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
            </button>
          </div>

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
                    <th className="text-left p-3">Universidad</th>
                    <th className="text-left p-3">Fecha</th>
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
                      <td className="p-3">{registro.universidad || '-'}</td>
                      <td className="p-3">{new Date(registro.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
