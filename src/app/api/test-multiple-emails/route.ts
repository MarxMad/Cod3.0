import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST() {
  try {
    console.log('🧪 Iniciando prueba con múltiples tipos de email...');
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY no está configurada' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Lista de emails de prueba de diferentes proveedores
    const testEmails = [
      'criptounam@gmail.com',      // Gmail
      'test@hotmail.com',          // Hotmail
      'test@outlook.com',          // Outlook
      'test@yahoo.com',            // Yahoo
      'test@live.com',             // Live
    ];
    
    const results = [];
    
    for (const email of testEmails) {
      try {
        console.log(`📧 Enviando a: ${email}`);
        
        const result = await resend.emails.send({
          from: 'COD3.0 <onboarding@resend.dev>',
          to: [email],
          subject: '🧪 Prueba Multi-Email - COD3.0 HACKATHON',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Prueba Multi-Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; border-radius: 15px; border: 2px solid #00ff00;">
                <h1 style="color: #00ff00; text-align: center;">🧪 Prueba Multi-Email</h1>
                <p style="color: #ffffff; text-align: center;">Este es un email de prueba para verificar compatibilidad con diferentes proveedores de email.</p>
                <div style="background: rgba(0, 255, 0, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #00ff00;">
                  <p style="color: #00ff00; margin: 0; font-weight: bold;">✅ Si recibes este email, tu proveedor es compatible con Resend!</p>
                  <p style="color: #ffffff; margin: 10px 0 0 0;">Proveedor: ${email.split('@')[1]}</p>
                  <p style="color: #ffffff; margin: 5px 0 0 0;">Timestamp: ${new Date().toISOString()}</p>
                </div>
                <p style="color: #cccccc; text-align: center; font-size: 14px;">COD3.0 HACKATHON - Sistema de Emails</p>
              </div>
            </body>
            </html>
          `,
        });

        results.push({
          email: email,
          success: true,
          emailId: result.data?.id,
          provider: email.split('@')[1]
        });
        
        console.log(`✅ Email enviado exitosamente a: ${email}`);
        
        // Pequeña pausa entre envíos para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error enviando a ${email}:`, error);
        results.push({
          email: email,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          provider: email.split('@')[1]
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Prueba multi-email completada',
      results: results,
      summary: {
        total: testEmails.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba multi-email:', error);
    return NextResponse.json(
      { 
        error: 'Error en prueba multi-email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
