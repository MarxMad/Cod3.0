# 🌈 Configuración de RainbowKit

## ¿Qué es RainbowKit?

RainbowKit es una biblioteca de React que simplifica la integración de wallets en aplicaciones Web3. Proporciona una interfaz de usuario elegante y fácil de usar para conectar diferentes tipos de wallets.

## ✨ Características Implementadas

### 🔗 **Múltiples Wallets Soportadas:**
- MetaMask
- WalletConnect (móvil)
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- Y muchas más...

### 🎨 **Interfaz Mejorada:**
- Botón de conexión elegante
- Modal de selección de wallet
- Estados de conexión visuales
- Soporte para múltiples cadenas

### 🔐 **Seguridad Mantenida:**
- Verificación criptográfica de firmas
- Lista blanca de wallets autorizadas
- Autenticación sin contraseñas

## 🚀 Configuración Rápida

### 1. **Obtener Project ID de WalletConnect**

1. Ve a [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia tu Project ID

### 2. **Configurar Variables de Entorno**

Agrega a tu archivo `.env.local`:

```bash
# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
```

### 3. **Configurar Wallets Autorizadas**

Edita `src/config/admin-wallets.ts`:

```typescript
export const ADMIN_WALLETS: string[] = [
  '0xTU_WALLET_PRINCIPAL_AQUI',
  '0xTU_WALLET_RESPALDO_AQUI',
];
```

## 🎯 Uso en la Aplicación

### **Panel de Administración:**
- Accede a `/admin`
- Conecta tu wallet autorizada
- Gestiona registros y envía emails

### **Página Principal:**
- Botón de conexión disponible
- Soporte para múltiples wallets
- Experiencia móvil optimizada

## 🔧 Personalización

### **Cadenas Soportadas:**
Edita `src/lib/rainbowkit-config.ts`:

```typescript
export const config = getDefaultConfig({
  appName: 'COD3.0 HACKATHON',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, arbitrum, optimism, base, sepolia], // Agrega/quita cadenas
  ssr: true,
});
```

### **Tema Personalizado:**
Los estilos de RainbowKit se cargan automáticamente desde `@rainbow-me/rainbowkit/styles.css`.

## 🛠️ Componentes Disponibles

### **RainbowKitAuth:**
- Pantalla de autenticación completa
- Verificación automática de wallet
- Manejo de errores integrado

### **ConnectWalletButton:**
- Botón de conexión reutilizable
- Diferentes tamaños disponibles
- Animaciones con Framer Motion

### **Web3Provider:**
- Provider principal para toda la app
- Configuración de wagmi y RainbowKit
- QueryClient para React Query

## 🔍 Solución de Problemas

### **Error: "Project ID required"**
- Asegúrate de configurar `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Verifica que el Project ID sea válido

### **Wallet no se conecta:**
- Verifica que la wallet esté instalada
- Revisa la consola para errores
- Prueba con diferentes wallets

### **Error de autenticación:**
- Verifica que tu wallet esté en `ADMIN_WALLETS`
- Asegúrate de firmar el mensaje correctamente

## 📱 Experiencia Móvil

RainbowKit está optimizado para móviles:
- Soporte para WalletConnect
- QR codes para conexión
- Interfaz responsive
- Gestos táctiles

## 🎉 ¡Listo!

Tu aplicación ahora tiene una experiencia de conexión de wallets profesional y fácil de usar. Los usuarios pueden conectar sus wallets favoritas con solo unos clics.

### **Próximos Pasos:**
1. Configura tu Project ID de WalletConnect
2. Agrega tus wallets autorizadas
3. Prueba la conexión en diferentes dispositivos
4. Personaliza el tema si es necesario

¡Disfruta de tu nueva experiencia Web3! 🚀
















