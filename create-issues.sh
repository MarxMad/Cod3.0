#!/bin/bash

# Script para crear issues en GitHub usando GitHub CLI
# Requiere: gh CLI instalado y autenticado

echo "🚀 Creando issues en GitHub para COD3.0 Hackathon..."
echo "📁 Repositorio: MarxMad/Cod3.0"
echo ""

# Verificar si gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) no está instalado"
    echo "   Instala con: brew install gh"
    echo "   O visita: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo "❌ Error: No estás autenticado con GitHub CLI"
    echo "   Ejecuta: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI configurado correctamente"
echo ""

# Función para crear issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo "📝 Creando: $title"
    
    gh issue create \
        --title "$title" \
        --body "$body" \
        --label "$labels" \
        --assignee MarxMad
    
    if [ $? -eq 0 ]; then
        echo "✅ Issue creado exitosamente"
    else
        echo "❌ Error creando issue"
    fi
    echo ""
}

# Crear issues de alta prioridad
echo "🔥 Creando issues de ALTA PRIORIDAD..."
echo ""

create_issue \
    "Actualizar tarjetas de miembros en la landing page" \
    "Las tarjetas de miembros en la landing page necesitan ser actualizadas para mostrar información más relevante y mejorar la presentación visual.

**Problemas identificados:**
- Las tarjetas de organizadores están hardcodeadas en el código
- Falta información dinámica de miembros del hackathon
- Diseño de tarjetas no es responsive en móviles
- No hay integración con datos reales de la base de datos

**Tareas:**
- [ ] Crear componente dinámico para tarjetas de miembros
- [ ] Integrar con API para obtener datos reales de participantes
- [ ] Mejorar diseño responsive de las tarjetas
- [ ] Añadir animaciones y efectos hover
- [ ] Implementar filtros por categorías (organizadores, sponsors, etc.)" \
    "bug,ui/ux,high-priority"

create_issue \
    "Mejorar validación de autenticación en dashboard" \
    "El sistema de validación en las páginas del dashboard tiene vulnerabilidades y no previene el acceso no autorizado correctamente.

**Problemas identificados:**
- Validación inconsistente entre páginas del dashboard
- No hay middleware de autenticación centralizado
- Los usuarios pueden acceder a páginas sin estar registrados
- Falta validación de sesión en tiempo real
- No hay manejo de tokens expirados

**Tareas:**
- [ ] Crear middleware de autenticación centralizado
- [ ] Implementar validación de sesión en tiempo real
- [ ] Añadir redirección automática para usuarios no autenticados
- [ ] Implementar refresh de tokens
- [ ] Añadir logging de intentos de acceso no autorizados
- [ ] Crear componente de protección de rutas" \
    "security,high-priority,bug"

create_issue \
    "Arreglar sistema de equipos e invitaciones" \
    "El sistema de equipos y invitaciones tiene problemas de funcionalidad que impiden el flujo correcto de trabajo en equipo.

**Problemas identificados:**
- Las invitaciones por email no se envían correctamente
- Falta validación de límites de miembros por equipo
- No hay notificaciones en tiempo real de invitaciones
- El sistema de aceptación/rechazo de invitaciones es confuso
- Falta manejo de errores en el flujo de invitaciones

**Tareas:**
- [ ] Arreglar envío de emails de invitación
- [ ] Implementar validación de límites de miembros
- [ ] Añadir notificaciones en tiempo real
- [ ] Mejorar UI del flujo de invitaciones
- [ ] Implementar manejo robusto de errores
- [ ] Añadir logs de actividad de equipos" \
    "bug,feature,high-priority"

create_issue \
    "Corregir problemas de navbar y botones" \
    "El navbar tiene problemas de diseño que afectan la experiencia del usuario, especialmente en dispositivos móviles.

**Problemas identificados:**
- Letra muy grande en el navbar que causa problemas de layout
- Botones se enciman en pantallas pequeñas
- Falta responsive design adecuado
- Navegación no es intuitiva en móviles
- Falta indicadores visuales de página activa

**Tareas:**
- [ ] Reducir tamaño de fuente en navbar
- [ ] Implementar diseño responsive adecuado
- [ ] Arreglar superposición de botones
- [ ] Añadir indicadores de página activa
- [ ] Mejorar navegación móvil
- [ ] Optimizar espaciado y padding" \
    "ui/ux,bug,high-priority"

create_issue \
    "Sistema completo de gestión de proyectos" \
    "Implementar un sistema completo de gestión de proyectos que permita a los equipos gestionar todo el ciclo de vida de sus proyectos desde la plataforma.

**Tareas:**
- [ ] Crear dashboard de proyecto con métricas en tiempo real
- [ ] Implementar sistema de milestones y deadlines
- [ ] Añadir gestión de tareas y asignaciones
- [ ] Crear sistema de documentación de proyecto
- [ ] Implementar timeline visual del proyecto
- [ ] Añadir sistema de versionado de código
- [ ] Crear integración con GitHub/GitLab
- [ ] Implementar sistema de comentarios y feedback
- [ ] Añadir métricas de progreso del equipo
- [ ] Crear sistema de notificaciones de deadlines" \
    "feature,high-priority,enhancement"

create_issue \
    "Sistema de verificación de emails para envío de proyectos" \
    "Implementar un sistema robusto de verificación de emails para el envío de proyectos, asegurando que solo equipos verificados puedan enviar sus proyectos.

**Tareas:**
- [ ] Implementar verificación de email obligatoria para envío
- [ ] Crear sistema de códigos de verificación por email
- [ ] Añadir validación de dominio de email (universidad/empresa)
- [ ] Implementar sistema de verificación en dos pasos
- [ ] Crear logs de verificación de emails
- [ ] Añadir sistema de reenvío de códigos
- [ ] Implementar expiración de códigos de verificación
- [ ] Crear dashboard de verificación para admins
- [ ] Añadir notificaciones de verificación exitosa
- [ ] Implementar sistema de verificación masiva" \
    "security,feature,high-priority"

create_issue \
    "Sistema de entrega y evaluación de proyectos" \
    "Crear un sistema completo para la entrega y evaluación de proyectos que incluya validaciones, scoring y feedback.

**Tareas:**
- [ ] Implementar formulario de entrega de proyecto
- [ ] Crear sistema de validación de archivos (tamaño, tipo, etc.)
- [ ] Añadir sistema de scoring automático
- [ ] Implementar panel de evaluación para jueces
- [ ] Crear sistema de feedback y comentarios
- [ ] Añadir sistema de calificación por criterios
- [ ] Implementar ranking automático de proyectos
- [ ] Crear sistema de notificaciones de resultados
- [ ] Añadir exportación de resultados
- [ ] Implementar sistema de apelaciones" \
    "feature,high-priority,enhancement"

create_issue \
    "Mejorar seguridad del panel de administración con wallets" \
    "Implementar un sistema robusto de autenticación y autorización basado en wallets para el panel de administración, asegurando que solo wallets autorizadas puedan acceder.

**Tareas:**
- [ ] Implementar middleware de autenticación robusto
- [ ] Crear sistema de roles y permisos granular
- [ ] Implementar sistema de sesiones seguras
- [ ] Crear sistema de whitelist de wallets
- [ ] Implementar sistema de auditoría completo
- [ ] Crear dashboard de seguridad
- [ ] Implementar sistema de gestión de acceso
- [ ] Crear sistema de backup de seguridad
- [ ] Implementar sistema de monitoreo
- [ ] Crear sistema de reportes
- [ ] Implementar sistema de emergencia
- [ ] Añadir validaciones de seguridad avanzadas" \
    "security,high-priority,enhancement"

echo "🎉 ¡Issues de alta prioridad creados exitosamente!"
echo ""
echo "📋 Para ver todos los issues: gh issue list"
echo "🔗 Para abrir en el navegador: gh repo view --web"
echo ""
echo "💡 Para crear más issues, ejecuta este script nuevamente o usa:"
echo "   gh issue create --title 'Título' --body 'Descripción' --label 'etiqueta'"
