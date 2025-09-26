// Script para probar el envío de correos
const testEmail = async () => {
  try {
    console.log('🧪 Iniciando prueba de email...');
    
    const response = await fetch('https://cod3mx.com/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'gerrypvela@gmail.com' // Cambia por tu email
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email de prueba enviado exitosamente');
      console.log('📧 Detalles:', result);
    } else {
      console.log('❌ Error al enviar email de prueba');
      console.log('📋 Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testEmail();
