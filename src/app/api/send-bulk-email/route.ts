import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailQueue } from '@/lib/email-queue';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { emailType, recipients, customData } = await request.json();
    
    console.log('📧 Iniciando envío masivo de emails...');
    console.log('📋 Tipo de email:', emailType);
    console.log('👥 Destinatarios:', recipients.length);
    
    const results = [];
    const queuedEmails = [];
    
    // Agregar todos los emails a la cola
    for (const recipient of recipients) {
      try {
        let emailContent = '';
        let subject = '';
        
        // Generar contenido basado en el tipo de email
        switch (emailType) {
          case 'welcome':
            emailContent = generateWelcomeEmail(recipient, customData);
            subject = '¡Bienvenido al COD3.0 HACKATHON!';
            break;
          case 'reminder':
            emailContent = generateReminderEmail(recipient, customData);
            subject = 'Recordatorio: COD3.0 HACKATHON - 27 de Marzo';
            break;
          case 'update':
            emailContent = generateUpdateEmail(recipient, customData);
            subject = 'Actualización importante - COD3.0 HACKATHON';
            break;
          case 'custom':
            emailContent = customData.content;
            subject = customData.subject;
            break;
          default:
            throw new Error('Tipo de email no válido');
        }
        
        // Agregar a la cola en lugar de enviar directamente
        const jobId = emailQueue.addEmail({
          from: 'COD3.0 <hola@code3mx.com>',
          to: recipient.email,
          subject: subject,
          html: emailContent,
          maxRetries: 3
        });
        
        queuedEmails.push({
          email: recipient.email,
          jobId: jobId,
          status: 'queued'
        });
        
        console.log(`📧 Email agregado a la cola: ${recipient.email} (Job: ${jobId})`);
        
      } catch (error) {
        console.error(`❌ Error preparando email para ${recipient.email}:`, error);
        results.push({
          email: recipient.email,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }
    
    // Obtener estado de la cola
    const queueStatus = emailQueue.getQueueStatus();
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    const queuedCount = queuedEmails.length;
    
    console.log(`📊 Resumen: ${queuedCount} emails en cola, ${successCount} exitosos, ${failureCount} fallidos`);
    
    return NextResponse.json({
      success: true,
      message: `Emails agregados a la cola: ${queuedCount} emails. Los emails se enviarán automáticamente respetando el rate limit de Resend.`,
      results: {
        queued: queuedEmails,
        failed: results
      },
      summary: {
        total: recipients.length,
        queued: queuedCount,
        successful: successCount,
        failed: failureCount,
        queueStatus: queueStatus
      }
    });
    
  } catch (error) {
    console.error('❌ Error en envío masivo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para generar email de bienvenida
function generateWelcomeEmail(recipient: { nombre: string; email: string }, _customData: { updates?: string[] }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido al COD3.0 HACKATHON</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 40px 30px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEN.png" alt="COD3.0 Logo" style="width: 150px; height: 150px; margin: 0 auto 20px; display: block;">
          <h1 style="color: #00ff00; margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase;">¡BIENVENIDO!</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${recipient.nombre}!</h2>
          <p style="color: #333333; line-height: 1.7; font-size: 18px;">
            🎉 <strong>¡Bienvenido al COD3.0 HACKATHON!</strong><br>
            Estamos emocionados de tenerte como parte de esta increíble experiencia tecnológica.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #00ff00;">
            <h3 style="color: #000000; margin: 0 0 15px 0; font-size: 20px;">📅 Fecha del Evento</h3>
            <p style="color: #333333; margin: 0; font-size: 16px;"><strong>27 de Marzo, 2026</strong></p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://cod3-0.vercel.app/" style="background: #00ff00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              🌐 Visitar Sitio Web
            </a>
          </div>
        </div>
        
        <div style="background: #000000; padding: 25px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEB.png" alt="CODEB Logo" style="width: 80px; height: 80px; margin: 0 auto 15px; display: block;">
          <div style="color: #00ff00; font-size: 18px; font-weight: bold;">COD3.0 HACKATHON</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para generar email de recordatorio
function generateReminderEmail(recipient: { nombre: string; email: string }, _customData: { updates?: string[] }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio - COD3.0 HACKATHON</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 40px 30px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEN.png" alt="COD3.0 Logo" style="width: 150px; height: 150px; margin: 0 auto 20px; display: block;">
          <h1 style="color: #00ff00; margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase;">¡RECORDATORIO!</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${recipient.nombre}!</h2>
          <p style="color: #333333; line-height: 1.7; font-size: 18px;">
            ⏰ <strong>¡No olvides!</strong> El COD3.0 HACKATHON está cada vez más cerca.
          </p>
          
          <div style="background: #fff3cd; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #ffc107;">
            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 20px;">📅 Fecha del Evento</h3>
            <p style="color: #856404; margin: 0; font-size: 18px; font-weight: bold;">27 de Marzo, 2026</p>
            <p style="color: #856404; margin: 10px 0 0 0; font-size: 16px;">¡Prepárate para una experiencia increíble!</p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://cod3-0.vercel.app/" style="background: #00ff00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              🌐 Visitar Sitio Web
            </a>
          </div>
        </div>
        
        <div style="background: #000000; padding: 25px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEB.png" alt="CODEB Logo" style="width: 80px; height: 80px; margin: 0 auto 15px; display: block;">
          <div style="color: #00ff00; font-size: 18px; font-weight: bold;">COD3.0 HACKATHON</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para generar email de actualización
function generateUpdateEmail(recipient: { nombre: string; email: string }, customData: { updates?: string[] }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Actualización - COD3.0 HACKATHON</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 40px 30px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEN.png" alt="COD3.0 Logo" style="width: 150px; height: 150px; margin: 0 auto 20px; display: block;">
          <h1 style="color: #00ff00; margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase;">¡ACTUALIZACIÓN!</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px;">¡Hola ${recipient.nombre}!</h2>
          <p style="color: #333333; line-height: 1.7; font-size: 18px;">
            📢 <strong>¡Tenemos noticias importantes!</strong> Te compartimos las últimas actualizaciones del COD3.0 HACKATHON.
          </p>
          
          <div style="background: #d1ecf1; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #bee5eb;">
            <h3 style="color: #0c5460; margin: 0 0 15px 0; font-size: 20px;">📋 Actualizaciones</h3>
            <div style="color: #0c5460; line-height: 1.8;">
              ${customData.updates ? customData.updates.map((update: string) => `<p style="margin: 8px 0;">• ${update}</p>`).join('') : '<p>Próximamente más información...</p>'}
            </div>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://cod3-0.vercel.app/" style="background: #00ff00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              🌐 Visitar Sitio Web
            </a>
          </div>
        </div>
        
        <div style="background: #000000; padding: 25px; text-align: center;">
          <img src="https://cod3-0.vercel.app/CODEB.png" alt="CODEB Logo" style="width: 80px; height: 80px; margin: 0 auto 15px; display: block;">
          <div style="color: #00ff00; font-size: 18px; font-weight: bold;">COD3.0 HACKATHON</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
