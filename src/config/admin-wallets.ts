// Configuración de wallets autorizadas para el panel de administración
// IMPORTANTE: Agrega aquí las direcciones de tus wallets reales

export const ADMIN_WALLETS = [
  // Ejemplo de cómo agregar tu wallet:
  // '0x1234567890123456789012345678901234567890',
  // '0x0987654321098765432109876543210987654321',
  
  // INSTRUCCIONES:
  // 1. Abre MetaMask
  // 2. Copia tu dirección de wallet (0x...)
  // 3. Agrega la dirección aquí entre comillas
  // 4. Guarda el archivo
  // 5. Haz commit y push de los cambios
  
  // Ejemplo:
  // '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Tu wallet principal
  // '0x8ba1f109551bD432803012645Hac136c', // Wallet de respaldo
];

// Función para verificar si una wallet está autorizada
export function isWalletAuthorized(address: string): boolean {
  return ADMIN_WALLETS.includes(address.toLowerCase());
}

// Función para obtener la lista de wallets autorizadas (sin exponer las direcciones completas)
export function getAuthorizedWalletsCount(): number {
  return ADMIN_WALLETS.length;
}
