import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para el registro
export interface RegistroHackathon {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  universidad?: string;
  carrera?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
  equipo: 'individual' | 'equipo';
  nombreEquipo?: string;
  proyecto?: string;
  motivacion: string;
  created_at?: string;
}
