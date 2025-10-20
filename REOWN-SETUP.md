# Configuración de Reown para COD3.0 Hackathon

## 1. Configurar Reown Project ID

1. Ve a [https://cloud.reown.com](https://cloud.reown.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el Project ID
5. Agrega la variable de entorno en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_aqui
```

## 2. Configurar Supabase

### Ejecutar el script de configuración

Ejecuta el archivo `supabase-proyectos-setup.sql` en tu consola de Supabase para crear:

- Tabla `proyectos` para almacenar los proyectos de los participantes
- Buckets de almacenamiento para imágenes de perfil y proyectos
- Políticas de acceso para los buckets
- Columna `foto_perfil` en la tabla `registros`

### Estructura de la tabla proyectos

```sql
CREATE TABLE proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  problema TEXT NOT NULL,
  solucion TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  video_url VARCHAR(500),
  imagenes TEXT[] DEFAULT '{}',
  estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado')),
  email_participante VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Funcionalidades Implementadas

### Para Participantes

1. **Login con Wallet**: Los usuarios pueden conectarse con su wallet usando Reown
2. **Dashboard Personal**: Vista general con estadísticas del usuario
3. **Gestión de Perfil**: 
   - Actualizar información personal
   - Subir foto de perfil
   - Gestionar enlaces sociales
4. **Subida de Proyectos**:
   - Información básica del proyecto
   - Stack tecnológico
   - Enlaces a GitHub y demo
   - Subida de imágenes y videos
   - Estados: borrador/enviado

### Para Administradores

1. **Panel de Administración**:
   - Vista de todos los participantes
   - Vista de todos los proyectos
   - Sistema de emails masivos
2. **Descarga de Datos**:
   - CSV de participantes
   - CSV de proyectos
   - CSV combinado con toda la información

## 4. Rutas Disponibles

- `/login` - Página de login con Reown
- `/dashboard` - Dashboard principal del participante
- `/dashboard/profile` - Gestión de perfil
- `/dashboard/project` - Subida de proyectos
- `/admin` - Panel de administración

## 5. Configuración de Almacenamiento

Se crean automáticamente los siguientes buckets en Supabase:

- `profile-images` - Para fotos de perfil
- `project-images` - Para imágenes de proyectos
- `project-videos` - Para videos de proyectos

## 6. Notas Importantes

- Los usuarios deben estar registrados en la tabla `registros` para acceder al dashboard
- Se usa el campo `email` de la tabla `registros` para identificar usuarios (por ahora se usa la dirección de wallet)
- Los proyectos se asocian con participantes mediante `email_participante`
- El sistema mantiene la funcionalidad existente de Supabase y Resend

## 7. Próximos Pasos

1. Configurar el Project ID de Reown
2. Ejecutar el script SQL en Supabase
3. Probar el flujo completo de login y dashboard
4. Configurar políticas de acceso adicionales si es necesario
