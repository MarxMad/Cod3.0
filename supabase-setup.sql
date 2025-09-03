-- Script para configurar la base de datos en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Crear la tabla de registros del hackathon
CREATE TABLE IF NOT EXISTS registros_hackathon (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(50),
  universidad VARCHAR(255),
  carrera VARCHAR(255),
  github VARCHAR(500),
  linkedin VARCHAR(500),
  portfolio VARCHAR(500),
  experiencia VARCHAR(50) NOT NULL CHECK (experiencia IN ('principiante', 'intermedio', 'avanzado', 'experto')),
  equipo VARCHAR(50) NOT NULL CHECK (equipo IN ('individual', 'equipo')),
  nombreEquipo VARCHAR(255),
  proyecto TEXT,
  motivacion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_registros_email ON registros_hackathon(email);
CREATE INDEX IF NOT NOT EXISTS idx_registros_created_at ON registros_hackathon(created_at);
CREATE INDEX IF NOT EXISTS idx_registros_experiencia ON registros_hackathon(experiencia);
CREATE INDEX IF NOT EXISTS idx_registros_equipo ON registros_hackathon(equipo);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_registros_updated_at 
    BEFORE UPDATE ON registros_hackathon 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Crear políticas de seguridad RLS (Row Level Security)
ALTER TABLE registros_hackathon ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de nuevos registros
CREATE POLICY "Permitir inserción de registros" ON registros_hackathon
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura solo a usuarios autenticados (opcional)
-- CREATE POLICY "Permitir lectura a usuarios autenticados" ON registros_hackathon
--     FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir lectura pública (para estadísticas)
CREATE POLICY "Permitir lectura pública" ON registros_hackathon
    FOR SELECT USING (true);

-- Crear vista para estadísticas (opcional)
CREATE OR REPLACE VIEW estadisticas_hackathon AS
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN equipo = 'individual' THEN 1 END) as participantes_individuales,
    COUNT(CASE WHEN equipo = 'equipo' THEN 1 END) as participantes_equipo,
    COUNT(CASE WHEN experiencia = 'principiante' THEN 1 END) as principiantes,
    COUNT(CASE WHEN experiencia = 'intermedio' THEN 1 END) as intermedios,
    COUNT(CASE WHEN experiencia = 'avanzado' THEN 1 END) as avanzados,
    COUNT(CASE WHEN experiencia = 'experto' THEN 1 END) as expertos,
    COUNT(CASE WHEN universidad IS NOT NULL THEN 1 END) as con_universidad,
    COUNT(CASE WHEN github IS NOT NULL THEN 1 END) as con_github,
    COUNT(CASE WHEN linkedin IS NOT NULL THEN 1 END) as con_linkedin
FROM registros_hackathon;

-- Insertar datos de ejemplo (opcional)
-- INSERT INTO registros_hackathon (nombre, apellido, email, experiencia, equipo, motivacion) VALUES
-- ('Juan', 'Pérez', 'juan@example.com', 'intermedio', 'individual', 'Quiero aprender nuevas tecnologías y conectar con otros desarrolladores.'),
-- ('María', 'García', 'maria@example.com', 'avanzado', 'equipo', 'Me interesa trabajar en proyectos innovadores y compartir conocimientos.'),
-- ('Carlos', 'López', 'carlos@example.com', 'principiante', 'individual', 'Es mi primer hackathon y estoy emocionado por participar.');

-- Comentarios sobre la estructura
COMMENT ON TABLE registros_hackathon IS 'Tabla para almacenar registros de participantes del COD3.0 HACKATHON';
COMMENT ON COLUMN registros_hackathon.id IS 'Identificador único del registro';
COMMENT ON COLUMN registros_hackathon.nombre IS 'Nombre del participante';
COMMENT ON COLUMN registros_hackathon.apellido IS 'Apellido del participante';
COMMENT ON COLUMN registros_hackathon.email IS 'Email único del participante';
COMMENT ON COLUMN registros_hackathon.experiencia IS 'Nivel de experiencia técnica';
COMMENT ON COLUMN registros_hackathon.equipo IS 'Tipo de participación (individual o equipo)';
COMMENT ON COLUMN registros_hackathon.motivacion IS 'Motivación del participante para participar';
COMMENT ON COLUMN registros_hackathon.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN registros_hackathon.updated_at IS 'Fecha y hora de última actualización';
