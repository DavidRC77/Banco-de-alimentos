# 📋 Instrucciones para Actualizar Supabase

## Cambios Realizados en el Código

He actualizado tu aplicación para:

1. ✅ **Mostrar solo datos de hoy** - Las reservas ahora se filtran por fecha actual por defecto
2. ✅ **Agregar estado de pago** - Puedes marcar si una reserva está pagada o pendiente
3. ✅ **Cambiar estado de canchas** - Puedes marcar canchas como disponibles o en mantenimiento

## ⚠️ IMPORTANTE: Cambios en Base de Datos

Para que todo funcione correctamente, debes actualizar tus tablas en Supabase:

### 1️⃣ Tabla `reservas` - Agregar 2 columnas:

**Opción A: Interfaz Web de Supabase**

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. En el menú lateral, ve a **SQL Editor** o **Database > Tables > reservas**
3. Haz clic en el botón **+** o **Add Column**
4. Agrega estas dos columnas:

   **Columna 1:**
   - Nombre: `monto`
   - Tipo: `numeric` o `double precision`
   - Default: `0`
   - ✓ Requerido: NO

   **Columna 2:**
   - Nombre: `estado_pago`
   - Tipo: `text`
   - Default: `'pendiente'`
   - ✓ Requerido: NO

**Opción B: Usando SQL (Recomendado)**

```sql
-- Agregar columna monto
ALTER TABLE reservas
ADD COLUMN monto NUMERIC DEFAULT 0;

-- Agregar columna estado_pago
ALTER TABLE reservas
ADD COLUMN estado_pago TEXT DEFAULT 'pendiente';
```

### 2️⃣ Tabla `canchas` - Agregar 2 columnas:

**Opción A: Interfaz Web**

1. Ve a **Database > Tables > canchas**
2. Haz clic en el botón **+** o **Add Column**
3. Agrega estas dos columnas:

   **Columna 1:**
   - Nombre: `estado`
   - Tipo: `text`
   - Default: `'disponible'`
   - ✓ Requerido: NO

   **Columna 2:**
   - Nombre: `precio_por_hora`
   - Tipo: `numeric` o `integer`
   - Default: `120`
   - ✓ Requerido: NO

**Opción B: Usando SQL**

```sql
-- Agregar columna estado
ALTER TABLE canchas
ADD COLUMN estado TEXT DEFAULT 'disponible';

-- Agregar columna precio_por_hora
ALTER TABLE canchas
ADD COLUMN precio_por_hora NUMERIC DEFAULT 120;
```

## 🎯 Funcionalidades Nuevas

### En la página de **Reservas**:
- ✅ Campo "Monto" (en Bs.)
- ✅ Selector "Estado de Pago" (Pendiente/Pagado)
- ✅ Resumen visual del estado de pago

### En la página de **Reportes**:
- ✅ Filtro por fecha
- ✅ Ver todas las reservas históricas (usa parámetro `?all=true`)
- ✅ Botón para cambiar estado de pago directamente
- ✅ Cálculo automático de totales pagado/pendiente

### En la página de **Canchas**:
- ✅ Ver estado de cada cancha (Disponible/Mantenimiento)
- ✅ Botón de edición para cambiar estado
- ✅ Colores visuales (verde para disponible, rojo para mantenimiento)

## 🧪 Cómo Probar

1. Actualiza tu base de datos con las columnas nuevas (ver arriba)
2. Ejecuta los dos comandos en otra terminal:
   ```bash
   npm run dev:api
   npm run dev
   ```
3. Ve a **http://localhost:3000/reservas** y crea una nueva reserva
4. Ahora podrás:
   - Ingresar un monto
   - Seleccionar si está pagada o pendiente
5. Ve a **http://localhost:3000/reportes** y verás:
   - El estado de pago de cada reserva
   - Totales pagado/pendiente
   - Botón para cambiar estado
6. Ve a **http://localhost:3000/canchas** y:
   - Haz clic en ✏️ para editar el estado
   - Selecciona Disponible o Mantenimiento

## 📝 API Endpoints Nuevos

```
PATCH /api/reservas/:id/estado-pago
Body: { "estado_pago": "pagado" | "pendiente" }

PATCH /api/canchas/:id/estado
Body: { "estado": "disponible" | "mantenimiento" }
```

## ❓ Problemas Comunes

**P: El sistema aún muestra datos de días anteriores**
R: Asegúrate de que ya no estés usando la ruta antigüa. Para obtener TODAS las reservas (histórico), usa:
   `http://localhost:3001/api/reservas?all=true`

**P: Los reportes no muestran el estado de pago**
R: Verifica que agregaste la columna `estado_pago` a la tabla `reservas` en Supabase

**P: Las canchas no permiten cambiar estado**
R: Verifica que agregaste la columna `estado` a la tabla `canchas` en Supabase

---

**¿Necesitas ayuda?** Revisa que:
1. ✅ Base de datos actualizada con las nuevas columnas
2. ✅ API ejecutándose (`npm run dev:api`)
3. ✅ Frontend ejecutándose (`npm run dev`)
