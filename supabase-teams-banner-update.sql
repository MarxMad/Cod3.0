-- Agregar columna banner_url a la tabla equipos
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);

-- Crear bucket para imágenes de equipos
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de almacenamiento para team-images
CREATE POLICY "Team images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Anyone can upload team images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Anyone can update team images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'team-images');
