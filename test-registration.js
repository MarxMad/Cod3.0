// Script para probar el endpoint de registro real
const testRegistration = async () => {
  const testData = {
    nombre: 'Usuario',
    apellido: 'Prueba',
    email: 'test@example.com',
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
    console.log('🧪 Probando endpoint de registro...');
    console.log('📧 Email de prueba:', testData.email);
    
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
      
      // Esperar un momento y verificar la cola de emails
      setTimeout(async () => {
        console.log('📧 Verificando cola de emails...');
        const queueResponse = await fetch('http://localhost:3000/api/email-queue-status');
        const queueData = await queueResponse.json();
        console.log('📊 Estado de la cola:', queueData);
      }, 2000);
      
    } else {
      console.log('❌ Error en el registro:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testRegistration();
