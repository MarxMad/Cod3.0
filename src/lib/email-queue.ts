// Sistema de cola de emails para evitar rate limiting de Resend
// Resend permite máximo 2 requests por segundo

interface EmailJob {
  id: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  retries: number;
  maxRetries: number;
  createdAt: number;
}

class EmailQueue {
  private queue: EmailJob[] = [];
  private processing = false;
  private readonly RATE_LIMIT_DELAY = 600; // 600ms entre emails (menos de 2 por segundo)
  private readonly MAX_RETRIES = 3;

  // Agregar email a la cola
  addEmail(job: Omit<EmailJob, 'id' | 'retries' | 'createdAt'>) {
    const emailJob: EmailJob = {
      ...job,
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retries: 0,
      createdAt: Date.now(),
      maxRetries: this.MAX_RETRIES
    };

    this.queue.push(emailJob);
    console.log(`📧 Email agregado a la cola: ${emailJob.id}`);
    
    // Iniciar procesamiento si no está en curso
    if (!this.processing) {
      this.processQueue();
    }

    return emailJob.id;
  }

  // Procesar la cola de emails
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    console.log(`🔄 Iniciando procesamiento de cola: ${this.queue.length} emails pendientes`);

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;

      try {
        await this.sendEmail(job);
        console.log(`✅ Email enviado exitosamente: ${job.id}`);
        
        // Esperar antes del siguiente email para respetar rate limit
        await this.delay(this.RATE_LIMIT_DELAY);
        
      } catch (error) {
        console.error(`❌ Error enviando email ${job.id}:`, error);
        
        // Reintentar si no se ha excedido el límite
        if (job.retries < job.maxRetries) {
          job.retries++;
          this.queue.unshift(job); // Volver a la cola
          console.log(`🔄 Reintentando email ${job.id} (intento ${job.retries}/${job.maxRetries})`);
          
          // Esperar más tiempo antes del reintento
          await this.delay(this.RATE_LIMIT_DELAY * 2);
        } else {
          console.error(`💀 Email ${job.id} falló definitivamente después de ${job.maxRetries} intentos`);
        }
      }
    }

    this.processing = false;
    console.log(`🏁 Procesamiento de cola completado`);
  }

  // Enviar email individual
  private async sendEmail(job: EmailJob) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: job.from,
      to: [job.to],
      subject: job.subject,
      html: job.html,
    });

    if (!result.data?.id) {
      throw new Error('No se recibió ID del email de Resend');
    }

    return result;
  }

  // Función de delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener estado de la cola
  getQueueStatus() {
    return {
      pending: this.queue.length,
      processing: this.processing,
      totalProcessed: this.queue.length === 0 ? 'Completado' : 'En proceso'
    };
  }

  // Limpiar cola (para testing)
  clearQueue() {
    this.queue = [];
    this.processing = false;
  }
}

// Instancia singleton de la cola
export const emailQueue = new EmailQueue();

// Función helper para enviar emails con cola
export async function queueEmail(
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<string> {
  return emailQueue.addEmail({ from, to, subject, html, maxRetries: 3 });
}

