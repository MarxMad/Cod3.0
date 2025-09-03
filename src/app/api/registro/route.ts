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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ff00; margin: 0; font-size: 32px;">COD3.0 HACKATHON</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px;">¡Registro Confirmado!</p>
        </div>
        
        <div style="background: rgba(0, 255, 0, 0.1); padding: 30px; border-radius: 8px; border: 2px solid #00ff00;">
          <h2 style="color: #00ff00; margin: 0 0 20px 0;">Hola ${registro.nombre} ${registro.apellido},</h2>
          
          <p style="color: #ffffff; line-height: 1.6; margin-bottom: 20px;">
            Tu registro para el <strong>COD3.0 HACKATHON</strong> ha sido confirmado exitosamente.
          </p>
          
          <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #00ff00; margin: 0 0 15px 0;">Detalles del Registro:</h3>
            <ul style="color: #ffffff; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Email:</strong> ${registro.email}</li>
              <li><strong>Experiencia:</strong> ${registro.experiencia}</li>
              <li><strong>Participación:</strong> ${registro.equipo === 'equipo' ? 'Con Equipo' : 'Individual'}</li>
              ${registro.equipo === 'equipo' && registro.nombreEquipo ? `<li><strong>Nombre del Equipo:</strong> ${registro.nombreEquipo}</li>` : ''}
            </ul>
          </div>
          
          <p style="color: #ffffff; line-height: 1.6; margin-bottom: 20px;">
            En las próximas 24 horas recibirás información adicional sobre:
          </p>
          
          <ul style="color: #ffffff; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
            <li>Detalles del evento y horarios</li>
            <li>Información sobre tu equipo (si aplica)</li>
            <li>Recursos y documentación técnica</li>
            <li>Instrucciones para el día del hackathon</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cod3-hackathon.vercel.app" style="background: #00ff00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Visitar Sitio Web
            </a>
          </div>
          
          <p style="color: #ffffff; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="color: #666; margin: 0; font-size: 12px;">
            © 2024 COD3.0 HACKATHON. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
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
