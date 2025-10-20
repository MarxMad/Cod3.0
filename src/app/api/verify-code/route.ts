import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email y código son requeridos' }, { status: 400 });
    }

    // Buscar el código en la base de datos
    const { data: verificationCode, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .single();

    if (codeError || !verificationCode) {
      return NextResponse.json({ 
        error: 'Código inválido o expirado' 
      }, { status: 400 });
    }

    // Verificar que no esté expirado
    const now = new Date();
    const expiresAt = new Date(verificationCode.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json({ 
        error: 'Código expirado' 
      }, { status: 400 });
    }

    // Marcar código como usado
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id);

    // Obtener datos del usuario
    const { data: user, error: userError } = await supabase
      .from('registros_hackathon')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    // Crear sesión (podrías usar JWT o cookies aquí)
    // Por ahora, devolvemos los datos del usuario
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        universidad: user.universidad,
        carrera: user.carrera,
        experiencia: user.experiencia,
        equipo: user.equipo,
        nombreEquipo: user.nombreEquipo
      }
    });

  } catch (error) {
    console.error('Error in verify-code:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
