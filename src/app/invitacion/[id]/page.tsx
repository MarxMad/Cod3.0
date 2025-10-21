'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, X, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Equipo {
  id: string;
  nombre: string;
  descripcion: string;
  lider_email: string;
  max_miembros: number;
  banner_url?: string;
  created_at: string;
}

interface Invitacion {
  id: string;
  equipo_id: string;
  email_miembro: string;
  rol: string;
  estado_invitacion: string;
  invitado_por: string;
  created_at: string;
  equipos: Equipo;
}

export default function InvitacionPage() {
  const params = useParams();
  const invitacionId = params.id as string;
  
  const [invitacion, setInvitacion] = useState<Invitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInvitacion();
  }, [invitacionId]);

  const fetchInvitacion = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('equipo_miembros')
        .select(`
          *,
          equipos!equipo_miembros_equipo_id_fkey (*)
        `)
        .eq('id', invitacionId)
        .single();

      if (error) {
        console.error('Error fetching invitacion:', error);
        setMessage('Invitación no encontrada o expirada');
        return;
      }

      if (data.estado_invitacion !== 'pendiente') {
        setMessage('Esta invitación ya ha sido procesada');
        setSuccess(true);
        return;
      }

      setInvitacion(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al cargar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (accept: boolean) => {
    if (!invitacion) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/respond-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitacionId,
          accept,
          userEmail: invitacion.email_miembro
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSuccess(true);
        
        // Actualizar el estado local
        setInvitacion(prev => prev ? {
          ...prev,
          estado_invitacion: accept ? 'aceptada' : 'rechazada'
        } : null);
      } else {
        setMessage(data.error || 'Error al procesar la invitación');
      }

    } catch (error) {
      console.error('Error responding to invitation:', error);
      setMessage('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!invitacion && !message) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Invitación no encontrada</h1>
          <p className="text-gray-400 mb-6">La invitación que buscas no existe o ha expirado.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {success ? 'Invitación Procesada' : 'Invitación al Equipo'}
          </h1>
          <p className="text-gray-400">
            {success ? 'Tu respuesta ha sido registrada' : 'Decide si quieres unirte al equipo'}
          </p>
        </div>

        {invitacion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-8"
          >
            {/* Banner del equipo */}
            <div className="h-32 bg-gradient-to-r from-green-600 to-blue-600 relative">
              {invitacion.equipos.banner_url ? (
                <img
                  src={invitacion.equipos.banner_url}
                  alt={`Banner de ${invitacion.equipos.nombre}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Users className="h-12 w-12 text-white/50" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{invitacion.equipos.nombre}</h2>
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Equipo del Hackathon
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">{invitacion.equipos.descripcion}</p>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <Users className="h-4 w-4 mr-2" />
                <span>Máximo {invitacion.equipos.max_miembros} miembros</span>
              </div>

              {invitacion.estado_invitacion === 'pendiente' && !success && (
                <div className="space-y-4">
                  <p className="text-gray-300 text-center">
                    ¿Te gustaría unirte a este equipo?
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => respondToInvitation(true)}
                      disabled={processing}
                      className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      {processing ? 'Procesando...' : 'Aceptar'}
                    </button>
                    
                    <button
                      onClick={() => respondToInvitation(false)}
                      disabled={processing}
                      className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 mr-2" />
                      {processing ? 'Procesando...' : 'Rechazar'}
                    </button>
                  </div>
                </div>
              )}

              {invitacion.estado_invitacion === 'aceptada' && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-400 mr-2" />
                    <span className="text-green-400 font-semibold">Invitación Aceptada</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    ¡Bienvenido al equipo! Ya puedes acceder a tu dashboard para gestionar el equipo.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Ir al Dashboard
                  </Link>
                </div>
              )}

              {invitacion.estado_invitacion === 'rechazada' && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-400 mr-2" />
                    <span className="text-red-400 font-semibold">Invitación Rechazada</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Has rechazado la invitación a este equipo.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Volver al Inicio
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {message && (
          <div className="text-center">
            <p className={`text-lg ${success ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
