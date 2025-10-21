#!/bin/bash

# Script para completar un issue y crear PR
# Uso: ./complete-issue.sh <issue-number>

ISSUE_NUMBER="$1"

if [ -z "$ISSUE_NUMBER" ]; then
    echo "❌ Uso: ./complete-issue.sh <issue-number>"
    echo "   Ejemplo: ./complete-issue.sh 1"
    exit 1
fi

# Verificar que estamos en una rama de issue
CURRENT_BRANCH=$(git branch --show-current)
if [[ ! "$CURRENT_BRANCH" =~ ^(fix|feature|ui)/issue-[0-9]+ ]]; then
    echo "❌ Error: No estás en una rama de issue válida"
    echo "   Rama actual: $CURRENT_BRANCH"
    echo "   Usa: ./start-issue.sh <issue-number> <title>"
    exit 1
fi

echo "🎯 Completando Issue #$ISSUE_NUMBER"
echo "🌿 Rama actual: $CURRENT_BRANCH"
echo ""

# Obtener información del issue
ISSUE_INFO=$(gh issue view $ISSUE_NUMBER --json title,body,labels)
ISSUE_TITLE=$(echo $ISSUE_INFO | jq -r '.title')
ISSUE_BODY=$(echo $ISSUE_INFO | jq -r '.body')
ISSUE_LABELS=$(echo $ISSUE_INFO | jq -r '.labels[].name' | tr '\n' ' ')

echo "📋 Issue: #$ISSUE_NUMBER - $ISSUE_TITLE"
echo "🏷️ Labels: $ISSUE_LABELS"
echo ""

# Verificaciones antes de crear PR
echo "🔍 Verificaciones previas..."

# Verificar que hay cambios
if ! git status --porcelain | grep -q .; then
    echo "⚠️  No hay cambios para commitear"
    echo "   ¿Estás seguro de que completaste el issue?"
    read -p "¿Continuar de todas formas? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelado"
        exit 1
    fi
fi

# Verificar que el build funciona
echo "🔨 Verificando build..."
if ! npm run build > /dev/null 2>&1; then
    echo "❌ Build falló. Corrige los errores antes de continuar"
    npm run build
    exit 1
fi
echo "✅ Build exitoso"

# Verificar tests
echo "🧪 Verificando tests..."
if ! npm run test > /dev/null 2>&1; then
    echo "⚠️  Tests fallaron. ¿Continuar de todas formas?"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelado"
        exit 1
    fi
else
    echo "✅ Tests pasando"
fi

# Verificar linting
echo "🔍 Verificando linting..."
if ! npm run lint > /dev/null 2>&1; then
    echo "⚠️  Linting falló. ¿Continuar de todas formas?"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelado"
        exit 1
    fi
else
    echo "✅ Linting exitoso"
fi

# Commit final si hay cambios
if git status --porcelain | grep -q .; then
    echo "📝 Haciendo commit final..."
    git add .
    git commit -m "feat: completar issue #$ISSUE_NUMBER - $ISSUE_TITLE"
fi

# Subir rama
echo "📤 Subiendo rama..."
git push origin "$CURRENT_BRANCH"

# Determinar tipo de PR basado en labels
if echo "$ISSUE_LABELS" | grep -q "bug"; then
    PR_TYPE="fix"
    PR_TITLE="Fix: $ISSUE_TITLE"
elif echo "$ISSUE_LABELS" | grep -q "ui/ux"; then
    PR_TYPE="ui"
    PR_TITLE="UI: $ISSUE_TITLE"
else
    PR_TYPE="feature"
    PR_TITLE="Feature: $ISSUE_TITLE"
fi

# Crear Pull Request
echo "📝 Creando Pull Request..."

PR_BODY="## 🎯 Descripción
$ISSUE_BODY

## 🔧 Cambios realizados
- [ ] Implementado fix/feature para el issue
- [ ] Testing realizado
- [ ] Documentación actualizada si es necesario

## 🧪 Testing
- [ ] Probado en desktop
- [ ] Probado en móvil
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando
- [ ] Build exitoso
- [ ] Linting exitoso

## 📸 Screenshots
[Antes/Después si aplica]

## 🔗 Issues relacionados
Closes #$ISSUE_NUMBER"

gh pr create \
    --title "$PR_TITLE" \
    --body "$PR_BODY" \
    --assignee MarxMad \
    --label "$PR_TYPE"

if [ $? -eq 0 ]; then
    echo "✅ Pull Request creado exitosamente!"
    echo ""
    echo "🔗 Ver PR: gh pr view"
    echo "🌐 Abrir en navegador: gh pr view --web"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Revisar el PR en GitHub"
    echo "   2. Hacer merge cuando esté listo"
    echo "   3. Eliminar rama después del merge"
    echo "   4. Empezar siguiente issue: ./start-issue.sh <next-issue>"
else
    echo "❌ Error creando Pull Request"
    exit 1
fi
