'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Check, 
  X, 
  Crown,
  Edit,
  Eye,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import InviteForm from '@/components/InviteForm';

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
  // Datos del miembro
  miembro_nombre?: string;
  miembro_apellido?: string;
  miembro_foto?: string;
}

export default function EquiposPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [miEquipo, setMiEquipo] = useState<Equipo | null>(null);
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUserEmail(user.email);
      fetchData();
    }
  }, [user, isAuthenticated]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener todos los equipos activos
      const { data: equiposData, error: equiposError } = await supabase
        .from('estadisticas_equipos')
        .select('*')
        .eq('estado', 'activo')
        .order('created_at', { ascending: false });

      if (equiposError) {
        console.error('Error fetching equipos:', equiposError);
        return;
      }

      setEquipos(equiposData || []);

      console.log('Buscando mi equipo para el email:', userEmail);

      // Obtener mi equipo si existe - Primero buscar como líder
      const { data: miEquipoComoLider, error: liderError } = await supabase
        .from('equipos')
        .select('*')
        .eq('lider_email', userEmail)
        .single();

      if (miEquipoComoLider && !liderError) {
        console.log('Mi equipo encontrado como líder:', miEquipoComoLider);
      } else {
        console.log('No se encontró como líder, error:', liderError);
        console.log('Buscando como miembro...');
      }

      let miEquipoFinal = null;
      let equipoId = null;

      if (miEquipoComoLider && !liderError) {
        miEquipoFinal = miEquipoComoLider;
        equipoId = miEquipoComoLider.id;
      } else {
        // Si no es líder, buscar como miembro aceptado
        const { data: miEquipoData, error: miEquipoError } = await supabase
          .from('equipo_miembros')
          .select(`
            equipo_id,
            equipos!equipo_miembros_equipo_id_fkey (*)
          `)
          .eq('email_miembro', userEmail)
          .eq('estado_invitacion', 'aceptada')
          .single();

        if (miEquipoData && !miEquipoError && miEquipoData.equipos) {
          console.log('Mi equipo encontrado como miembro:', miEquipoData.equipos);
          miEquipoFinal = miEquipoData.equipos;
          equipoId = miEquipoData.equipo_id;
        } else {
          console.log('No se encontró como miembro, error:', miEquipoError);
        }
      }

      // Debug: Verificar si el equipo existe en la lista de todos los equipos
      if (!miEquipoFinal) {
        console.log('Equipos disponibles:', equiposData);
        const equipoDelUsuario = equiposData?.find(equipo => 
          equipo.lider_email === userEmail || 
          equipo.miembros_activos > 0
        );
        if (equipoDelUsuario) {
          console.log('Equipo encontrado en la lista general:', equipoDelUsuario);
        }
      }

      if (miEquipoFinal) {
        setMiEquipo(miEquipoFinal as unknown as Equipo);
        
        // Obtener miembros de mi equipo
        const { data: miembrosData, error: miembrosError } = await supabase
          .from('equipo_miembros')
          .select(`
            *,
            registros_hackathon!equipo_miembros_email_miembro_fkey (
              nombre,
              apellido,
              foto_perfil
            )
          `)
          .eq('equipo_id', equipoId);

        if (!miembrosError && miembrosData) {
          const miembrosTransformados = miembrosData.map(miembro => ({
            ...miembro,
            miembro_nombre: miembro.registros_hackathon?.nombre,
            miembro_apellido: miembro.registros_hackathon?.apellido,
            miembro_foto: miembro.registros_hackathon?.foto_perfil
          }));
          setMiembros(miembrosTransformados);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  const uploadBanner = async (file: File, equipoId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${equipoId}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('team-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('team-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createEquipo = async (nombre: string, descripcion: string, maxMiembros: number) => {
    try {
      const { data: newEquipo, error } = await supabase
        .from('equipos')
        .insert({
          nombre,
          descripcion,
          lider_email: userEmail,
          max_miembros: maxMiembros
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Upload banner if provided
      let bannerUrl = null;
      if (bannerFile && newEquipo) {
        bannerUrl = await uploadBanner(bannerFile, newEquipo.id);
        await supabase
          .from('equipos')
          .update({ banner_url: bannerUrl })
          .eq('id', newEquipo.id);
      }

      // Agregar al líder como miembro
      if (newEquipo) {
        await supabase
          .from('equipo_miembros')
          .insert({
            equipo_id: newEquipo.id,
            email_miembro: userEmail,
            rol: 'lider',
            estado_invitacion: 'aceptada',
            invitado_por: userEmail
          });
      }

      setShowCreateForm(false);
      setBannerFile(null);
      setBannerPreview(null);
      fetchData();
      alert('Equipo creado exitosamente!');
    } catch (error: unknown) {
      console.error('Error creating equipo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al crear el equipo: ' + errorMessage);
    }
  };

  const editEquipo = async (equipoId: string, nombre: string, descripcion: string, maxMiembros: number) => {
    try {
      const updateData: Record<string, unknown> = {
        nombre,
        descripcion,
        max_miembros: maxMiembros
      };

      // Upload new banner if provided
      if (bannerFile) {
        const bannerUrl = await uploadBanner(bannerFile, equipoId);
        updateData.banner_url = bannerUrl;
      }

      const { error } = await supabase
        .from('equipos')
        .update(updateData)
        .eq('id', equipoId);

      if (error) {
        throw error;
      }

      setShowEditForm(false);
      setBannerFile(null);
      setBannerPreview(null);
      setEditingEquipo(null);
      fetchData();
      alert('Equipo actualizado exitosamente!');
    } catch (error: unknown) {
      console.error('Error updating equipo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al actualizar el equipo: ' + errorMessage);
    }
  };

  const inviteToEquipo = async (email: string): Promise<void> => {
    if (!miEquipo) {
      throw new Error('No hay equipo seleccionado');
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Por favor, ingresa un email válido');
    }

    // Verificar que no se esté invitando al mismo email
    if (email === userEmail) {
      throw new Error('No puedes invitarte a ti mismo');
    }

    // Verificar que el equipo no esté completo
    if (miEquipo.miembros_activos >= miEquipo.max_miembros) {
      throw new Error('El equipo ya tiene el máximo de miembros permitidos');
    }

    const response = await fetch('/api/send-team-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        equipoId: miEquipo.id,
        equipoNombre: miEquipo.nombre,
        invitadoPor: userEmail
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar invitación');
    }

    // Actualizar datos después de enviar invitación exitosamente
    fetchData();
  };

  const respondToInvitation = async (miembroId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('equipo_miembros')
        .update({
          estado_invitacion: accept ? 'aceptada' : 'rechazada'
        })
        .eq('id', miembroId);

      if (error) {
        throw error;
      }

      fetchData();
      alert(accept ? 'Invitación aceptada!' : 'Invitación rechazada');
    } catch (error: unknown) {
      console.error('Error responding to invitation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al procesar invitación: ' + errorMessage);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        <p className="ml-4 text-gray-300">Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-400">Equipos</h1>
          <p className="text-gray-400 mt-2">Gestiona tu equipo y colabora con otros participantes</p>
        </div>
        {!miEquipo && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Equipo
          </button>
        )}
      </div>

      {/* Mi Equipo */}
      {miEquipo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
        >
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-green-600 to-blue-600 relative">
            {miEquipo.banner_url ? (
              <img
                src={miEquipo.banner_url}
                alt={`Banner de ${miEquipo.nombre}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Users className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-yellow-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{miEquipo.nombre}</h2>
                  <p className="text-gray-400">{miEquipo.descripcion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  <span className={`${miEquipo.miembros_activos >= miEquipo.max_miembros ? 'text-red-400' : miEquipo.miembros_activos >= miEquipo.max_miembros * 0.8 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {miEquipo.miembros_activos}/{miEquipo.max_miembros} miembros
                  </span>
                  {miEquipo.miembros_activos >= miEquipo.max_miembros && (
                    <span className="ml-2 text-red-400 text-sm">(Equipo completo)</span>
                  )}
                </span>
                <button
                  onClick={() => {
                    setEditingEquipo(miEquipo);
                    setBannerPreview(miEquipo.banner_url || null);
                    setShowEditForm(true);
                  }}
                  className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invitar
                </button>
              </div>
            </div>

            {/* Miembros del Equipo */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Miembros del Equipo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {miembros.map((miembro) => (
                  <div key={miembro.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        {miembro.miembro_foto ? (
                          <img
                            src={miembro.miembro_foto}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {miembro.miembro_nombre} {miembro.miembro_apellido}
                        </p>
                        <p className="text-sm text-gray-400">
                          {miembro.rol === 'lider' ? 'Líder' : 'Miembro'}
                        </p>
                      </div>
                    </div>
                    
                    {miembro.estado_invitacion === 'pendiente' && miembro.email_miembro === userEmail && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToInvitation(miembro.id, true)}
                          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceptar
                        </button>
                        <button
                          onClick={() => respondToInvitation(miembro.id, false)}
                          className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </button>
                      </div>
                    )}
                    
                    {miembro.estado_invitacion === 'pendiente' && miembro.email_miembro !== userEmail && (
                      <span className="text-yellow-400 text-sm">Invitación pendiente</span>
                    )}
                    
                    {miembro.estado_invitacion === 'rechazada' && (
                      <span className="text-red-400 text-sm">Invitación rechazada</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Todos los Equipos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Todos los Equipos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <motion.div
              key={equipo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300"
            >
              {/* Banner del equipo */}
              <div className="h-24 bg-gradient-to-r from-green-600 to-blue-600 relative">
                {equipo.banner_url ? (
                  <img
                    src={equipo.banner_url}
                    alt={`Banner de ${equipo.nombre}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Users className="h-8 w-8 text-white/50" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{equipo.nombre}</h3>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                    {equipo.miembros_activos}/{equipo.max_miembros}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {equipo.descripcion}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{equipo.miembros_activos} miembros</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/equipos/${equipo.id}`}
                      className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Equipo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createEquipo(
                formData.get('nombre') as string,
                formData.get('descripcion') as string,
                parseInt(formData.get('maxMiembros') as string)
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Equipo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Banner del Equipo (Opcional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {bannerPreview && (
                      <div className="mt-2">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Máximo de Miembros
                  </label>
                  <input
                    type="number"
                    name="maxMiembros"
                    min="2"
                    max="5"
                    defaultValue="5"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Máximo 5 miembros por equipo</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Crear Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteForm
        isOpen={showInviteForm}
        onClose={() => setShowInviteForm(false)}
        onInvite={inviteToEquipo}
        equipoNombre={miEquipo?.nombre || ''}
        miembrosActuales={miEquipo?.miembros_activos || 0}
        maxMiembros={miEquipo?.max_miembros || 5}
      />

      {/* Edit Team Modal */}
      {showEditForm && editingEquipo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Editar Equipo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              editEquipo(
                editingEquipo.id,
                formData.get('nombre') as string,
                formData.get('descripcion') as string,
                parseInt(formData.get('maxMiembros') as string)
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Equipo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={editingEquipo.nombre}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    defaultValue={editingEquipo.descripcion}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nuevo Banner (Opcional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {bannerPreview && (
                      <div className="mt-2">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {editingEquipo.banner_url && !bannerPreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-2">Banner actual:</p>
                        <img
                          src={editingEquipo.banner_url}
                          alt="Banner actual"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Máximo de Miembros
                  </label>
                  <input
                    type="number"
                    name="maxMiembros"
                    min="2"
                    max="5"
                    defaultValue={editingEquipo.max_miembros}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Máximo 5 miembros por equipo</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingEquipo(null);
                    setBannerFile(null);
                    setBannerPreview(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
