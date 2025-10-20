-- Crear tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  lider_email VARCHAR(255) NOT NULL,
  max_miembros INTEGER DEFAULT 5,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'completo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de miembros de equipos
CREATE TABLE IF NOT EXISTS equipo_miembros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  email_miembro VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'miembro' CHECK (rol IN ('lider', 'miembro')),
  estado_invitacion VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_invitacion IN ('pendiente', 'aceptada', 'rechazada')),
  invitado_por VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(equipo_id, email_miembro)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_equipos_lider ON equipos(lider_email);
CREATE INDEX IF NOT EXISTS idx_equipos_estado ON equipos(estado);
CREATE INDEX IF NOT EXISTS idx_equipo_miembros_equipo ON equipo_miembros(equipo_id);
CREATE INDEX IF NOT EXISTS idx_equipo_miembros_email ON equipo_miembros(email_miembro);
CREATE INDEX IF NOT EXISTS idx_equipo_miembros_estado ON equipo_miembros(estado_invitacion);

-- Habilitar RLS (Row Level Security)
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipo_miembros ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para equipos
CREATE POLICY "Users can view all active teams" ON equipos
  FOR SELECT USING (estado = 'activo');

CREATE POLICY "Users can create teams" ON equipos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Team leaders can update their teams" ON equipos
  FOR UPDATE USING (lider_email = auth.email());

-- Políticas de RLS para equipo_miembros
CREATE POLICY "Users can view team members" ON equipo_miembros
  FOR SELECT USING (true);

CREATE POLICY "Users can manage team members" ON equipo_miembros
  FOR ALL USING (true);

-- Agregar columna equipo_id a la tabla proyectos
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS equipo_id UUID REFERENCES equipos(id);

-- Agregar columna equipo_id a la tabla registros_hackathon
ALTER TABLE registros_hackathon ADD COLUMN IF NOT EXISTS equipo_id UUID REFERENCES equipos(id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_equipos_updated_at
  BEFORE UPDATE ON equipos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipo_miembros_updated_at
  BEFORE UPDATE ON equipo_miembros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Crear vista para estadísticas de equipos
CREATE OR REPLACE VIEW estadisticas_equipos AS
SELECT
  e.id,
  e.nombre,
  e.descripcion,
  e.lider_email,
  e.max_miembros,
  e.estado,
  COUNT(em.id) as miembros_actuales,
  COUNT(CASE WHEN em.estado_invitacion = 'aceptada' THEN 1 END) as miembros_activos,
  COUNT(CASE WHEN em.estado_invitacion = 'pendiente' THEN 1 END) as invitaciones_pendientes,
  e.created_at,
  e.updated_at
FROM equipos e
LEFT JOIN equipo_miembros em ON e.id = em.equipo_id
GROUP BY e.id, e.nombre, e.descripcion, e.lider_email, e.max_miembros, e.estado, e.created_at, e.updated_at;
