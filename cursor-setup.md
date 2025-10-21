# 🤖 CONFIGURACIÓN DE CURSOR PARA COD3.0

## 📋 PROTOCOLO AUTOMATIZADO

### 🚀 FLUJO DE TRABAJO COMPLETO:

#### 1. **EMPEZAR UN ISSUE:**
```bash
./start-issue.sh [issue-number] "[issue-title]"
# Ejemplo: ./start-issue.sh 1 "Actualizar tarjetas de miembros"
```

#### 2. **TRABAJAR EN EL ISSUE:**
```bash
# Hacer cambios en el código
# Commits frecuentes
git add .
git commit -m "fix: descripción del cambio"
```

#### 3. **COMPLETAR EL ISSUE:**
```bash
./complete-issue.sh [issue-number]
# Ejemplo: ./complete-issue.sh 1
```

## 🎯 REGLAS PARA CURSOR

### 📝 CUANDO CURSOR SUGIERA CÓDIGO:

1. **Siempre crear rama antes de empezar**
2. **Usar naming convention**: `[tipo]/issue-[número]-[descripción]`
3. **Commits descriptivos** con tipos estándar
4. **Testing antes de PR**
5. **Crear PR automáticamente** al completar

### 🔧 TIPOS DE COMMITS QUE CURSOR DEBE USAR:

```bash
# Para bugs
fix: arreglar superposición de botones en navbar
fix: corregir validación de autenticación
fix: resolver problema de envío de emails

# Para features
feat: implementar sistema de gestión de proyectos
feat: añadir verificación de emails
feat: crear sistema de entrega

# Para UI/UX
ui: actualizar tarjetas de miembros
ui: mejorar diseño responsive
ui: añadir animaciones

# Para refactoring
refactor: optimizar código de autenticación
refactor: mejorar estructura de componentes
refactor: simplificar lógica de equipos
```

### 📊 ESTRUCTURA DE RAMAS:

```
main
├── fix/issue-1-member-cards
├── fix/issue-2-auth-validation
├── fix/issue-3-teams-invitations
├── fix/issue-4-navbar-buttons
├── feature/issue-5-project-management
├── feature/issue-6-email-verification
├── feature/issue-7-project-evaluation
├── feature/issue-8-admin-security
└── ... (26 ramas total)
```

## 🛠️ SCRIPTS DISPONIBLES

### 📝 `start-issue.sh`
- Crea rama específica para el issue
- Verifica estado del repositorio
- Muestra información del issue
- Guía para próximos pasos

### 📝 `complete-issue.sh`
- Verifica build, tests y linting
- Crea commit final si es necesario
- Sube la rama
- Crea Pull Request automáticamente
- Asigna al responsable

### 📝 `create-pr-template.sh`
- Crea PRs con templates predefinidos
- Basado en tipo de issue (fix, feature, ui)
- Incluye descripción detallada
- Asigna labels correctos

## 🎯 FLUJO RECOMENDADO PARA CURSOR

### 🚀 AL EMPEZAR UN ISSUE:

1. **Ejecutar**: `./start-issue.sh [número] "[título]"`
2. **Verificar** que estás en la rama correcta
3. **Empezar a codificar** con Cursor
4. **Commits frecuentes** durante el desarrollo

### 🔧 DURANTE EL DESARROLLO:

1. **Usar Cursor** para sugerencias de código
2. **Seguir convenciones** de commits
3. **Testing local** antes de cada commit
4. **Documentar cambios** importantes

### 📤 AL COMPLETAR:

1. **Ejecutar**: `./complete-issue.sh [número]`
2. **Verificar** que todo funciona
3. **Crear PR** automáticamente
4. **Revisar** el PR en GitHub
5. **Hacer merge** cuando esté listo

## 🎯 ISSUES ORGANIZADOS POR FASE

### 🚨 FASE 1: CORE (Issues #1-8)
**Prioridad:** CRÍTICA
**Tiempo:** 4-6 semanas

```bash
# Empezar con issues críticos
./start-issue.sh 1 "Actualizar tarjetas de miembros"
./start-issue.sh 2 "Mejorar validación de autenticación"
./start-issue.sh 3 "Arreglar sistema de equipos"
./start-issue.sh 4 "Corregir problemas de navbar"
```

### 🔧 FASE 2: ADVANCED (Issues #9-19)
**Prioridad:** ALTA
**Tiempo:** 6-8 semanas

### 🎨 FASE 3: POLISH (Issues #20-26)
**Prioridad:** MEDIA
**Tiempo:** 4-6 semanas

## 🚨 REGLAS IMPORTANTES

### ❌ NO HACER:
- Trabajar directamente en main
- Commits sin mensaje
- PRs sin testing
- Mezclar múltiples issues
- Merge sin revisión

### ✅ SÍ HACER:
- Crear rama para cada issue
- Commits descriptivos
- Testing antes de PR
- Descripción detallada en PRs
- Seguir naming conventions
- Asignar PRs correctamente

## 🎯 OBJETIVO FINAL

**26 Pull Requests organizados** que transformen la plataforma en la solución de hackathons más completa del mercado, siguiendo un flujo de trabajo profesional y eficiente con Cursor como asistente de desarrollo.
