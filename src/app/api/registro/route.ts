import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RegistroHackathon } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 API Route: /api/registro recibida');
    console.log('🔧 Variables de entorno:');
    console.log('  - SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada');
    console.log('  - SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada');
    console.log('  - RESEND_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada');
    
    const body: RegistroHackathon = await request.json();
    console.log('📋 Datos recibidos:', body);
    console.log('📋 Tipo de datos:', typeof body);
    console.log('📋 Keys del objeto:', Object.keys(body));
    
    // Validar campos requeridos
    if (!body.nombre || !body.apellido || !body.email || !body.experiencia || !body.equipo || !body.motivacion) {
      console.log('❌ Faltan campos requeridos');
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar si el email ya está registrado
    console.log('🔍 Verificando si el email ya existe...');
    const { data: existingUser } = await supabase
      .from('registros_hackathon')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      console.log('❌ Email ya registrado');
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Insertar en Supabase
    console.log('💾 Insertando datos en Supabase...');
    console.log('📝 Datos a insertar:', {
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono || null,
      universidad: body.universidad || null,
      carrera: body.carrera || null,
      github: body.github || null,
      linkedin: body.linkedin || null,
      portfolio: body.portfolio || null,
      experiencia: body.experiencia,
      equipo: body.equipo,
      nombreEquipo: body.nombreEquipo || null,
      proyecto: body.proyecto || null,
      motivacion: body.motivacion
    });
    
    let data;
    try {
      console.log('🔗 Intentando conectar con Supabase...');
      
      // Probar conexión primero
      const { data: testData, error: testError } = await supabase
        .from('registros_hackathon')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Error de conexión inicial:', testError);
        return NextResponse.json(
          { 
            error: 'Error de conexión a la base de datos', 
            details: testError.message,
            code: testError.code 
          },
          { status: 500 }
        );
      }
      
      console.log('✅ Conexión con Supabase establecida');
      
      const result = await supabase
        .from('registros_hackathon')
        .insert([{
          nombre: body.nombre,
          apellido: body.apellido,
          email: body.email,
          telefono: body.telefono || null,
          universidad: body.universidad || null,
          carrera: body.carrera || null,
          github: body.github || null,
          linkedin: body.linkedin || null,
          portfolio: body.portfolio || null,
          experiencia: body.experiencia,
          equipo: body.equipo,
          // nombreEquipo: body.nombreEquipo || null, // Temporalmente comentado
          proyecto: body.proyecto || null,
          motivacion: body.motivacion
        }])
        .select()
        .single();

      if (result.error) {
        console.error('❌ Error al insertar en Supabase:', result.error);
        console.error('❌ Código de error:', result.error.code);
        console.error('❌ Mensaje de error:', result.error.message);
        console.error('❌ Detalles del error:', result.error.details);
        return NextResponse.json(
          { 
            error: 'Error al guardar el registro', 
            details: result.error.message,
            code: result.error.code 
          },
          { status: 500 }
        );
      }
      
      data = result.data;
      console.log('✅ Datos guardados en Supabase:', data);
    } catch (supabaseError) {
      console.error('❌ Error de conexión a Supabase:', supabaseError);
      console.error('❌ Tipo de error:', typeof supabaseError);
      console.error('❌ Stack trace:', supabaseError instanceof Error ? supabaseError.stack : 'No stack available');
      return NextResponse.json(
        { 
          error: 'Error de conexión a la base de datos',
          details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError)
        },
        { status: 500 }
      );
    }

    // Enviar email de confirmación
    console.log('📧 Iniciando proceso de envío de email...');
    console.log('📧 Email destino:', body.email);
    console.log('📧 RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurada en el servidor');
    } else {
      try {
        console.log('📧 Intentando enviar email de confirmación...');
        const emailResult = await sendConfirmationEmail(body);
        console.log('✅ Email de confirmación enviado exitosamente');
        console.log('📧 Resultado del email:', emailResult);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
        console.error('📋 Detalles del error:', {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          name: emailError instanceof Error ? emailError.name : 'Unknown',
          stack: emailError instanceof Error ? emailError.stack : undefined
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso',
      data: data
    });

  } catch (error) {
    console.error('Error en la API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(registro: RegistroHackathon) {
  console.log('📧 Iniciando envío de email de confirmación...');
  console.log('🔑 RESEND_API_KEY configurada:', !!process.env.RESEND_API_KEY);
  console.log('📧 Email destino:', registro.email);
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
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
            <h2 style="color: #000000; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">¡Hola ${registro.nombre}!</h2>
            <p class="mobile-text" style="color: #333333; line-height: 1.7; margin-bottom: 25px; font-size: 18px;">
              🎉 <strong>¡Felicidades!</strong> Tu registro para el <strong style="color: #00ff00;">COD3.0 HACKATHON</strong> ha sido confirmado exitosamente.
            </p>
          </div>
          
          <!-- Información Básica -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #00ff00;">
            <h3 style="color: #000000; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">📋 Información de tu Registro</h3>
            <div style="color: #333333; line-height: 1.8;">
              <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">📧 Email:</strong> ${registro.email}</p>
              <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">🎯 Nivel:</strong> ${registro.experiencia.charAt(0).toUpperCase() + registro.experiencia.slice(1)}</p>
              <p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">👥 Participación:</strong> ${registro.equipo === 'equipo' ? 'Con Equipo' : 'Individual'}</p>
              ${registro.equipo === 'equipo' && registro.nombreEquipo ? `<p class="mobile-text" style="margin: 8px 0; color: #333333;"><strong style="color: #00ff00;">🏆 Equipo:</strong> ${registro.nombreEquipo}</p>` : ''}
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
          
          <!-- Imagen del Evento -->
          <div style="text-align: center; margin: 30px 0;">
            <img src="https://cod3-0.vercel.app/Stage.jpeg" alt="Stage del Evento" style="width: 100%; max-width: 500px; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="color: #666666; font-size: 14px; margin-top: 10px; font-style: italic;">Espacio donde se desarrollará el COD3.0 HACKATHON</p>
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

  try {
    console.log('📤 Enviando email con Resend...');
    
    // Usar el email oficial hola@code3mx.com
    let fromEmail = 'COD3.0 <hola@code3mx.com>';
    let result;
    
    try {
      console.log('📤 Enviando email con hola@code3mx.com...');
      result = await resend.emails.send({
        from: fromEmail,
        to: [registro.email],
        subject: '¡Registro Confirmado - COD3.0 HACKATHON!',
        html: emailContent,
      });
      console.log('✅ Email enviado con hola@code3mx.com');
    } catch (emailError) {
      console.log('⚠️ Error con hola@code3mx.com, usando respaldo...');
      console.log('📋 Error:', emailError instanceof Error ? emailError.message : String(emailError));
      
      fromEmail = 'COD3.0 <onboarding@resend.dev>';
      result = await resend.emails.send({
        from: fromEmail,
        to: [registro.email],
        subject: '¡Registro Confirmado - COD3.0 HACKATHON!',
        html: emailContent,
      });
      console.log('✅ Email enviado con onboarding@resend.dev');
    }
    
    console.log('✅ Email de confirmación enviado exitosamente a:', registro.email);
    console.log('📧 ID del email:', result.data?.id);
    
    return result;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    console.error('📋 Tipo de error:', typeof error);
    console.error('📋 Error completo:', JSON.stringify(error, null, 2));
    throw error;
  }
}
