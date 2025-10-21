#!/bin/bash

# Script para empezar un issue siguiendo el protocolo
# Uso: ./start-issue.sh <issue-number> <issue-title>

ISSUE_NUMBER="$1"
ISSUE_TITLE="$2"

if [ -z "$ISSUE_NUMBER" ] || [ -z "$ISSUE_TITLE" ]; then
    echo "❌ Uso: ./start-issue.sh <issue-number> <issue-title>"
    echo "   Ejemplo: ./start-issue.sh 1 \"Actualizar tarjetas de miembros\""
    echo ""
    echo "📋 Issues disponibles:"
    gh issue list --limit 10
    exit 1
fi

# Obtener información del issue
ISSUE_INFO=$(gh issue view $ISSUE_NUMBER --json title,body,labels)
ISSUE_TITLE_FULL=$(echo $ISSUE_INFO | jq -r '.title')
ISSUE_LABELS=$(echo $ISSUE_INFO | jq -r '.labels[].name' | tr '\n' ' ')

echo "🚀 Iniciando trabajo en Issue #$ISSUE_NUMBER"
echo "📝 Título: $ISSUE_TITLE_FULL"
echo "🏷️ Labels: $ISSUE_LABELS"
echo ""

# Determinar tipo de rama basado en labels
if echo "$ISSUE_LABELS" | grep -q "bug"; then
    BRANCH_TYPE="fix"
elif echo "$ISSUE_LABELS" | grep -q "feature"; then
    BRANCH_TYPE="feature"
elif echo "$ISSUE_LABELS" | grep -q "ui/ux"; then
    BRANCH_TYPE="ui"
else
    BRANCH_TYPE="feature"
fi

# Crear nombre de rama
BRANCH_NAME="$BRANCH_TYPE/issue-$ISSUE_NUMBER-$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')"

echo "🌿 Creando rama: $BRANCH_NAME"

# Verificar estado actual
echo "📋 Verificando estado actual..."
if ! git status --porcelain | grep -q .; then
    echo "✅ Working directory limpio"
else
    echo "⚠️  Working directory no está limpio. Stashing cambios..."
    git stash push -m "Auto-stash antes de empezar issue #$ISSUE_NUMBER"
fi

# Cambiar a main y actualizar
echo "🔄 Cambiando a main y actualizando..."
git checkout main
git pull origin main

# Crear nueva rama
echo "🌿 Creando rama: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
echo "✅ Ahora estás en la rama: $CURRENT_BRANCH"

# Mostrar información del issue
echo ""
echo "📋 Información del Issue:"
echo "   #$ISSUE_NUMBER: $ISSUE_TITLE_FULL"
echo "   Labels: $ISSUE_LABELS"
echo "   Rama: $BRANCH_NAME"
echo ""

# Mostrar próximos pasos
echo "🎯 Próximos pasos:"
echo "   1. Hacer cambios en el código"
echo "   2. Commits frecuentes: git commit -m \"fix: descripción\""
echo "   3. Al terminar: ./complete-issue.sh $ISSUE_NUMBER"
echo ""

# Mostrar comandos útiles
echo "🛠️ Comandos útiles:"
echo "   Ver estado: git status"
echo "   Añadir cambios: git add ."
echo "   Commit: git commit -m \"[tipo]: descripción\""
echo "   Ver commits: git log --oneline"
echo "   Ver issue: gh issue view $ISSUE_NUMBER"
echo ""

echo "🚀 ¡Listo para empezar a trabajar en el issue #$ISSUE_NUMBER!"
