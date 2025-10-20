'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { User, Camera, Save, Check } from 'lucide-react';
import Image from 'next/image';

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
  foto_perfil?: string;
  created_at: string;
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      // Verificar método de autenticación
      const storedAuthMethod = localStorage.getItem('authMethod');
      
      if (storedAuthMethod === 'email') {
        // Usuario autenticado por email
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserData(userData);
          if (userData.foto_perfil) {
            setPreviewImage(userData.foto_perfil);
          }
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

        const { data: userData, error } = await supabase
          .from('registros_hackathon')
          .select('*')
          .eq('email', address)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          window.location.href = '/login';
          return;
        }

        if (userData) {
          setUserData(userData);
          if (userData.foto_perfil) {
            setPreviewImage(userData.foto_perfil);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    const storedAuthMethod = localStorage.getItem('authMethod');
    
    if (storedAuthMethod === 'email') {
      // Usuario autenticado por email - cargar datos inmediatamente
      fetchUserData();
    } else if (isConnected && address) {
      // Usuario autenticado por wallet - verificar conexión
      fetchUserData();
    }
  }, [isConnected, address, fetchUserData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Usar la instancia de supabase importada
    const fileExt = file.name.split('.').pop();
    const fileName = `${address}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    try {
      const storedAuthMethod = localStorage.getItem('authMethod');
      let fotoUrl = userData.foto_perfil;
      
      // Upload new image if selected
      if (profileImage) {
        fotoUrl = await uploadImage(profileImage);
      }

      // Update user data
      const { error } = await supabase
        .from('registros_hackathon')
        .update({
          ...userData,
          foto_perfil: fotoUrl
        })
        .eq('id', userData.id);

      if (error) {
        throw error;
      }

      // Update localStorage if user is authenticated by email
      if (storedAuthMethod === 'email') {
        const updatedUser = { ...userData, foto_perfil: fotoUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-gray-400 mt-2">Actualiza tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Image */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Foto de Perfil</h2>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Haz clic en la cámara para cambiar tu foto
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Información Personal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={userData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={userData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={userData.telefono || ''}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Universidad
                </label>
                <input
                  type="text"
                  value={userData.universidad || ''}
                  onChange={(e) => handleInputChange('universidad', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Carrera
                </label>
                <input
                  type="text"
                  value={userData.carrera || ''}
                  onChange={(e) => handleInputChange('carrera', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nivel de Experiencia
                </label>
                <select
                  value={userData.experiencia}
                  onChange={(e) => handleInputChange('experiencia', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={userData.github || ''}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="https://github.com/tuusuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={userData.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="https://linkedin.com/in/tuusuario"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio
                </label>
                <input
                  type="url"
                  value={userData.portfolio || ''}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="https://tuportfolio.com"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
