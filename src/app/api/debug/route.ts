import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Iniciando diagnóstico del sistema...');
    
    // Verificar variables de entorno
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      resendKey: !!process.env.RESEND_API_KEY,
    };
    
    console.log('🔧 Variables de entorno:', envCheck);
    
    // Probar conexión con Supabase
    let supabaseConnection = false;
    let supabaseError = null;
    
    try {
      console.log('🔗 Probando conexión con Supabase...');
      const { error } = await supabase
        .from('registros_hackathon')
        .select('count')
        .limit(1);
      
      if (error) {
        supabaseError = error;
        console.error('❌ Error de Supabase:', error);
      } else {
        supabaseConnection = true;
        console.log('✅ Conexión con Supabase exitosa');
      }
    } catch (connectionError) {
      supabaseError = connectionError;
      console.error('❌ Error de conexión:', connectionError);
    }
    
    // Verificar estructura de la tabla
    let tableStructure = null;
    try {
      const { error } = await supabase
        .from('registros_hackathon')
        .select('*')
        .limit(0);
      
      if (!error) {
        tableStructure = 'Tabla accesible';
      }
    } catch (tableError) {
      console.error('❌ Error al acceder a la tabla:', tableError);
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrl: envCheck.supabaseUrl,
        supabaseKey: envCheck.supabaseKey,
        resendKey: envCheck.resendKey,
      },
      supabase: {
        connected: supabaseConnection,
        error: supabaseError,
        tableStructure: tableStructure,
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
      }
    });
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    return NextResponse.json(
      { 
        error: 'Error en diagnóstico',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
