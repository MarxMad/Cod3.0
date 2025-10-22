// Script para probar con un email real
const testRealEmail = async () => {
  const testData = {
    nombre: 'Usuario',
    apellido: 'Prueba',
    email: 'tu-email-real@gmail.com', // CAMBIAR POR TU EMAIL REAL
    telefono: '1234567890',
    universidad: 'Universidad Test',
    carrera: 'Ingeniería',
    semestre: '8',
    experiencia: 'intermedio',
    interes: 'Desarrollo Web',
    equipo: 'individual',
    nombreEquipo: '',
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/in/test',
    portfolio: 'https://test.com',
    expectativas: 'Aprender y ganar',
    motivacion: 'Quiero aprender y participar en el hackathon',
    alergias: 'Ninguna',
    transporte: 'Propio',
    hospedaje: 'No',
    talla: 'M',
    emergencia: '1234567890',
    emergenciaRelacion: 'Padre'
  };

  try {
    console.log('🧪 Probando endpoint de registro con email real...');
    console.log('📧 Email de prueba:', testData.email);
    console.log('⚠️  IMPORTANTE: Cambia el email en el script antes de ejecutar');
    
    const response = await fetch('http://localhost:3000/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Registro exitoso');
      console.log('📧 Revisa tu email para confirmar que llegó el correo de confirmación');
      
      // Esperar un momento y verificar la cola de emails
      setTimeout(async () => {
        console.log('📧 Verificando cola de emails...');
        const queueResponse = await fetch('http://localhost:3000/api/email-queue-status');
        const queueData = await queueResponse.json();
        console.log('📊 Estado de la cola:', queueData);
      }, 3000);
      
    } else {
      console.log('❌ Error en el registro:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
console.log('⚠️  ANTES DE EJECUTAR:');
console.log('1. Cambia el email en la línea 4 del script');
console.log('2. Asegúrate de que el email sea válido');
console.log('3. Revisa tu carpeta de spam si no recibes el email');
console.log('');
testRealEmail();
