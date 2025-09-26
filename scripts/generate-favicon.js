const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    const inputPath = path.join(__dirname, '../public/CODEB.png');
    const outputPath = path.join(__dirname, '../public/favicon.ico');
    
    // Verificar que el archivo de entrada existe
    if (!fs.existsSync(inputPath)) {
      console.error('El archivo CODEB.png no existe en la carpeta public');
      return;
    }

    // Crear favicon.ico (32x32)
    await sharp(inputPath)
      .resize(32, 32, { 
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log('✅ Favicon generado exitosamente en public/favicon.ico');
    
    // También crear versiones PNG para diferentes tamaños
    const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 512];
    
    for (const size of sizes) {
      const pngPath = path.join(__dirname, `../public/favicon-${size}x${size}.png`);
      await sharp(inputPath)
        .resize(size, size, { 
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(pngPath);
    }
    
    console.log('✅ Favicons PNG generados para diferentes tamaños');
    
  } catch (error) {
    console.error('Error generando favicon:', error);
  }
}

generateFavicon();
