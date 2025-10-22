import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Verificar configuración
    const config = {
      resendApiKey: !!process.env.RESEND_API_KEY,
      resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    console.log('🔍 Debug Email System - Configuración:', config);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY no está configurada',
        config
      }, { status: 500 });
    }

    // Intentar enviar un email de prueba
    try {
      const testResult = await resend.emails.send({
        from: 'COD3.0 Hackathon <hola@code3mx.com>',
        to: ['test@example.com'], // Email de prueba
        subject: 'Test Email - COD3.0 Debug',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00ff00;">Test Email - COD3.0 Debug</h1>
            <p>Este es un email de prueba para verificar la configuración de Resend.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        `
      });

      return NextResponse.json({
        success: true,
        message: 'Sistema de email funcionando correctamente',
        config,
        testResult: {
          id: testResult.data?.id,
          error: testResult.error
        }
      });

    } catch (emailError) {
      console.error('❌ Error enviando email de prueba:', emailError);
      
      return NextResponse.json({
        success: false,
        error: 'Error enviando email de prueba',
        config,
        emailError: {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          name: emailError instanceof Error ? emailError.name : 'Unknown'
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error en debug-email-system:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        error: 'Email es requerido'
      }, { status: 400 });
    }

    // Enviar email de prueba a un email real
    const testResult = await resend.emails.send({
      from: 'COD3.0 Hackathon <hola@code3mx.com>',
      to: [email],
      subject: 'Test Email - COD3.0 Debug',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00ff00;">Test Email - COD3.0 Debug</h1>
          <p>Este es un email de prueba para verificar la configuración de Resend.</p>
          <p>Si recibes este email, el sistema está funcionando correctamente.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: `Email de prueba enviado a ${email}`,
      result: {
        id: testResult.data?.id,
        error: testResult.error
      }
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
