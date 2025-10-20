import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    // Verificar que el email esté registrado en la tabla de registros
    const { data: user, error: userError } = await supabase
      .from('registros_hackathon')
      .select('email, nombre')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Email no encontrado. Debes estar registrado en el hackathon.' 
      }, { status: 404 });
    }

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar código en la base de datos
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Error saving verification code:', insertError);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }

    // Enviar email con el código
    const { error: emailError } = await resend.emails.send({
      from: 'COD3.0 Hackathon <hola@code3mx.com>',
      to: [email],
      subject: 'Código de verificación - COD3.0 Hackathon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff00; font-size: 28px; margin: 0;">COD3.0 Hackathon</h1>
            <p style="color: #666; margin: 10px 0;">Tu código de verificación</p>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hola ${user.nombre}!</h2>
            <p style="color: #666; margin: 0 0 20px 0;">Usa este código para acceder a tu dashboard:</p>
            <div style="background: #00ff00; color: #000; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #999; font-size: 14px; margin: 0;">Este código expira en 10 minutos</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Si no solicitaste este código, puedes ignorar este email.
            </p>
          </div>
        </div>
      `
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Código enviado a tu email' 
    });

  } catch (error) {
    console.error('Error in send-verification-code:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
