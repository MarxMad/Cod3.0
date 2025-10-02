# 🔐 Configuración del Panel de Administración

## Seguridad Implementada

El panel de administración utiliza **autenticación por wallet** (Web3) para máxima seguridad:

- ✅ **Imposible de hackear** sin acceso físico a tu wallet
- ✅ **Sin contraseñas** vulnerables
- ✅ **Verificación criptográfica** de identidad
- ✅ **Lista blanca** de wallets autorizadas

## 🚀 Configuración Inicial

### 1. Obtener tu Dirección de Wallet

1. **Instala MetaMask** si no lo tienes: https://metamask.io
2. **Abre MetaMask** en tu navegador
3. **Copia tu dirección** (empieza con `0x...`)
4. **Ejemplo**: `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`

### 2. Configurar Wallets Autorizadas

Edita el archivo `src/config/admin-wallets.ts`:

```typescript
export const ADMIN_WALLETS = [
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Tu wallet principal
  '0x8ba1f109551bD432803012645Hac136c', // Wallet de respaldo (opcional)
];
```

### 3. Desplegar Cambios

```bash
git add .
git commit -m "feat: Add wallet authentication for admin panel"
git push origin main
```

## 🔒 Cómo Funciona la Seguridad

### 1. **Verificación de Wallet**
- Solo las wallets en `ADMIN_WALLETS` pueden acceder
- Verificación criptográfica de la firma
- Imposible falsificar sin la clave privada

### 2. **Proceso de Autenticación**
1. Usuario conecta MetaMask
2. Se genera un mensaje único con timestamp
3. Usuario firma el mensaje con su wallet
4. Servidor verifica la firma criptográficamente
5. Si es válida y está autorizada → acceso concedido

### 3. **Protección de APIs**
- Todas las APIs requieren token de sesión
- Token generado solo después de autenticación exitosa
- Verificación en cada request

## 🛡️ Niveles de Seguridad

### **Nivel 1: Lista Blanca**
```typescript
// Solo estas wallets pueden intentar autenticarse
const ADMIN_WALLETS = ['0x...', '0x...'];
```

### **Nivel 2: Verificación Criptográfica**
```typescript
// Verificar que la firma corresponde a la wallet
const recoveredAddress = ethers.verifyMessage(message, signature);
```

### **Nivel 3: Tokens de Sesión**
```typescript
// Cada request requiere token válido
headers: { 'Authorization': `Bearer ${sessionToken}` }
```

## 🔧 Mantenimiento

### Agregar Nueva Wallet Admin

1. **Obtén la dirección** de la nueva wallet
2. **Agrega a la lista** en `admin-wallets.ts`
3. **Haz commit y push** de los cambios
4. **La nueva wallet** podrá autenticarse inmediatamente

### Remover Wallet Admin

1. **Elimina la dirección** de `admin-wallets.ts`
2. **Haz commit y push** de los cambios
3. **La wallet** perderá acceso inmediatamente

## ⚠️ Consideraciones de Seguridad

### **Muy Importante:**
- **Nunca compartas** tu clave privada de MetaMask
- **Usa wallets separadas** para administración y uso personal
- **Mantén actualizada** la lista de wallets autorizadas
- **Revisa regularmente** los logs de acceso

### **Backup de Acceso:**
- **Configura al menos 2 wallets** en la lista de admins
- **Guarda las frases semilla** en lugar seguro
- **Considera usar hardware wallets** para máxima seguridad

## 🚨 En Caso de Compromiso

Si sospechas que tu wallet está comprometida:

1. **Remueve inmediatamente** la wallet de `ADMIN_WALLETS`
2. **Haz commit y push** urgente
3. **Transfiere fondos** a una nueva wallet
4. **Configura la nueva wallet** como admin

## 📊 Monitoreo

### Logs de Acceso
- Todas las autenticaciones se registran en consola
- Revisa regularmente los logs del servidor
- Busca intentos de acceso no autorizados

### Indicadores de Seguridad
- ✅ Solo wallets autorizadas pueden conectar
- ✅ Firmas verificadas criptográficamente
- ✅ Tokens de sesión únicos por autenticación
- ✅ Logout automático al cerrar navegador

---

**¡Tu panel de administración está ahora protegido con la máxima seguridad Web3!** 🛡️
