#!/usr/bin/env python3
"""
Script para crear issues en GitHub automáticamente
Requiere: pip install requests
"""

import requests
import json
import os
import sys
from typing import List, Dict

# Configuración
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO_OWNER = 'MarxMad'
REPO_NAME = 'Cod3.0'
GITHUB_API_URL = 'https://api.github.com'

def create_issue(title: str, body: str, labels: List[str], assignees: List[str] = None) -> Dict:
    """Crear un issue en GitHub"""
    
    if not GITHUB_TOKEN:
        print("❌ Error: Necesitas configurar GITHUB_TOKEN")
        print("   export GITHUB_TOKEN=tu_token_aqui")
        return None
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/issues"
    
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    }
    
    data = {
        'title': title,
        'body': body,
        'labels': labels
    }
    
    if assignees:
        data['assignees'] = assignees
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        issue_data = response.json()
        print(f"✅ Issue creado: #{issue_data['number']} - {title}")
        return issue_data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error creando issue '{title}': {e}")
        return None

def main():
    """Función principal para crear todos los issues"""
    
    print("🚀 Creando issues en GitHub...")
    print(f"📁 Repositorio: {REPO_OWNER}/{REPO_NAME}")
    print()
    
    # Lista de issues a crear
    issues = [
        {
            "title": "Actualizar tarjetas de miembros en la landing page",
            "body": """Las tarjetas de miembros en la landing page necesitan ser actualizadas para mostrar información más relevante y mejorar la presentación visual.

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
- [ ] Implementar filtros por categorías (organizadores, sponsors, etc.)""",
            "labels": ["bug", "ui/ux", "high-priority"]
        },
        {
            "title": "Mejorar validación de autenticación en dashboard",
            "body": """El sistema de validación en las páginas del dashboard tiene vulnerabilidades y no previene el acceso no autorizado correctamente.

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
- [ ] Crear componente de protección de rutas""",
            "labels": ["security", "high-priority", "bug"]
        },
        {
            "title": "Arreglar sistema de equipos e invitaciones",
            "body": """El sistema de equipos y invitaciones tiene problemas de funcionalidad que impiden el flujo correcto de trabajo en equipo.

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
- [ ] Añadir logs de actividad de equipos""",
            "labels": ["bug", "feature", "high-priority"]
        },
        {
            "title": "Corregir problemas de navbar y botones",
            "body": """El navbar tiene problemas de diseño que afectan la experiencia del usuario, especialmente en dispositivos móviles.

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
- [ ] Optimizar espaciado y padding""",
            "labels": ["ui/ux", "bug", "high-priority"]
        },
        {
            "title": "Sistema completo de gestión de proyectos",
            "body": """Implementar un sistema completo de gestión de proyectos que permita a los equipos gestionar todo el ciclo de vida de sus proyectos desde la plataforma.

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
- [ ] Crear sistema de notificaciones de deadlines""",
            "labels": ["feature", "high-priority", "enhancement"]
        },
        {
            "title": "Sistema de verificación de emails para envío de proyectos",
            "body": """Implementar un sistema robusto de verificación de emails para el envío de proyectos, asegurando que solo equipos verificados puedan enviar sus proyectos.

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
- [ ] Implementar sistema de verificación masiva""",
            "labels": ["security", "feature", "high-priority"]
        },
        {
            "title": "Sistema de entrega y evaluación de proyectos",
            "body": """Crear un sistema completo para la entrega y evaluación de proyectos que incluya validaciones, scoring y feedback.

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
- [ ] Implementar sistema de apelaciones""",
            "labels": ["feature", "high-priority", "enhancement"]
        },
        {
            "title": "Mejorar seguridad del panel de administración con wallets",
            "body": """Implementar un sistema robusto de autenticación y autorización basado en wallets para el panel de administración, asegurando que solo wallets autorizadas puedan acceder.

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
- [ ] Añadir validaciones de seguridad avanzadas""",
            "labels": ["security", "high-priority", "enhancement"]
        }
    ]
    
    # Crear issues
    created_issues = []
    for i, issue in enumerate(issues, 1):
        print(f"📝 Creando issue {i}/{len(issues)}: {issue['title']}")
        
        result = create_issue(
            title=issue['title'],
            body=issue['body'],
            labels=issue['labels'],
            assignees=['MarxMad']
        )
        
        if result:
            created_issues.append(result)
        
        print()  # Línea en blanco para separar
    
    print(f"🎉 ¡Completado! Se crearon {len(created_issues)} issues de {len(issues)}")
    
    if created_issues:
        print("\n📋 Issues creados:")
        for issue in created_issues:
            print(f"  - #{issue['number']}: {issue['title']}")
            print(f"    🔗 {issue['html_url']}")

if __name__ == "__main__":
    main()
