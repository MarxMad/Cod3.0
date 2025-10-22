import { NextRequest, NextResponse } from 'next/server';
import { queueEmail } from '@/lib/email-queue';

export async function POST(request: NextRequest) {
  try {
    const { email, nombre } = await request.json();

    if (!email || !nombre) {
      return NextResponse.json({
        error: 'Email y nombre son requeridos'
      }, { status: 400 });
    }

    // Simular datos de registro
    const registroData = {
      email,
      nombre,
      apellido: 'Test',
      telefono: '1234567890',
      universidad: 'Universidad Test',
      carrera: 'Ingeniería Test',
      semestre: '8',
      experiencia: 'Intermedio',
      interes: 'Desarrollo Web',
      nombreEquipo: 'Equipo Test',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
      portfolio: 'https://test.com',
      expectativas: 'Aprender y ganar',
      alergias: 'Ninguna',
      transporte: 'Propio',
      hospedaje: 'No',
      talla: 'M',
      emergencia: '1234567890',
      emergenciaRelacion: 'Padre'
    };

    // Crear el contenido del email de confirmación
    const emailContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>COD3.0 HACKATHON - Registro Confirmado</title>
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-container { padding: 20px 15px !important; }
            .mobile-header { padding: 20px 15px !important; }
            .mobile-title { font-size: 24px !important; }
            .mobile-subtitle { font-size: 16px !important; }
            .mobile-text { font-size: 16px !important; line-height: 1.6 !important; }
            .mobile-button { padding: 12px 20px !important; font-size: 14px !important; margin: 8px !important; }
            .mobile-logo { width: 120px !important; height: 120px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 0; overflow: hidden;">
          
          <!-- Header con Logo -->
          <div class="mobile-header" style="background: #000000; padding: 40px 30px; text-align: center;">
            <img src="https://cod3-0.vercel.app/CODEN.png" alt="COD3.0 Logo" class="mobile-logo" style="width: 150px; height: 150px; margin: 0 auto 20px; display: block;">
            <h1 class="mobile-title" style="color: #00ff00; margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">¡REGISTRO CONFIRMADO!</h1>
            <p class="mobile-subtitle" style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">COD3.0 HACKATHON</p>
          </div>
          
          <!-- Contenido Principal -->
          <div class="mobile-container" style="padding: 40px 30px; background: #ffffff;">
            
            <!-- Saludo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">¡Hola ${registroData.nombre}!</h2>
              <p class="mobile-text" style="color: #333333; line-height: 1.7; margin-bottom: 25px; font-size: 18px;">
                🎉 <strong>¡Felicidades!</strong> Tu registro para el <strong style="color: #00ff00;">COD3.0 HACKATHON</strong> ha sido confirmado exitosamente.
              </p>
            </div>
            
            <!-- Información Básica -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #00ff00;">
              <h3 style="color: #000000; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">📋 Información de tu Registro</h3>
              <div style="color: #333333; line-height: 1.8;">
                <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">📧 Email:</strong> ${registroData.email}</p>
                <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">👤 Nombre:</strong> ${registroData.nombre} ${registroData.apellido}</p>
                <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">🏫 Universidad:</strong> ${registroData.universidad}</p>
                <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">👥 Equipo:</strong> ${registroData.nombreEquipo}</p>
              </div>
            </div>
            
            <!-- Información del Evento -->
            <div style="background: #e8f5e8; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #00ff00;">
              <h3 style="color: #000000; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">🚀 Información del Evento</h3>
              <ul style="color: #333333; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li class="mobile-text" style="color: #333333;"><strong style="color: #000000;">📅 Fecha:</strong> 27 de Marzo, 2026</li>
                <li class="mobile-text" style="color: #333333;"><strong style="color: #000000;">📍 Ubicación:</strong> Por confirmar</li>
                <li class="mobile-text" style="color: #333333;"><strong style="color: #000000;">⏰ Duración:</strong> 48 horas</li>
                <li class="mobile-text" style="color: #333333;"><strong style="color: #000000;">🏆 Premios:</strong> Más de $50,000 en premios</li>
              </ul>
            </div>
            
            <!-- Próximos Pasos -->
            <div style="background: #f0f8ff; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #0066ff;">
              <h3 style="color: #000000; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">📬 ¿Qué sigue ahora?</h3>
              <p class="mobile-text" style="color: #333333; line-height: 1.7; margin-bottom: 15px;">
                Te mantendremos informado sobre todos los detalles del evento a medida que los confirmemos. 
                Recibirás actualizaciones sobre:
              </p>
              <ul style="color: #333333; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li class="mobile-text" style="color: #333333;">📍 Ubicación exacta del evento</li>
                <li class="mobile-text" style="color: #333333;">📅 Horarios detallados</li>
                <li class="mobile-text" style="color: #333333;">🍕 Información sobre comidas</li>
                <li class="mobile-text" style="color: #333333;">💻 Requisitos técnicos</li>
                <li class="mobile-text" style="color: #333333;">👥 Formación de equipos</li>
              </ul>
            </div>
            
            <!-- Botón de Acción -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://cod3-0.vercel.app/" class="mobile-button" style="background: #00ff00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px; box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);">
                🌐 Visitar Sitio Web
              </a>
            </div>
            
            <!-- Mensaje Final -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #e9ecef;">
              <p style="color: #333333; line-height: 1.6; margin: 0; font-size: 16px;">
                <strong style="color: #00ff00;">¡Estamos emocionados de verte en el COD3.0 HACKATHON!</strong><br>
                Prepárate para una experiencia increíble llena de innovación y aprendizaje.
              </p>
            </div>
            
            <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px; text-align: center;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong style="color: #00ff00;">¡Nos vemos pronto en el hackathon!</strong>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #000000; padding: 25px; text-align: center; border-top: 2px solid #00ff00;">
            <img src="https://cod3-0.vercel.app/CODEB.png" alt="CODEB Logo" style="width: 80px; height: 80px; margin: 0 auto 15px; display: block;">
            <div style="color: #00ff00; font-size: 18px; font-weight: bold; margin-bottom: 10px;">COD3.0 HACKATHON</div>
            <p style="color: #888888; margin: 0; font-size: 12px;">
              © 2026 COD3.0 HACKATHON. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email usando la cola
    const jobId = await queueEmail(
      'COD3.0 <hola@code3mx.com>',
      email,
      '¡Registro Confirmado - COD3.0 HACKATHON!',
      emailContent
    );

    return NextResponse.json({
      success: true,
      message: `Email de prueba enviado a ${email}`,
      jobId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error enviando email de prueba',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
