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
          .mobile-title { font-size: 20px !important; }
          .mobile-subtitle { font-size: 14px !important; }
          .mobile-section { padding: 20px 15px !important; margin: 15px 0 !important; }
          .mobile-text { font-size: 15px !important; line-height: 1.6 !important; }
          .mobile-button { padding: 12px 20px !important; font-size: 14px !important; margin: 8px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 255, 0, 0.1);">
        
        <!-- Header con Logo -->
        <div class="mobile-header" style="background: linear-gradient(90deg, #00ff00 0%, #00cc00 100%); padding: 30px; text-align: center;">
          <div style="background: #000; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid #00ff00;">
            <span style="color: #00ff00; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace;">COD3.0</span>
          </div>
          <h1 class="mobile-title" style="color: #000; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">HACKATHON</h1>
          <p class="mobile-subtitle" style="color: #000; margin: 10px 0 0 0; font-size: 16px; font-weight: 600;">¡Registro Confirmado!</p>
        </div>
        
        <!-- Contenido Principal -->
        <div class="mobile-container" style="padding: 40px 30px;">
          <div style="background: rgba(0, 255, 0, 0.05); padding: 30px; border-radius: 12px; border: 2px solid #00ff00; margin-bottom: 30px;">
            <h2 style="color: #00ff00; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">¡Hola ${registro.nombre} ${registro.apellido}!</h2>
            
            <p style="color: #ffffff; line-height: 1.7; margin-bottom: 25px; font-size: 16px;">
              🎉 <strong>¡Felicidades!</strong> Tu registro para el <strong style="color: #00ff00;">COD3.0 HACKATHON</strong> ha sido confirmado exitosamente. Estamos emocionados de tenerte como parte de esta experiencia tecnológica única.
            </p>
            
            <!-- Detalles del Registro -->
            <div class="mobile-section" style="background: rgba(0, 0, 0, 0.6); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #00ff00;">
              <h3 style="color: #00ff00; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">📋 Detalles de tu Registro</h3>
              <div style="color: #ffffff; line-height: 1.8;">
                <p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">📧 Email:</strong> ${registro.email}</p>
                <p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">🎯 Nivel de Experiencia:</strong> ${registro.experiencia.charAt(0).toUpperCase() + registro.experiencia.slice(1)}</p>
                <p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">👥 Participación:</strong> ${registro.equipo === 'equipo' ? 'Con Equipo' : 'Individual'}</p>
                ${registro.equipo === 'equipo' && registro.nombreEquipo ? `<p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">🏆 Nombre del Equipo:</strong> ${registro.nombreEquipo}</p>` : ''}
                ${registro.universidad ? `<p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">🎓 Universidad:</strong> ${registro.universidad}</p>` : ''}
                ${registro.carrera ? `<p class="mobile-text" style="margin: 8px 0; color: #ffffff;"><strong style="color: #00ff00;">📚 Carrera:</strong> ${registro.carrera}</p>` : ''}
              </div>
            </div>
            
            <!-- Información del Hackathon -->
            <div class="mobile-section" style="background: rgba(0, 100, 255, 0.2); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #0066ff;">
              <h3 style="color: #0066ff; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">🚀 ¿Qué sigue ahora?</h3>
              <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">📅 Fecha del Evento:</strong> 15-17 de Diciembre, 2024</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">📍 Ubicación:</strong> Centro de Innovación Tech</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">⏰ Duración:</strong> 48 horas continuas de programación intensiva</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">🏆 Premios:</strong> Más de $50,000 en premios increíbles</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">🍕 Comida:</strong> Comidas y bebidas incluidas durante el evento</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">💻 Equipamiento:</strong> Trae tu laptop y cargador</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">👥 Equipos:</strong> Máximo 4 personas por equipo</li>
              </ul>
            </div>
            
            <!-- Programa del Evento -->
            <div class="mobile-section" style="background: rgba(255, 165, 0, 0.2); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #ffa500;">
              <h3 style="color: #ffa500; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">📅 Programa del Evento</h3>
              <div style="color: #ffffff; line-height: 1.8;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #ffa500;">Día 1 - Viernes:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">09:00 - Registro y Check-in</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">10:00 - Ceremonia de Apertura</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">11:00 - Presentación de Desafíos</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">12:00 - Formación de Equipos</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">13:00 - ¡Comienza la Programación!</span>
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #ffa500;">Día 2 - Sábado:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">00:00 - Programación Continúa</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">12:00 - Mentoring Sessions</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">18:00 - Networking Event</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">20:00 - Charlas Técnicas</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">24:00 - Programación Nocturna</span>
                </div>
                <div>
                  <strong style="color: #ffa500;">Día 3 - Domingo:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">09:00 - Últimas Horas</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">12:00 - Deadline de Entrega</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">14:00 - Presentaciones</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">16:00 - Evaluación del Jurado</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">18:00 - Ceremonia de Premiación</span>
                </div>
              </div>
            </div>
            
            <!-- Premios -->
            <div class="mobile-section" style="background: rgba(128, 0, 128, 0.2); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #800080;">
              <h3 style="color: #800080; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">🏆 Premios Increíbles</h3>
              <div style="color: #ffffff; line-height: 1.8;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #800080;">🥇 1er Lugar - $25,000:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Premio en efectivo</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Mentoring con expertos</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Incubación de startup</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Viaje a conferencia tech</span>
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #800080;">🥈 2do Lugar - $15,000:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Premio en efectivo</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Acceso a coworking</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Networking premium</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Certificaciones tech</span>
                </div>
                <div>
                  <strong style="color: #800080;">🥉 3er Lugar - $10,000:</strong><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Premio en efectivo</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Cursos online premium</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Hardware de desarrollo</span><br>
                  <span class="mobile-text" style="margin-left: 20px; color: #ffffff;">• Membresía a comunidad</span>
                </div>
              </div>
            </div>
            
            <!-- Preparación -->
            <div class="mobile-section" style="background: rgba(0, 255, 0, 0.2); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #00ff00;">
              <h3 style="color: #00ff00; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">⚡ Prepárate para el Hackathon</h3>
              <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">💡 Ideas:</strong> Comienza a pensar en ideas innovadoras</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">🛠️ Herramientas:</strong> Familiarízate con las tecnologías que planeas usar</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">👥 Networking:</strong> Conecta con otros participantes en nuestras redes</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">📚 Recursos:</strong> Revisa la documentación técnica que te enviaremos</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">🎯 Objetivos:</strong> Define qué quieres lograr en el hackathon</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">🔧 APIs:</strong> Acceso a APIs y herramientas premium</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">👨‍🏫 Mentoring:</strong> Mentoring con expertos de la industria</li>
                <li class="mobile-text" style="color: #ffffff;"><strong style="color: #ffffff;">📜 Certificado:</strong> Certificado de participación incluido</li>
              </ul>
            </div>
            
            <!-- Botones de Acción -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://cod3-0.vercel.app/" style="background: linear-gradient(45deg, #00ff00, #00cc00); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px; box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);">
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
