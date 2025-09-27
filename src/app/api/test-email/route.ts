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
    
    // Usar el email oficial hola@code3mx.com
    let fromEmail = 'COD3.0 <hola@code3mx.com>';
    let result;
    
    try {
      console.log('📤 Enviando con hola@code3mx.com...');
      result = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '🧪 Prueba de Email - COD3.0 HACKATHON',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fff;">
            <div style="background: linear-gradient(90deg, #00ff00 0%, #00cc00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: 900;">🧪 PRUEBA DE EMAIL</h1>
              <p style="color: #000; margin: 10px 0 0 0; font-size: 16px;">COD3.0 HACKATHON</p>
            </div>
            
            <div style="padding: 30px; background: #1a1a1a; border-radius: 0 0 10px 10px;">
              <h2 style="color: #00ff00; margin: 0 0 20px 0;">¡Hola!</h2>
              
              <p style="color: #ffffff; line-height: 1.7; margin-bottom: 25px;">
                🎉 <strong>¡Felicidades!</strong> Este es un email de prueba para verificar que el sistema de correos está funcionando correctamente.
              </p>
              
              <div style="background: rgba(0, 255, 0, 0.1); padding: 20px; border-radius: 8px; border: 2px solid #00ff00; margin: 20px 0;">
                <h3 style="color: #00ff00; margin: 0 0 15px 0;">✅ Estado del Sistema:</h3>
                <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>✅ Resend API conectada</li>
                  <li>✅ Email hola@code3mx.com funcionando</li>
                  <li>✅ Email enviado exitosamente</li>
                  <li>✅ Sistema de correos operativo</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #00ff00; font-weight: bold; font-size: 18px;">
                  ¡El sistema de correos está funcionando perfectamente!
                </p>
              </div>
              
              <p style="color: #cccccc; text-align: center; font-size: 14px; margin: 20px 0 0 0;">
                Si recibes este email, el sistema de correos está funcionando correctamente.<br>
                <strong style="color: #00ff00;">¡Nos vemos en el hackathon!</strong>
              </p>
            </div>
          </div>
        `,
      });
      console.log('✅ Email enviado con hola@code3mx.com');
    } catch (emailError) {
      console.log('⚠️ Error con hola@code3mx.com, usando respaldo...');
      console.log('📋 Error:', emailError.message);
      
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
                <li>⚠️ hola@code3mx.com no disponible</li>
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