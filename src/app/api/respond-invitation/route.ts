import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Función para registrar logs de actividad de equipos
async function logTeamActivity(equipoId: string, action: string, details: string, userEmail: string) {
  try {
    await supabase
      .from('team_activity_logs')
      .insert({
        equipo_id: equipoId,
        action,
        details,
        user_email: userEmail,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging team activity:', error);
    // No fallar la operación principal por un error de logging
  }
}

export async function POST(request: NextRequest) {
  try {
    const { invitacionId, accept, userEmail } = await request.json();

    // Validación de parámetros
    if (!invitacionId || typeof accept !== 'boolean' || !userEmail) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Obtener la invitación
    const { data: invitacion, error: invitacionError } = await supabase
      .from('equipo_miembros')
      .select(`
        *,
        equipos!equipo_miembros_equipo_id_fkey (*)
      `)
      .eq('id', invitacionId)
      .single();

    if (invitacionError || !invitacion) {
      console.error('Error fetching invitacion:', invitacionError);
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la invitación esté pendiente
    if (invitacion.estado_invitacion !== 'pendiente') {
      return NextResponse.json(
        { error: 'Esta invitación ya ha sido procesada' },
        { status: 400 }
      );
    }

    // Verificar que el email coincida
    if (invitacion.email_miembro !== userEmail) {
      return NextResponse.json(
        { error: 'No tienes permisos para responder a esta invitación' },
        { status: 403 }
      );
    }

    // Si acepta, verificar que el equipo no esté completo
    if (accept) {
      const { data: miembrosActuales, error: miembrosError } = await supabase
        .from('equipo_miembros')
        .select('id')
        .eq('equipo_id', invitacion.equipo_id)
        .eq('estado_invitacion', 'aceptada');

      if (miembrosError) {
        console.error('Error fetching miembros:', miembrosError);
        return NextResponse.json(
          { error: 'Error al verificar miembros del equipo' },
          { status: 500 }
        );
      }

      const cantidadMiembros = miembrosActuales?.length || 0;
      if (cantidadMiembros >= invitacion.equipos.max_miembros) {
        return NextResponse.json(
          { error: `El equipo ya tiene el máximo de ${invitacion.equipos.max_miembros} miembros` },
          { status: 400 }
        );
      }
    }

    // Actualizar el estado de la invitación
    const { error: updateError } = await supabase
      .from('equipo_miembros')
      .update({
        estado_invitacion: accept ? 'aceptada' : 'rechazada'
      })
      .eq('id', invitacionId);

    if (updateError) {
      console.error('Error updating invitacion:', updateError);
      return NextResponse.json(
        { error: 'Error al procesar la invitación' },
        { status: 500 }
      );
    }

    // Crear notificación para el líder del equipo
    try {
      await supabase
        .from('notifications')
        .insert({
          user_email: invitacion.invitado_por,
          type: accept ? 'invitation_accepted' : 'invitation_rejected',
          title: accept ? 'Invitación aceptada' : 'Invitación rechazada',
          message: `${userEmail} ha ${accept ? 'aceptado' : 'rechazado'} la invitación al equipo "${invitacion.equipos.nombre}"`,
          data: {
            equipo_id: invitacion.equipo_id,
            equipo_nombre: invitacion.equipos.nombre,
            miembro_email: userEmail,
            invitacion_id: invitacionId
          },
          read: false
        });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // No fallar la operación principal por un error de notificación
    }

    // Registrar actividad en el log
    await logTeamActivity(
      invitacion.equipo_id,
      accept ? 'invitation_accepted' : 'invitation_rejected',
      `Invitación ${accept ? 'aceptada' : 'rechazada'} por ${userEmail}`,
      userEmail
    );

    return NextResponse.json({
      success: true,
      message: accept ? 'Te has unido al equipo exitosamente' : 'Has rechazado la invitación',
      equipo: invitacion.equipos
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
