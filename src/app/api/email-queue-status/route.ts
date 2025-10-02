import { NextResponse } from 'next/server';
import { emailQueue } from '@/lib/email-queue';

export async function GET() {
  try {
    const queueStatus = emailQueue.getQueueStatus();
    
    return NextResponse.json({
      success: true,
      queueStatus: queueStatus,
      message: 'Estado de la cola de emails obtenido exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo estado de la cola:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error obteniendo estado de la cola',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Limpiar cola (solo para testing/admin)
    emailQueue.clearQueue();
    
    return NextResponse.json({
      success: true,
      message: 'Cola de emails limpiada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error limpiando cola:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error limpiando cola',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
