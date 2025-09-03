import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST() {
  try {
    console.log('🔍 Iniciando debug detallado de email...');
    
    // Verificar variables de entorno
    const resendKey = process.env.RESEND_API_KEY;
    console.log('🔑 RESEND_API_KEY configurada:', !!resendKey);
    console.log('🔑 RESEND_API_KEY longitud:', resendKey?.length);
    console.log('🔑 RESEND_API_KEY prefijo:', resendKey?.substring(0, 10) + '...');
    
    if (!resendKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY no está configurada' },
        { status: 500 }
      );
    }

    // Crear cliente Resend
    const resend = new Resend(resendKey);
    console.log('📧 Cliente Resend creado');
    
    // Email de prueba simple
    const testEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Debug Email - COD3.0</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px;">
        <h1 style="color: #00ff00;">🔍 Debug Email</h1>
        <p>Este es un email de debug para diagnosticar problemas con Resend.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </body>
      </html>
    `;

    console.log('📤 Intentando enviar email...');
    console.log('📧 From:', 'COD3.0 <onboarding@resend.dev>');
    console.log('📧 To:', 'criptounam@gmail.com');
    console.log('📧 Subject:', '🔍 Debug Email - COD3.0');
    
    const result = await resend.emails.send({
      from: 'COD3.0 <onboarding@resend.dev>',
      to: ['criptounam@gmail.com'],
      subject: '🔍 Debug Email - COD3.0',
      html: testEmailContent,
    });

    console.log('✅ Email enviado exitosamente');
    console.log('📧 Resultado completo:', JSON.stringify(result, null, 2));
    console.log('📧 ID del email:', result.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Email de debug enviado exitosamente',
      emailId: result.data?.id,
      result: result
    });

  } catch (error) {
    console.error('❌ Error en debug de email:', error);
    
    // Log detallado del error
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      type: typeof error,
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.error('📋 Detalles del error:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Error al enviar email de debug',
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
