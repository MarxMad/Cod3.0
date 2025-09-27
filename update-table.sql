-- Script para actualizar la tabla registros_hackathon
-- Ejecuta este script en el SQL Editor de Supabase

-- Agregar la columna nombreEquipo si no existe
ALTER TABLE registros_hackathon 
ADD COLUMN IF NOT EXISTS nombreEquipo VARCHAR(255);

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registros_hackathon' 
ORDER BY ordinal_position;
