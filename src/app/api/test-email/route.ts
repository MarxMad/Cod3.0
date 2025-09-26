import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Iniciando prueba de email...');
    
    // Verificar variables de entorno
    console.log('🔧 Variables de entorno:');
    console.log('  - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada');
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY no está configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Intentar con dominio personalizado primero
    let fromEmail = 'COD3.0 <hola@cod3mx.com>';
    let result;
    
    try {
      console.log('📤 Intentando enviar con dominio personalizado...');
      result = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '🧪 Prueba de Email - COD3.0 HACKATHON',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00ff00; text-align: center;">🧪 Prueba de Email</h1>
            <p>¡Hola! Este es un email de prueba para verificar que el sistema de correos está funcionando correctamente.</p>
            <p><strong>Dominio usado:</strong> ${fromEmail}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>✅ Estado del Sistema:</h3>
              <ul>
                <li>✅ Resend API conectada</li>
                <li>✅ Dominio personalizado funcionando</li>
                <li>✅ Email enviado exitosamente</li>
              </ul>
            </div>
            <p style="text-align: center; color: #666;">
              Si recibes este email, el sistema de correos está funcionando correctamente.
            </p>
          </div>
        `,
      });
      console.log('✅ Email enviado con dominio personalizado');
    } catch (domainError) {
      console.log('⚠️ Error con dominio personalizado, intentando con onboarding...');
      console.log('📋 Error:', domainError);
      
      fromEmail = 'COD3.0 <onboarding@resend.dev>';
      result = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '🧪 Prueba de Email - COD3.0 HACKATHON',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00ff00; text-align: center;">🧪 Prueba de Email</h1>
            <p>¡Hola! Este es un email de prueba para verificar que el sistema de correos está funcionando correctamente.</p>
            <p><strong>Dominio usado:</strong> ${fromEmail}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>⚠️ Estado del Sistema:</h3>
              <ul>
                <li>✅ Resend API conectada</li>
                <li>⚠️ Dominio personalizado no disponible</li>
                <li>✅ Email enviado con dominio de respaldo</li>
              </ul>
            </div>
            <p style="text-align: center; color: #666;">
              Si recibes este email, el sistema de correos está funcionando correctamente.
            </p>
          </div>
        `,
      });
      console.log('✅ Email enviado con dominio de respaldo');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      from: fromEmail,
      emailId: result.data?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    return NextResponse.json(
      { 
        error: 'Error al enviar email de prueba',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}