import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Verificando variables de entorno...');
    
    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      resendKey: !!process.env.RESEND_API_KEY,
      resendKeyValue: process.env.RESEND_API_KEY ? 'Configurada' : 'No configurada',
    };
    
    console.log('🔧 Variables de entorno:', envCheck);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      message: 'Variables de entorno verificadas'
    });
    
  } catch (error) {
    console.error('❌ Error verificando variables:', error);
    return NextResponse.json(
      { 
        error: 'Error verificando variables de entorno',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}