-- Crear tabla de códigos de verificación
CREATE TABLE public.verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir índice para email para búsquedas rápidas
CREATE INDEX idx_verification_codes_email ON public.verification_codes (email);

-- Añadir índice para código para verificación rápida
CREATE INDEX idx_verification_codes_code ON public.verification_codes (code);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de códigos (sin autenticación)
CREATE POLICY "Allow code insertion" ON public.verification_codes
  FOR INSERT WITH CHECK (true);

-- Política para permitir verificación de códigos (sin autenticación)
CREATE POLICY "Allow code verification" ON public.verification_codes
  FOR SELECT USING (true);

-- Política para permitir actualización de códigos (marcar como usado)
CREATE POLICY "Allow code update" ON public.verification_codes
  FOR UPDATE USING (true);

-- Función para limpiar códigos expirados (opcional)
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM public.verification_codes 
    WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql;

-- Asegurarse de que la extensión uuid-ossp esté habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
