-- SQL para crear la tabla de registros del hackathon
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear la tabla de registros del hackathon
CREATE TABLE IF NOT EXISTS registros_hackathon (
  -- ID único autoincremental
  id SERIAL PRIMARY KEY,
  
  -- Información personal (campos requeridos)
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Información personal (campos opcionales)
  telefono VARCHAR(20),
  universidad VARCHAR(200),
  carrera VARCHAR(200),
  
  -- Perfil técnico (campos opcionales)
  github VARCHAR(255),
  linkedin VARCHAR(255),
  portfolio VARCHAR(255),
  
  -- Experiencia (campo requerido)
  experiencia VARCHAR(20) NOT NULL CHECK (experiencia IN ('principiante', 'intermedio', 'avanzado', 'experto')),
  
  -- Participación (campo requerido)
  equipo VARCHAR(20) NOT NULL CHECK (equipo IN ('individual', 'equipo')),
  nombreequipo VARCHAR(200),
  
  -- Proyecto y motivación
  proyecto TEXT,
  motivacion TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_registros_email ON registros_hackathon(email);
CREATE INDEX IF NOT EXISTS idx_registros_created_at ON registros_hackathon(created_at);
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
DROP TRIGGER IF EXISTS update_registros_updated_at ON registros_hackathon;
CREATE TRIGGER update_registros_updated_at
    BEFORE UPDATE ON registros_hackathon
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) para seguridad
ALTER TABLE registros_hackathon ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserción desde la aplicación
CREATE POLICY "Allow insert for authenticated users" ON registros_hackathon
    FOR INSERT WITH CHECK (true);

-- Crear política para permitir lectura (opcional, para administradores)
CREATE POLICY "Allow read for authenticated users" ON registros_hackathon
    FOR SELECT USING (true);

-- Comentarios en la tabla y columnas para documentación
COMMENT ON TABLE registros_hackathon IS 'Tabla para almacenar los registros del COD3.0 HACKATHON';
COMMENT ON COLUMN registros_hackathon.id IS 'ID único del registro';
COMMENT ON COLUMN registros_hackathon.nombre IS 'Nombre del participante';
COMMENT ON COLUMN registros_hackathon.apellido IS 'Apellido del participante';
COMMENT ON COLUMN registros_hackathon.email IS 'Email único del participante';
COMMENT ON COLUMN registros_hackathon.telefono IS 'Teléfono de contacto (opcional)';
COMMENT ON COLUMN registros_hackathon.universidad IS 'Universidad o institución (opcional)';
COMMENT ON COLUMN registros_hackathon.carrera IS 'Carrera o campo de estudio (opcional)';
COMMENT ON COLUMN registros_hackathon.github IS 'Perfil de GitHub (opcional)';
COMMENT ON COLUMN registros_hackathon.linkedin IS 'Perfil de LinkedIn (opcional)';
COMMENT ON COLUMN registros_hackathon.portfolio IS 'Portfolio o website (opcional)';
COMMENT ON COLUMN registros_hackathon.experiencia IS 'Nivel de experiencia: principiante, intermedio, avanzado, experto';
COMMENT ON COLUMN registros_hackathon.equipo IS 'Tipo de participación: individual o equipo';
COMMENT ON COLUMN registros_hackathon.nombreequipo IS 'Nombre del equipo (solo si equipo = equipo)';
COMMENT ON COLUMN registros_hackathon.proyecto IS 'Idea de proyecto (opcional)';
COMMENT ON COLUMN registros_hackathon.motivacion IS 'Motivación para participar (requerido)';
COMMENT ON COLUMN registros_hackathon.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN registros_hackathon.updated_at IS 'Fecha y hora de última actualización';

-- Verificar que la tabla se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'registros_hackathon' 
ORDER BY ordinal_position;
