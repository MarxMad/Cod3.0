-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  problema TEXT NOT NULL,
  solucion TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  video_url VARCHAR(500),
  imagenes TEXT[] DEFAULT '{}',
  estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado')),
  email_participante VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_proyectos_email ON proyectos(email_participante);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_created_at ON proyectos(created_at);

-- Crear buckets de almacenamiento para imágenes y videos
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('project-videos', 'project-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de almacenamiento para profile-images
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Anyone can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Anyone can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images');

-- Configurar políticas de almacenamiento para project-images
CREATE POLICY "Project images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Anyone can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Anyone can update project images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-images');

-- Configurar políticas de almacenamiento para project-videos
CREATE POLICY "Project videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-videos');

CREATE POLICY "Anyone can upload project videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Anyone can update project videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-videos');

-- Agregar columna de foto de perfil a la tabla registros_hackathon si no existe
ALTER TABLE registros_hackathon ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(500);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at en proyectos
CREATE TRIGGER update_proyectos_updated_at 
  BEFORE UPDATE ON proyectos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
