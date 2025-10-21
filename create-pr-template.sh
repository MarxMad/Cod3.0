#!/bin/bash

# Script para crear PRs de manera eficiente
# Uso: ./create-pr-template.sh <issue-number> <branch-name> <pr-type>

ISSUE_NUMBER="$1"
BRANCH_NAME="$2"
PR_TYPE="$3"

if [ -z "$ISSUE_NUMBER" ] || [ -z "$BRANCH_NAME" ] || [ -z "$PR_TYPE" ]; then
    echo "❌ Uso: ./create-pr-template.sh <issue-number> <branch-name> <pr-type>"
    echo "   Ejemplo: ./create-pr-template.sh 1 fix/navbar-buttons fix"
    echo ""
    echo "Tipos disponibles:"
    echo "  - fix: Para arreglar bugs"
    echo "  - feature: Para nuevas funcionalidades"
    echo "  - ui: Para mejoras de UI/UX"
    echo "  - refactor: Para refactoring"
    exit 1
fi

# Obtener información del issue
ISSUE_INFO=$(gh issue view $ISSUE_NUMBER --json title,body,labels)
ISSUE_TITLE=$(echo $ISSUE_INFO | jq -r '.title')
ISSUE_BODY=$(echo $ISSUE_INFO | jq -r '.body')

# Crear rama si no existe
if ! git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo "📝 Creando rama: $BRANCH_NAME"
    git checkout -b $BRANCH_NAME
else
    echo "📝 Cambiando a rama existente: $BRANCH_NAME"
    git checkout $BRANCH_NAME
fi

# Crear PR basado en el tipo
case $PR_TYPE in
    "fix")
        PR_TITLE="Fix: $ISSUE_TITLE"
        PR_BODY="## 🐛 Descripción
$ISSUE_BODY

## 🔧 Cambios realizados
- [ ] Implementado fix para el problema
- [ ] Añadidos tests si es necesario
- [ ] Actualizada documentación si es necesario

## 🧪 Testing
- [ ] Probado en desktop
- [ ] Probado en móvil
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando

## 📸 Screenshots
[Antes/Después si aplica]

## 🔗 Issues relacionados
Closes #$ISSUE_NUMBER"
        ;;
    "feature")
        PR_TITLE="Feature: $ISSUE_TITLE"
        PR_BODY="## ✨ Descripción
$ISSUE_BODY

## 🚀 Funcionalidades implementadas
- [ ] Nueva funcionalidad implementada
- [ ] Tests añadidos
- [ ] Documentación actualizada
- [ ] UI/UX mejorada

## 🧪 Testing
- [ ] Funcionalidad probada
- [ ] Tests unitarios añadidos
- [ ] Tests de integración añadidos
- [ ] Performance verificada

## 📸 Screenshots
[Capturas de la nueva funcionalidad]

## 🔗 Issues relacionados
Closes #$ISSUE_NUMBER"
        ;;
    "ui")
        PR_TITLE="UI: $ISSUE_TITLE"
        PR_BODY="## 🎨 Descripción
$ISSUE_BODY

## 🖼️ Cambios de UI/UX
- [ ] Mejoras visuales implementadas
- [ ] Responsive design mejorado
- [ ] Accesibilidad mejorada
- [ ] Animaciones añadidas

## 🧪 Testing
- [ ] Probado en diferentes dispositivos
- [ ] Probado en diferentes navegadores
- [ ] Accesibilidad verificada
- [ ] Performance de animaciones verificada

## 📸 Screenshots
[Antes/Después de los cambios visuales]

## 🔗 Issues relacionados
Closes #$ISSUE_NUMBER"
        ;;
    "refactor")
        PR_TITLE="Refactor: $ISSUE_TITLE"
        PR_BODY="## 🔄 Descripción
$ISSUE_BODY

## 🛠️ Refactoring realizado
- [ ] Código refactorizado
- [ ] Performance mejorada
- [ ] Mantenibilidad mejorada
- [ ] Documentación actualizada

## 🧪 Testing
- [ ] Funcionalidad existente no afectada
- [ ] Tests existentes siguen pasando
- [ ] Performance mejorada verificada

## 🔗 Issues relacionados
Closes #$ISSUE_NUMBER"
        ;;
esac

echo "📝 Creando PR..."
gh pr create \
    --title "$PR_TITLE" \
    --body "$PR_BODY" \
    --assignee MarxMad \
    --label "$PR_TYPE"

echo "✅ PR creado exitosamente!"
echo "🔗 Ver PR: gh pr view"
echo "🌐 Abrir en navegador: gh pr view --web"
