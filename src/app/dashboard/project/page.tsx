'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '@/lib/supabase';
import { 
  FolderOpen, 
  Upload, 
  Save, 
  Check, 
  Github, 
  ExternalLink,
  Image as ImageIcon,
  Video
} from 'lucide-react';

interface ProjectData {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
  'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot',
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails',
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS',
  'Bootstrap', 'SASS', 'SCSS', 'Webpack', 'Vite',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Supabase', 'Prisma', 'GraphQL', 'REST API', 'WebSocket'
];

export default function ProjectPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [projectData, setProjectData] = useState<ProjectData>({
    titulo: '',
    descripcion: '',
    problema: '',
    solucion: '',
    tech_stack: [],
    github_url: '',
    demo_url: '',
    video_url: '',
    imagenes: [],
    estado: 'borrador',
    email_participante: address || ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const fetchProjectData = useCallback(async () => {
    if (!user) return;
    
    try {
      const userEmail = user.email;

      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('email_participante', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project data:', error);
        return;
      }

      if (data) {
        setProjectData(data);
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchProjectData();
    }
  }, [user, isAuthenticated, fetchProjectData]);

  useEffect(() => {
    if (user) {
      setProjectData(prev => ({ ...prev, email_participante: user.email }));
    }
  }, [user]);

  const handleInputChange = (field: keyof ProjectData, value: string | string[]) => {
    setProjectData({ ...projectData, [field]: value });
  };

  const handleTechStackChange = (tech: string) => {
    const newTechStack = projectData.tech_stack.includes(tech)
      ? projectData.tech_stack.filter(t => t !== tech)
      : [...projectData.tech_stack, tech];
    handleInputChange('tech_stack', newTechStack);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const uploadFiles = async () => {
    // Usar la instancia de supabase importada
    const uploadedImages: string[] = [];

    // Upload images
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${address}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      uploadedImages.push(publicUrl);
    }

    // Upload video
    let videoUrl = '';
    if (videoFile) {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${address}-${Date.now()}-video.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('project-videos')
        .upload(fileName, videoFile);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-videos')
        .getPublicUrl(fileName);

      videoUrl = publicUrl;
    }

    return { uploadedImages, videoUrl };
  };

  const handleSave = async (isSubmission = false) => {
    setSaving(true);
    try {
      const storedAuthMethod = localStorage.getItem('authMethod');
      let userEmail = '';
      
      if (storedAuthMethod === 'email') {
        // Usuario autenticado por email
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userEmail = userData.email;
        } else {
          window.location.href = '/login';
          return;
        }
      } else {
        // Usuario autenticado por wallet (admin)
        if (!isConnected || !address) {
          window.location.href = '/login';
          return;
        }
        userEmail = address;
      }
      
      // Upload files if any
      const { uploadedImages, videoUrl } = await uploadFiles();
      
      const finalProjectData = {
        ...projectData,
        imagenes: [...projectData.imagenes, ...uploadedImages],
        video_url: videoUrl || projectData.video_url,
        estado: (isSubmission ? 'enviado' : 'borrador') as 'enviado' | 'borrador',
        email_participante: userEmail,
        updated_at: new Date().toISOString()
      };

      if (projectData.id) {
        // Update existing project
        const { error } = await supabase
          .from('proyectos')
          .update(finalProjectData)
          .eq('id', projectData.id);

        if (error) throw error;
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('proyectos')
          .insert([finalProjectData])
          .select()
          .single();

        if (error) throw error;
        setProjectData({ ...finalProjectData, id: data.id });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mi Proyecto</h1>
        <p className="text-gray-400 mt-2">
          {projectData.estado === 'enviado' 
            ? 'Tu proyecto ha sido enviado exitosamente' 
            : 'Comparte tu proyecto con el mundo'
          }
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <form className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Información Básica</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={projectData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="Nombre de tu proyecto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={projectData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                  placeholder="Describe brevemente tu proyecto..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Problema que Resuelve *
                </label>
                <textarea
                  value={projectData.problema}
                  onChange={(e) => handleInputChange('problema', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                  placeholder="¿Qué problema específico resuelve tu proyecto?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Solución Propuesta *
                </label>
                <textarea
                  value={projectData.solucion}
                  onChange={(e) => handleInputChange('solucion', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                  placeholder="¿Cómo tu proyecto resuelve este problema?"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Stack Tecnológico</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {TECH_STACK_OPTIONS.map((tech) => (
                <label
                  key={tech}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    projectData.tech_stack.includes(tech)
                      ? 'bg-green-500/20 border-green-400 text-green-400'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={projectData.tech_stack.includes(tech)}
                    onChange={() => handleTechStackChange(tech)}
                    className="hidden"
                  />
                  <span className="text-sm">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Enlaces</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Github className="inline h-4 w-4 mr-2" />
                  Repositorio GitHub *
                </label>
                <input
                  type="url"
                  value={projectData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="https://github.com/usuario/proyecto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ExternalLink className="inline h-4 w-4 mr-2" />
                  Demo en Vivo
                </label>
                <input
                  type="url"
                  value={projectData.demo_url}
                  onChange={(e) => handleInputChange('demo_url', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="https://tu-demo.com"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Medios</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-2" />
                  Imágenes del Proyecto
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-400">Haz clic para subir imágenes</span>
                    <span className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</span>
                  </label>
                </div>
                {imageFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                      {imageFiles.length} archivo(s) seleccionado(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.map((file, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Video className="inline h-4 w-4 mr-2" />
                  Video de Demostración
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Video className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-400">Haz clic para subir video</span>
                    <span className="text-sm text-gray-500">MP4, MOV hasta 100MB</span>
                  </label>
                </div>
                {videoFile && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">
                      Video seleccionado: {videoFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
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
                  Guardar Borrador
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !projectData.titulo || !projectData.descripcion}
              className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Enviar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
