# 📝 Convenciones de Commits para COD3.0

## 🎯 Tipos de Commits

### 🔧 Fix (Arreglar bugs)
```bash
git commit -m "fix: arreglar superposición de botones en navbar"
git commit -m "fix: corregir validación de autenticación en dashboard"
git commit -m "fix: resolver problema de envío de emails de invitación"
```

### ✨ Feature (Nuevas funcionalidades)
```bash
git commit -m "feat: implementar sistema de gestión de proyectos"
git commit -m "feat: añadir verificación de emails para envío"
git commit -m "feat: crear sistema de entrega y evaluación"
```

### 🎨 UI/UX (Mejoras de interfaz)
```bash
git commit -m "ui: actualizar tarjetas de miembros en landing"
git commit -m "ui: mejorar diseño responsive del navbar"
git commit -m "ui: añadir animaciones a las tarjetas"
```

### 🔄 Refactor (Refactoring)
```bash
git commit -m "refactor: optimizar código de autenticación"
git commit -m "refactor: mejorar estructura de componentes"
git commit -m "refactor: simplificar lógica de equipos"
```

### 📚 Docs (Documentación)
```bash
git commit -m "docs: actualizar README con nuevas funcionalidades"
git commit -m "docs: añadir guía de instalación"
git commit -m "docs: documentar API de equipos"
```

### 🧪 Test (Tests)
```bash
git commit -m "test: añadir tests para sistema de autenticación"
git commit -m "test: crear tests de integración para equipos"
git commit -m "test: añadir tests de UI para navbar"
```

### ⚡ Perf (Performance)
```bash
git commit -m "perf: optimizar carga de imágenes"
git commit -m "perf: implementar lazy loading"
git commit -m "perf: reducir bundle size"
```

## 🏷️ Etiquetas para PRs

### 🐛 Bug Fixes
- `bug` - Para arreglar bugs
- `fix` - Para correcciones
- `hotfix` - Para fixes críticos

### ✨ Features
- `feature` - Para nuevas funcionalidades
- `enhancement` - Para mejoras
- `new-feature` - Para funcionalidades completamente nuevas

### 🎨 UI/UX
- `ui/ux` - Para cambios de interfaz
- `design` - Para cambios de diseño
- `accessibility` - Para mejoras de accesibilidad

### 🔧 Technical
- `refactor` - Para refactoring
- `performance` - Para optimizaciones
- `security` - Para mejoras de seguridad
- `testing` - Para tests

### 📚 Documentation
- `docs` - Para documentación
- `readme` - Para cambios en README
- `api-docs` - Para documentación de API

## 📋 Estructura de PRs

### 🎯 Título del PR
```
[Tipo]: [Descripción breve]
Ejemplos:
- Fix: Arreglar superposición de botones en navbar
- Feature: Implementar sistema de gestión de proyectos
- UI: Mejorar diseño responsive del navbar
```

### 📝 Descripción del PR
```markdown
## 🎯 Descripción
[Descripción detallada del cambio]

## 🔧 Cambios realizados
- [ ] Cambio 1
- [ ] Cambio 2
- [ ] Cambio 3

## 🧪 Testing
- [ ] Probado en desktop
- [ ] Probado en móvil
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando

## 📸 Screenshots
[Antes/Después si aplica]

## 🔗 Issues relacionados
Closes #[número del issue]
```

## 🚀 Flujo de Trabajo Recomendado

### 1. 📋 Antes de empezar
```bash
# Verificar que estás en main
git checkout main
git pull origin main

# Crear rama para el issue
git checkout -b fix/issue-4-navbar-buttons
```

### 2. 🔧 Durante el desarrollo
```bash
# Hacer cambios
# Commit frecuentes
git add .
git commit -m "fix: reducir tamaño de fuente en navbar"

# Continuar trabajando
git add .
git commit -m "fix: arreglar superposición de botones"

# Más cambios
git add .
git commit -m "ui: mejorar responsive design"
```

### 3. 📤 Antes de crear PR
```bash
# Verificar que todo funciona
npm run build
npm run test

# Subir rama
git push origin fix/issue-4-navbar-buttons
```

### 4. 🔄 Crear PR
```bash
# Usar el script
./create-pr-template.sh 4 fix/issue-4-navbar-buttons fix

# O manualmente
gh pr create --title "Fix: Arreglar problemas de navbar y botones" \
  --body "## Descripción
  Arregla los problemas de superposición de botones y tamaño de fuente en el navbar.
  
  ## Cambios realizados
  - Reducido tamaño de fuente en navbar
  - Arreglada superposición de botones en móviles
  - Mejorado responsive design
  
  ## Issues relacionados
  Closes #4" \
  --assignee MarxMad
```

## 🎯 Estrategias para Más PRs

### 📊 PRs por Fase

#### 🚨 Fase 1: Core (8 PRs)
1. `fix/issue-1-member-cards` - Arreglar tarjetas de miembros
2. `fix/issue-2-auth-validation` - Mejorar validación de auth
3. `fix/issue-3-teams-invitations` - Arreglar sistema de equipos
4. `fix/issue-4-navbar-buttons` - Corregir navbar
5. `feature/issue-5-project-management` - Sistema de gestión
6. `feature/issue-6-email-verification` - Verificación de emails
7. `feature/issue-7-project-evaluation` - Sistema de evaluación
8. `feature/issue-8-admin-security` - Seguridad de admin

#### 🔧 Fase 2: Advanced (11 PRs)
- `feature/issue-9-performance` - Optimización
- `feature/issue-10-notifications` - Sistema de notificaciones
- `feature/issue-11-search-filters` - Búsqueda y filtros
- `feature/issue-12-accessibility` - Accesibilidad
- `feature/issue-13-realtime-communication` - Comunicación en tiempo real
- `feature/issue-14-mentorship` - Sistema de mentoría
- `feature/issue-15-admin-dashboard` - Dashboard avanzado
- `feature/issue-16-gamification` - Gamificación
- `feature/issue-17-resources` - Recursos y documentación
- `feature/issue-18-backup` - Sistema de backup
- `feature/issue-19-testing` - Testing y calidad

#### 🎨 Fase 3: Polish (7 PRs)
- `ui/issue-20-projects-redesign` - Rediseño de proyectos
- `ui/issue-21-dark-light-theme` - Temas oscuro/claro
- `ui/issue-22-animations` - Animaciones
- `feature/issue-23-analytics` - Analytics básicos
- `feature/issue-24-networking` - Networking
- `feature/issue-25-advanced-analytics` - Analytics avanzados
- `feature/issue-26-integrations` - Integraciones externas

### 🎯 Total: 26 PRs organizados por fases
