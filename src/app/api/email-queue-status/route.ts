import { NextRequest, NextResponse } from 'next/server';
import { emailQueue } from '@/lib/email-queue';

export async function GET(request: NextRequest) {
  try {
    const status = emailQueue.getQueueStatus();
    
    return NextResponse.json({
      success: true,
      queueStatus: status,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        resendConfigured: !!process.env.RESEND_API_KEY
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estado de cola:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo estado de cola',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'clear') {
      emailQueue.clearQueue();
      return NextResponse.json({
        success: true,
        message: 'Cola de emails limpiada'
      });
    }

    if (action === 'status') {
      const status = emailQueue.getQueueStatus();
      return NextResponse.json({
        success: true,
        queueStatus: status
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida. Usa "clear" o "status"'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Error en email-queue-status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}