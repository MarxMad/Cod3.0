# 🚀 Configuración de Vercel para COD3.0 HACKATHON

## 📋 Variables de Entorno Requeridas

Para que el proyecto funcione en Vercel, necesitas configurar las siguientes variables de entorno:

### 🔧 Configuración en Vercel Dashboard

1. **Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Settings** → **Environment Variables**
3. **Añade estas variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://kxudkywhyuyjmalguiyv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dWRreXdoeXV5am1hbGd1aXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTI3MzEsImV4cCI6MjA3MjQyODczMX0.EqyGEnQxBfKR2_wd_oLdSWptMyLdjs8DdP4Q3ZNlzyM
RESEND_API_KEY = re_4dbgaz8h_2gNHmPn1Nuhm5yNDed6qqaqX
```

4. **Selecciona todos los ambientes:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **Guarda los cambios**

### 🔄 Redeploy

Después de configurar las variables de entorno:

1. **Ve a la pestaña "Deployments"**
2. **Haz clic en "Redeploy"** en el último deployment
3. **O haz un nuevo commit** para trigger un nuevo deployment

### ✅ Verificación

Una vez configurado, el proyecto debería:

- ✅ **Build exitosamente** sin errores
- ✅ **Funcionar correctamente** en producción
- ✅ **Enviar emails** de confirmación
- ✅ **Guardar datos** en Supabase

### 🆘 Troubleshooting

Si sigues teniendo problemas:

1. **Verifica que las variables estén configuradas** en todos los ambientes
2. **Revisa que no haya espacios extra** en los valores
3. **Asegúrate de que las URLs y keys sean correctas**
4. **Redeploy después de cada cambio** en las variables

### 📞 Soporte

Si necesitas ayuda, revisa los logs de build en Vercel Dashboard → Deployments → [tu deployment] → Function Logs
