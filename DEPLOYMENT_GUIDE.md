# 🚀 Guía de Despliegue en Render

## Paso 0: Configurar Network Access en MongoDB Atlas (IMPORTANTE)

⚠️ **PRIMERO DEBES HACER ESTO O NO FUNCIONARÁ**

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu cluster
3. En el menú lateral: **"Network Access"**
4. Click en **"Add IP Address"**
5. Click en **"Allow Access from Anywhere"** (esto agrega `0.0.0.0/0`)
6. Click en **"Confirm"**
7. **Espera 1-2 minutos** para que se apliquen los cambios

✅ Esto permite que Render (y tu PC) se conecten a Atlas.

---

## Paso 1: Inicializar productos en MongoDB Atlas (UNA SOLA VEZ)

Ejecuta este comando desde tu computadora local:

```powershell
$env:MONGO_ATLAS_URL="mongodb+srv://charlyUser:kgV2uoCUOuVyOpiD@earlycode.vgcrwvb.mongodb.net/?appName=earlycode"
$env:MONGO_INITDB_DATABASE="db_universal_bazar"
node scripts/init-products.js
```

O en una sola línea:
```powershell
$env:MONGO_ATLAS_URL="mongodb+srv://charlyUser:kgV2uoCUOuVyOpiD@earlycode.vgcrwvb.mongodb.net/?appName=earlycode"; $env:MONGO_INITDB_DATABASE="db_universal_bazar"; node scripts/init-products.js
```

✅ Este script verifica si ya hay productos y NO duplica datos.

---

## Paso 2: Crear Web Service en Render

1. Ve a [render.com](https://render.com) y haz login
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio: `carlosPadillaTorres/universalBazarBack`
4. Selecciona la rama: `features` (o `main` si haces merge)

---

## Paso 3: Configurar el servicio

**Name:** `universal-bazar-api` (o el que prefieras)

**Region:** Oregon (US West) - es gratis

**Branch:** `features`

**Root Directory:** (déjalo vacío)

**Runtime:** `Node`

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start:prod
```

---

## Paso 4: Variables de entorno en Render

⚠️ **IMPORTANTE**: Render usa la variable `PORT` automáticamente.

Agrega estas variables en el dashboard de Render:

| Variable | Valor |
|----------|-------|
| `MONGO_ATLAS_URL` | `mongodb+srv://charlyUser:kgV2uoCUOuVyOpiD@earlycode.vgcrwvb.mongodb.net/?appName=earlycode` |
| `MONGO_INITDB_DATABASE` | `db_universal_bazar` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://tu-frontend-url.com` (opcional, para CORS) |

**NO agregues la variable `PORT`** - Render la maneja automáticamente.

---

## Paso 5: Desplegar

1. Click en "Create Web Service"
2. Render comenzará a:
   - Instalar dependencias
   - Compilar TypeScript
   - Iniciar tu aplicación
3. Espera 3-5 minutos

---

## 🎉 ¡Listo!

Tu API estará disponible en: `https://universal-bazar-api.onrender.com`

### Endpoints:
- Swagger UI: `https://universal-bazar-api.onrender.com/api`
- Productos: `https://universal-bazar-api.onrender.com/products`

---

## 📝 Notas importantes

- ✅ El script de productos solo se ejecuta UNA VEZ desde tu computadora
- ✅ Render NO necesita Docker (usa tu código directamente)
- ✅ La base de datos está en Atlas (separada de Render)
- ✅ Render asigna el PORT automáticamente
- ⚠️ El tier gratuito de Render "duerme" después de 15 min de inactividad
- ⚠️ El primer request después de dormir toma ~30 segundos

---

## 🔧 Si necesitas re-inicializar productos

Desde MongoDB Compass o Atlas:
1. Conecta a tu cluster
2. Elimina la colección: `db.products.drop()`
3. Vuelve a ejecutar el script de inicialización
