# 🆘 Centros de Acopio — Gestión de Emergencia

Aplicación web (Next.js + TypeScript + Tailwind, **responsive**) para coordinar
la logística de donativos tras un desastre natural: centros de acopio, camiones,
horarios de salida e inventario de artículos necesarios. Datos en la nube y
**en tiempo real** con Supabase (multiusuario).

## Funcionalidades

- 🏢 **Centros de acopio**: registra los puntos de recolección de la ciudad.
- 🚚 **Camiones**: flota de transporte con estado (disponible / en ruta / mantenimiento).
- 🗓️ **Viajes / horarios de salida**: programa camión + origen + destino + fecha-hora.
- 📦 **Artículos necesarios**: lista de donativos por prioridad e inventario por centro.
- 📊 **Panel** con métricas clave y próximos viajes.
- 🔄 **Tiempo real**: los cambios aparecen al instante en todos los dispositivos.

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor → New query**, pega y ejecuta el contenido de
   [`supabase/schema.sql`](supabase/schema.sql).
3. Copia las credenciales desde **Project Settings → API**.

### 3. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-public-key
```

### 4. Arrancar

```bash
npm run dev
```

Abre <http://localhost:3000>. Si no configuras Supabase, la app igual abre y te
muestra un banner con los pasos.

## Despliegue

Despliega gratis en [Vercel](https://vercel.com): importa el repo y añade las
dos variables `NEXT_PUBLIC_SUPABASE_*` en el panel del proyecto.

## Notas de seguridad

Para responder rápido en emergencia, las tablas usan políticas RLS de **acceso
público** (cualquiera con la anon key lee/escribe). Si necesitas restringir,
reemplaza las políticas en `supabase/schema.sql` por unas basadas en autenticación.
