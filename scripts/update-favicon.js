const sharp = require('sharp');
const path = require('path');

async function createFavicon() {
  try {
    const inputPath = path.join(__dirname, '../public/CODEB.png');
    
    console.log('🚀 Generando favicons desde CODEB.png...\n');
    
    // Create individual PNG favicons with all necessary sizes
    const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 512];
    
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFormat('png')
        .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));
      console.log(`✅ favicon-${size}x${size}.png creado!`);
    }
    
    // Create favicon.ico (32x32 is most common)
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('✅ favicon.ico creado!');
    
    // Create apple-touch-icon.png
    await sharp(inputPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    
    console.log('✅ apple-touch-icon.png creado!');
    
    console.log('\n🎉 ¡Todos los favicons han sido generados exitosamente desde CODEB.png!');
    console.log('\n📝 Siguiente paso:');
    console.log('   1. Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)');
    console.log('   2. Haz commit y push a Vercel');
    console.log('   3. Espera unos minutos para que el caché de Vercel se actualice');
  } catch (error) {
    console.error('❌ Error al crear favicon:', error);
  }
}

createFavicon();

