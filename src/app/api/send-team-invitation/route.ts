import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, equipoId, equipoNombre, invitadoPor } = await request.json();

    if (!email || !equipoId || !equipoNombre || !invitadoPor) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario esté registrado en el hackathon
    const { data: user, error: userError } = await supabase
      .from('registros_hackathon')
      .select('email, nombre, apellido')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'El usuario no está registrado en el hackathon' },
        { status: 404 }
      );
    }

    // Verificar que el equipo existe y el invitador es el líder
    const { data: equipo, error: equipoError } = await supabase
      .from('equipos')
      .select('*')
      .eq('id', equipoId)
      .eq('lider_email', invitadoPor)
      .single();

    if (equipoError || !equipo) {
      return NextResponse.json(
        { error: 'No tienes permisos para invitar a este equipo' },
        { status: 403 }
      );
    }

    // Verificar si ya es miembro del equipo
    const { data: existingMember } = await supabase
      .from('equipo_miembros')
      .select('*')
      .eq('equipo_id', equipoId)
      .eq('email_miembro', email)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'El usuario ya es miembro de este equipo' },
        { status: 400 }
      );
    }

    // Crear invitación en la base de datos
    const { data: invitacion, error: invitacionError } = await supabase
      .from('equipo_miembros')
      .insert({
        equipo_id: equipoId,
        email_miembro: email,
        rol: 'miembro',
        estado_invitacion: 'pendiente',
        invitado_por: invitadoPor
      })
      .select()
      .single();

    if (invitacionError) {
      return NextResponse.json(
        { error: 'Error al crear la invitación' },
        { status: 500 }
      );
    }

    // Enviar email de invitación
    const acceptUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/invitacion/${invitacion.id}`;
    
    const { error: emailError } = await resend.emails.send({
      from: 'COD3.0 Hackathon <hola@code3mx.com>',
      to: [email],
      subject: `Invitación al equipo ${equipoNombre} - COD3.0 Hackathon`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff00; font-size: 28px; margin: 0;">COD3.0 Hackathon</h1>
            <p style="color: #666; margin: 10px 0;">Invitación al equipo</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">¡Has sido invitado a un equipo!</h2>
            <p style="color: #666; margin-bottom: 15px;">
              Hola <strong>${user.nombre} ${user.apellido}</strong>,
            </p>
            <p style="color: #666; margin-bottom: 15px;">
              Has sido invitado a formar parte del equipo <strong>"${equipoNombre}"</strong> en el COD3.0 Hackathon.
            </p>
            <p style="color: #666; margin-bottom: 20px;">
              <strong>Descripción del equipo:</strong><br>
              ${equipo.descripcion || 'Sin descripción disponible'}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${acceptUrl}" 
               style="display: inline-block; background: #00ff00; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Aceptar Invitación
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Si no deseas unirte a este equipo, simplemente ignora este email.
            </p>
            <p style="color: #999; font-size: 12px;">
              Este enlace expirará en 7 días.
            </p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitación enviada exitosamente',
      invitacionId: invitacion.id
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
