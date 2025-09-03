# 🚀 Configuración de Supabase para COD3.0 HACKATHON

## 📋 Requisitos Previos

1. **Cuenta de Supabase** - [Crear cuenta aquí](https://supabase.com)
2. **Proyecto de Supabase** - Crear un nuevo proyecto
3. **Node.js y npm** - Para instalar dependencias

## 🔧 Paso 1: Instalar Dependencias

```bash
npm install @supabase/supabase-js
```

## 🌐 Paso 2: Configurar Supabase

### 2.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "New Project"
3. Elige tu organización
4. Nombre del proyecto: `cod3-hackathon`
5. Elige una contraseña segura para la base de datos
6. Selecciona la región más cercana
7. Haz clic en "Create new project"

### 2.2 Obtener Credenciales
1. En tu proyecto, ve a **Settings** → **API**
2. Copia:
   - **Project URL** (ej: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2.3 Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Email Service (opcional)
RESEND_API_KEY=tu-resend-api-key
```

## 🗄️ Paso 3: Configurar Base de Datos

### 3.1 Ejecutar Script SQL
1. En Supabase, ve a **SQL Editor**
2. Copia y pega el contenido de `supabase-setup.sql`
3. Haz clic en **Run**

### 3.2 Verificar Tabla Creada
1. Ve a **Table Editor**
2. Deberías ver la tabla `registros_hackathon`
3. Verifica que tenga todas las columnas correctas

## 📧 Paso 4: Configurar Email (Opcional)

### 4.1 Usar Resend (Recomendado)
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Obtén tu API key
4. Añádela a `.env.local`

### 4.2 Alternativas
- **SendGrid** - [sendgrid.com](https://sendgrid.com)
- **AWS SES** - [aws.amazon.com/ses](https://aws.amazon.com/ses)
- **Mailgun** - [mailgun.com](https://mailgun.com)

## 🧪 Paso 5: Probar la Integración

### 5.1 Iniciar el Servidor
```bash
npm run dev
```

### 5.2 Probar Registro
1. Ve a `/registro`
2. Llena el formulario
3. Envía el registro
4. Verifica en Supabase que se guarde
5. Revisa la consola para el email simulado

## 🔍 Paso 6: Verificar Funcionamiento

### 6.1 En Supabase
- **Table Editor**: Ver registros guardados
- **Logs**: Revisar errores si los hay
- **API**: Probar endpoints

### 6.2 En la Aplicación
- **Consola del navegador**: Ver logs de la API
- **Network tab**: Ver requests a `/api/registro`
- **Base de datos**: Ver datos insertados

## 🚨 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor después de cambiar `.env.local`

### Error: "Table doesn't exist"
- Ejecuta el script SQL completo
- Verifica que la tabla se haya creado en **Table Editor**

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén configuradas
- Revisa el script SQL para las políticas

### Email no se envía
- Verifica la API key del servicio de email
- Revisa los logs del servidor
- El email se simula por defecto (revisa la consola)

## 📊 Monitoreo y Estadísticas

### Vista de Estadísticas
La tabla incluye una vista `estadisticas_hackathon` que puedes consultar:

```sql
SELECT * FROM estadisticas_hackathon;
```

### Métricas Disponibles
- Total de registros
- Participantes individuales vs equipo
- Distribución por nivel de experiencia
- Conteo de perfiles con GitHub/LinkedIn

## 🔒 Seguridad

### RLS (Row Level Security)
- Solo permite inserción de nuevos registros
- Lectura pública para estadísticas
- No permite modificación de registros existentes

### Validaciones
- Campos requeridos validados en frontend y backend
- Email único por participante
- Validación de formato de email
- Sanitización de datos

## 🚀 Despliegue

### Vercel
1. Añade las variables de entorno en **Settings** → **Environment Variables**
2. Despliega tu aplicación
3. Verifica que la API funcione en producción

### Otros Hostings
- Asegúrate de configurar las variables de entorno
- Verifica que la API esté accesible
- Prueba el registro en producción

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Supabase
2. Verifica la consola del navegador
3. Revisa la consola del servidor
4. Consulta la documentación de Supabase

---

**¡Tu sistema de registro está listo para recibir participantes! 🎉**
