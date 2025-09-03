import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST() {
  try {
    console.log('🧪 Iniciando prueba de email...');
    console.log('🔑 RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY no está configurada' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const testEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Prueba de Email - COD3.0</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; border-radius: 15px; border: 2px solid #00ff00;">
          <h1 style="color: #00ff00; text-align: center;">🧪 Prueba de Email</h1>
          <p style="color: #ffffff; text-align: center;">Este es un email de prueba para verificar que Resend está funcionando correctamente.</p>
          <div style="background: rgba(0, 255, 0, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #00ff00;">
            <p style="color: #00ff00; margin: 0; font-weight: bold;">✅ Si recibes este email, Resend está funcionando correctamente!</p>
          </div>
          <p style="color: #cccccc; text-align: center; font-size: 14px;">COD3.0 HACKATHON - Sistema de Emails</p>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'COD3.0 <onboarding@resend.dev>',
      to: ['criptounam@gmail.com'], // Email de prueba
      subject: '🧪 Prueba de Email - COD3.0 HACKATHON',
      html: testEmailContent,
    });

    console.log('✅ Email de prueba enviado exitosamente');
    console.log('📧 ID del email:', result.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      emailId: result.data?.id
    });

  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    return NextResponse.json(
      { 
        error: 'Error al enviar email de prueba',
        details: error.message,
        type: typeof error
      },
      { status: 500 }
    );
  }
}
