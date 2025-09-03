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
      nombreequipo: body.nombreEquipo || null,
      proyecto: body.proyecto || null,
      motivacion: body.motivacion
    });
    
    let data;
    try {
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
          nombreequipo: body.nombreEquipo || null,
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
          { error: 'Error al guardar el registro', details: result.error.message },
          { status: 500 }
        );
      }
      
      data = result.data;
      console.log('✅ Datos guardados en Supabase:', data);
    } catch (supabaseError) {
      console.error('❌ Error de conexión a Supabase:', supabaseError);
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 500 }
      );
    }

    // Enviar email de confirmación
    try {
      await sendConfirmationEmail(body);
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No fallamos si el email falla, solo lo registramos
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
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const emailContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>COD3.0 HACKATHON - Registro Confirmado</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 255, 0, 0.1);">
        
        <!-- Header con Logo -->
        <div style="background: linear-gradient(90deg, #00ff00 0%, #00cc00 100%); padding: 30px; text-align: center;">
          <div style="background: #000; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid #00ff00;">
            <span style="color: #00ff00; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">COD3.0</span>
          </div>
          <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">HACKATHON</h1>
          <p style="color: #000; margin: 10px 0 0 0; font-size: 16px; font-weight: 600;">¡Registro Confirmado!</p>
        </div>
        
        <!-- Contenido Principal -->
        <div style="padding: 40px 30px;">
          <div style="background: rgba(0, 255, 0, 0.05); padding: 30px; border-radius: 12px; border: 2px solid #00ff00; margin-bottom: 30px;">
            <h2 style="color: #00ff00; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">¡Hola ${registro.nombre} ${registro.apellido}!</h2>
            
            <p style="color: #ffffff; line-height: 1.7; margin-bottom: 25px; font-size: 16px;">
              🎉 <strong>¡Felicidades!</strong> Tu registro para el <strong style="color: #00ff00;">COD3.0 HACKATHON</strong> ha sido confirmado exitosamente. Estamos emocionados de tenerte como parte de esta experiencia tecnológica única.
            </p>
            
            <!-- Detalles del Registro -->
            <div style="background: rgba(0, 0, 0, 0.4); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #00ff00;">
              <h3 style="color: #00ff00; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">📋 Detalles de tu Registro</h3>
              <div style="color: #ffffff; line-height: 1.8;">
                <p style="margin: 8px 0;"><strong style="color: #00ff00;">📧 Email:</strong> ${registro.email}</p>
                <p style="margin: 8px 0;"><strong style="color: #00ff00;">🎯 Nivel de Experiencia:</strong> ${registro.experiencia.charAt(0).toUpperCase() + registro.experiencia.slice(1)}</p>
                <p style="margin: 8px 0;"><strong style="color: #00ff00;">👥 Participación:</strong> ${registro.equipo === 'equipo' ? 'Con Equipo' : 'Individual'}</p>
                ${registro.equipo === 'equipo' && registro.nombreEquipo ? `<p style="margin: 8px 0;"><strong style="color: #00ff00;">🏆 Nombre del Equipo:</strong> ${registro.nombreEquipo}</p>` : ''}
                ${registro.universidad ? `<p style="margin: 8px 0;"><strong style="color: #00ff00;">🎓 Universidad:</strong> ${registro.universidad}</p>` : ''}
                ${registro.carrera ? `<p style="margin: 8px 0;"><strong style="color: #00ff00;">📚 Carrera:</strong> ${registro.carrera}</p>` : ''}
              </div>
            </div>
            
            <!-- Información del Hackathon -->
            <div style="background: rgba(0, 100, 255, 0.1); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #0066ff;">
              <h3 style="color: #0066ff; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">🚀 ¿Qué sigue ahora?</h3>
              <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>📅 Fecha del Evento:</strong> Próximamente te enviaremos la fecha exacta</li>
                <li><strong>📍 Ubicación:</strong> Se confirmará en los próximos días</li>
                <li><strong>⏰ Duración:</strong> 24-48 horas de programación intensiva</li>
                <li><strong>🏆 Premios:</strong> Premios increíbles para los mejores proyectos</li>
                <li><strong>🍕 Comida:</strong> Comidas y snacks incluidos durante el evento</li>
                <li><strong>💻 Equipamiento:</strong> Trae tu laptop y cargador</li>
              </ul>
            </div>
            
            <!-- Preparación -->
            <div style="background: rgba(255, 165, 0, 0.1); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #ffa500;">
              <h3 style="color: #ffa500; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">⚡ Prepárate para el Hackathon</h3>
              <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>💡 Ideas:</strong> Comienza a pensar en ideas innovadoras</li>
                <li><strong>🛠️ Herramientas:</strong> Familiarízate con las tecnologías que planeas usar</li>
                <li><strong>👥 Networking:</strong> Conecta con otros participantes en nuestras redes</li>
                <li><strong>📚 Recursos:</strong> Revisa la documentación técnica que te enviaremos</li>
                <li><strong>🎯 Objetivos:</strong> Define qué quieres lograr en el hackathon</li>
              </ul>
            </div>
            
            <!-- Botones de Acción -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://cod3-hackathon.vercel.app" style="background: linear-gradient(45deg, #00ff00, #00cc00); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px; box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);">
                🌐 Visitar Sitio Web
              </a>
              <a href="mailto:contacto@cod3hackathon.com" style="background: linear-gradient(45deg, #0066ff, #0044cc); color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px; box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);">
                📧 Contactar Soporte
              </a>
            </div>
            
            <!-- Mensaje Final -->
            <div style="background: rgba(0, 255, 0, 0.1); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="color: #ffffff; line-height: 1.6; margin: 0; font-size: 16px;">
                <strong style="color: #00ff00;">¡Estamos emocionados de verte en el COD3.0 HACKATHON!</strong><br>
                Prepárate para una experiencia increíble llena de innovación, aprendizaje y diversión.
              </p>
            </div>
            
            <p style="color: #cccccc; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px; text-align: center;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.<br>
              <strong style="color: #00ff00;">¡Nos vemos pronto en el hackathon!</strong>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #000; padding: 25px; text-align: center; border-top: 2px solid #00ff00;">
          <div style="color: #00ff00; font-size: 18px; font-weight: bold; margin-bottom: 10px; font-family: 'Courier New', monospace;">COD3.0 HACKATHON</div>
          <p style="color: #888; margin: 0; font-size: 12px;">
            © 2024 COD3.0 HACKATHON. Todos los derechos reservados.<br>
            Construyendo el futuro, un código a la vez.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'COD3.0 <onboarding@resend.dev>',
      to: [registro.email],
      subject: '¡Registro Confirmado - COD3.0 HACKATHON!',
      html: emailContent,
    });
    
    console.log('✅ Email de confirmación enviado exitosamente a:', registro.email);
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}
