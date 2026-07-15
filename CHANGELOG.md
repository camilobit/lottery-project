# 📝 CHANGELOG - Correcciones Aplicadas

## Versión 2.1.1 (Comprobantes no se veían en el Admin)

### 🐛 Bug Crítico Corregido: El comprobante de pago no llegaba al panel admin

**Problema:** El cliente subía la foto del comprobante en el paso 3 de la
compra, pero al abrir la solicitud en el panel admin, la imagen nunca
aparecía — imposible validar el pago visualmente.

**Causa raíz:** En `src/services/rifaService.js`, la función
`markAsPending()` (que se ejecuta al confirmar la compra) guardaba el
nombre, teléfono, email y ciudad del comprador, pero **nunca guardaba el
campo `proof`** (la imagen en base64) que sí llegaba correctamente desde el
formulario. Es decir, el dato se perdía en el último paso antes de guardarse.

**Corrección:**

✅ `src/services/rifaService.js` — `markAsPending()` ahora también guarda
`proof`, `proofFileName` y `proofFileType`. Se confirmó además que
`approvePurchase()` preserva ese campo (usa un merge de objeto, no lo
sobrescribe), así que el comprobante sigue visible incluso después de
aprobar la solicitud.

### 🛡️ Mejora de robustez relacionada: guardado silencioso podía fallar

Al revisar el flujo completo se detectó un riesgo relacionado: los
comprobantes se guardan en `localStorage` del navegador, que tiene un límite
de ~5-10MB en total. Si se acumulaban varios comprobantes pesados y se
superaba la cuota, el guardado fallaba **sin avisar a nadie** — la imagen se
veía bien en la sesión actual pero podía perderse al recargar la página.

✅ `src/config/app.config.js` — el límite de tamaño de archivo se bajó de
5MB a **2MB** (más seguro para almacenamiento en el navegador) y se
actualizaron todos los textos/mensajes relacionados para reflejarlo
(`PurchaseFlow.jsx`, `MESSAGES.ERROR.FILE_TOO_LARGE`, `helpers.js`).

✅ `src/hooks/useRifa.js` — `updateNumbers()` ahora revisa si el guardado en
`localStorage` fue exitoso. Si falla (por ejemplo, por cuota excedida),
se informa el error en vez de fallar en silencio.

✅ `src/utils/helpers.js` — `isValidImageFile()` ahora usa `USER_CONFIG`
centralizado en lugar de un límite duplicado y desactualizado (evita que
vuelvan a quedar desincronizados dos límites distintos en el código).

### 🔍 Verificación Realizada

- `node --check` sobre todos los `.js` modificados
- Verificación de balance de sintaxis en `PurchaseFlow.jsx`
- Se confirmó manualmente, revisando `updateNumber()`, que ningún otro método
  (`approvePurchase`, `rejectPurchase`, `updateBuyerInfo`, `setNumberState`)
  borra el campo `proof` accidentalmente — solo `adminReleaseNumber()` y
  `rejectPurchase()` lo limpian intencionalmente, que es el comportamiento
  correcto (al liberar/rechazar un número, tiene sentido borrar el
  comprobante anterior)

---

## Versión 2.1.0 (Completitud según especificación original)

Se revisó el documento completo de especificación ("Actúa como un Arquitecto
de Software...") punto por punto y se implementó todo lo que faltaba.

### 🛠️ Admin: Editar y Liberar solicitudes (pedido explícito del usuario)

**Problema:** Una vez aprobada una solicitud (estado VENDIDO), no había forma
de editarla ni eliminarla/liberarla — por ejemplo, para borrar una prueba.

**Causa:** `releaseReservation()` en `rifaService.js` solo funcionaba para
números en estado RESERVADO o PENDIENTE, nunca para VENDIDO. Tampoco existía
ninguna función para editar los datos del comprador ni cambiar el estado
manualmente.

**Solución:**

1. ✅ `src/services/rifaService.js` — 3 métodos nuevos:
   - `adminReleaseNumber()`: libera un número **sin importar su estado actual**
     (incluyendo VENDIDO), borrando todos los datos del comprador
   - `updateBuyerInfo()`: edita nombre, teléfono, email, ciudad y observaciones
     sin tocar el estado
   - `setNumberState()`: cambia el estado manualmente a cualquiera de los 4
     estados (Disponible / Reservado / Pendiente / Vendido)

2. ✅ `src/hooks/useRifa.js` — se exponen `releaseNumberAdmin`,
   `updateBuyerInfo` y `setNumberState`

3. ✅ `src/components/Admin/AdminNumberCard.jsx` (NUEVO) — tarjeta de gestión
   por número con:
   - Botón **✏️ Editar** → formulario inline (nombre, teléfono, email, ciudad,
     observaciones) con Guardar/Cancelar
   - Botón **🗑️ Liberar Número** → pide confirmación y libera el número
     completamente, sin importar el estado en que esté
   - Selector de **Cambiar estado** manual, con confirmación
   - Aprobar/Rechazar (solo visibles si el número está Pendiente)

4. ✅ `src/App.jsx` — el panel admin ahora muestra **todas** las solicitudes
   (reservadas + pendientes + vendidas) en una sola lista gestionable, con
   buscador por número/nombre y filtro por estado — ya no solo pendientes.

### ✨ Secciones del prompt original que faltaban

Comparando contra la especificación completa, se agregó lo que no estaba:

5. ✅ **`src/services/paymentService.js`** (NUEVO) — arquitectura de pagos
   abstracta pedida en el punto 17. Clase base `PaymentProvider` + proveedor
   activo `NequiPayment` + clases preparadas para `WompiPayment`,
   `MercadoPagoPayment`, `PayUPayment`, `BoldPayment` (solo hace falta
   implementar cada una y activarla en `app.config.js`, sin tocar la UI).
   `PurchaseFlow.jsx` ahora consume `getActivePaymentProvider()` en vez de
   leer `PAYMENT_CONFIG` directamente.

6. ✅ **`src/components/Winner/WinnerSection.jsx`** (NUEVO) — sección
   "Último Ganador" (punto 7). Mientras `LAST_WINNER` sea `null` en
   `app.config.js`, muestra el mensaje de transparencia pedido; cuando se
   defina, muestra foto/nombre/número/premio/fecha automáticamente.

7. ✅ **`src/components/NextDraw/NextDrawSection.jsx`** (NUEVO) — sección
   "Próximo Sorteo" (punto 8) con fecha, premio y lotería utilizada.

8. ✅ **`src/components/History/HistorySection.jsx`** (NUEVO) — historial
   público de ventas (punto 16), visible para cualquier visitante como
   refuerzo de transparencia (además del historial ya existente en el panel
   admin).

9. ✅ **`src/components/Hero/HeroSection.jsx` + `HeroIllustration.jsx`**
   (NUEVOS) — se extrajo el Hero a su propio componente y se agregó una
   imagen ilustrativa (SVG de un boleto de rifa, sin dependencias externas)
   pedida en el punto 4.

10. ✅ **`src/components/Stats/StatsCards.jsx`** (NUEVO) — ahora incluye las
    6 tarjetas pedidas en el punto 5: Premio, Total de números, Disponibles,
    Vendidos, **Fecha del sorteo** y **Lotería utilizada** (las dos últimas
    faltaban).

11. ✅ **Color dorado** — el punto 3 pedía blanco/azul oscuro/dorado/verde.
    Se usa `secondary` (`#d4af37`) como acento en badges, bordes y textos
    destacados (Último Ganador, Próximo Sorteo, categoría del Hero), sin
    saturar la interfaz con botones dorados grandes (para evitar "colores
    estridentes", como pedía el punto 3).

12. ✅ **Rendimiento** (punto 19) — `NumbersGrid` y `AdminNumberCard` ahora
    están memoizados con `React.memo` ya que se renderizan repetidamente
    dentro de listas.

### 🔍 Verificación Realizada

- Balance de llaves/paréntesis verificado en los 11 archivos nuevos/modificados
- `node --check` sobre todos los `.js` modificados
- Verificación cruzada de cada import contra la ruta real del archivo y su
  export (default/nombrado)
- Búsqueda de `process.env` en todo `src/`: sin coincidencias

---

## Versión 2.0.2 (Funcionalidad de Compra Completa)

### ✨ Botones "Comprar Número" y "Ver Números" ahora funcionan

**Problema:** Los botones del Hero eran decorativos, no tenían `onClick` ni existía
la grilla de números ni el flujo de compra.

**Solución — Se creó todo el flujo real:**

1. ✅ `src/components/Numbers/NumbersGrid.jsx` (NUEVO)
   - Grilla con los 100 números (00-99), coloreados según su estado
   - Buscador por número o nombre del comprador
   - Filtro por estado (Disponible / Reservado / Pendiente / Vendido)
   - Los números **disponibles** son clickeables; el resto está deshabilitado

2. ✅ `src/components/Purchase/PurchaseFlow.jsx` (NUEVO)
   - Modal con el flujo de compra en 3 pasos, usando el hook `usePurchaseForm`
     ya existente:
     1. **Formulario**: nombre, celular, email y ciudad (con validación en vivo)
     2. **Pago**: muestra los datos de Nequi, la llave, y el espacio del QR
        (usa `public/assets/payment/nequi-qr.png`; si no existe, muestra el
        placeholder "Aquí aparecerá el código QR")
     3. **Confirmación**: sube el comprobante y llama a `submitPurchase`, que
        deja el número en estado `PENDIENTE`

3. ✅ `src/App.jsx` (Reescrito)
   - Botón **"Ver Números Disponibles"** → hace scroll suave hasta la grilla
   - Botón **"Comprar Número"** → hace scroll a la grilla para que el usuario
     elija su número (al hacer clic en un número disponible se abre el modal
     de compra)
   - Se agregó la sección `#numeros` con el título "Elige tu Número"
   - El **Panel Admin** ahora muestra las solicitudes pendientes reales (con
     el comprobante, nombre, teléfono) con botones funcionales para
     **Aprobar** / **Rechazar**, y una sección de **Últimas Ventas**

### 🔍 Verificación Realizada

- Balance de llaves/paréntesis verificado en los 3 archivos nuevos/modificados
- Rutas de imports verificadas contra la estructura real de carpetas
- Props de `Modal`, `Button`, `Input`, `Alert`, `Badge` verificadas contra
  `src/components/Common/index.jsx`

---

## Versión 2.0.1 (Corrección de Bugs)

### 🐛 Bug Crítico Corregido: Pantalla en Blanco

**Problema:** La aplicación mostraba una pantalla en blanco con el error:
```
Uncaught ReferenceError: process is not defined
```

**Causa:** El código usaba `process.env.VARIABLE` (sintaxis de Create React App / Webpack), 
pero este proyecto usa **Vite**, que requiere `import.meta.env.VARIABLE` en su lugar.
La variable global `process` no existe en el navegador cuando se usa Vite.

**Archivos corregidos:**

1. ✅ `src/config/app.config.js`
   - `process.env.REACT_APP_WOMPI_PUBLIC_KEY` → `import.meta.env.VITE_WOMPI_PUBLIC_KEY`
   - `process.env.REACT_APP_STRIPE_PUBLIC_KEY` → `import.meta.env.VITE_STRIPE_PUBLIC_KEY`

2. ✅ `src/hooks/useAdminAuth.js`
   - `process.env.REACT_APP_ADMIN_PASSWORD` → `import.meta.env.VITE_ADMIN_PASSWORD`

3. ✅ `src/utils/helpers.js`
   - `process.env.NODE_ENV === 'development'` → `import.meta.env.DEV`
   (dos ocurrencias, en `debugLog` y `debugError`)

### 📌 Nota Importante sobre Variables de Entorno en Vite

En proyectos Vite:
- Las variables de entorno accesibles en el navegador **deben empezar con `VITE_`**
- Se accede a ellas con `import.meta.env.VITE_NOMBRE`, nunca con `process.env`
- Se agregó un archivo `.env` con valores por defecto para desarrollo inmediato

### ✅ Se agregó

- Archivo `.env` (además de `.env.example`) con la contraseña de admin por defecto
  (`Admin123!`) para que la app funcione sin configuración adicional

### 🔍 Verificación Realizada

Se ejecutó una búsqueda exhaustiva en todo `src/` para confirmar que no quedara
ninguna referencia a `process.env`:

```bash
grep -rn "process\.env" src/
# Resultado: ✅ Sin coincidencias
```

Se verificó también la sintaxis de todos los archivos `.js` con `node --check`,
confirmando que no hay errores de sintaxis.

---

## Cómo Aplicar Esta Corrección (si ya tenías el proyecto anterior)

Si ya habías descargado la versión 2.0.0 y quieres solo aplicar el fix sin
descargar todo de nuevo:

1. Abre `src/config/app.config.js`, busca `process.env` y reemplaza por
   `import.meta.env` (cambiando también `REACT_APP_` por `VITE_` en los nombres)
2. Haz lo mismo en `src/hooks/useAdminAuth.js`
3. Haz lo mismo en `src/utils/helpers.js`
4. Crea un archivo `.env` en la raíz con:
   ```
   VITE_ADMIN_PASSWORD=Admin123!
   ```
5. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`
6. Limpia caché del navegador: `Ctrl+Shift+R`

**O simplemente usa este ZIP nuevo**, que ya tiene todo corregido. ✅


### 🐛 Bug Crítico Corregido: Pantalla en Blanco

**Problema:** La aplicación mostraba una pantalla en blanco con el error:
```
Uncaught ReferenceError: process is not defined
```

**Causa:** El código usaba `process.env.VARIABLE` (sintaxis de Create React App / Webpack), 
pero este proyecto usa **Vite**, que requiere `import.meta.env.VARIABLE` en su lugar.
La variable global `process` no existe en el navegador cuando se usa Vite.

**Archivos corregidos:**

1. ✅ `src/config/app.config.js`
   - `process.env.REACT_APP_WOMPI_PUBLIC_KEY` → `import.meta.env.VITE_WOMPI_PUBLIC_KEY`
   - `process.env.REACT_APP_STRIPE_PUBLIC_KEY` → `import.meta.env.VITE_STRIPE_PUBLIC_KEY`

2. ✅ `src/hooks/useAdminAuth.js`
   - `process.env.REACT_APP_ADMIN_PASSWORD` → `import.meta.env.VITE_ADMIN_PASSWORD`

3. ✅ `src/utils/helpers.js`
   - `process.env.NODE_ENV === 'development'` → `import.meta.env.DEV`
   (dos ocurrencias, en `debugLog` y `debugError`)

### 📌 Nota Importante sobre Variables de Entorno en Vite

En proyectos Vite:
- Las variables de entorno accesibles en el navegador **deben empezar con `VITE_`**
- Se accede a ellas con `import.meta.env.VITE_NOMBRE`, nunca con `process.env`
- Se agregó un archivo `.env` con valores por defecto para desarrollo inmediato

### ✅ Se agregó

- Archivo `.env` (además de `.env.example`) con la contraseña de admin por defecto
  (`Admin123!`) para que la app funcione sin configuración adicional

### 🔍 Verificación Realizada

Se ejecutó una búsqueda exhaustiva en todo `src/` para confirmar que no quedara
ninguna referencia a `process.env`:

```bash
grep -rn "process\.env" src/
# Resultado: ✅ Sin coincidencias
```

Se verificó también la sintaxis de todos los archivos `.js` con `node --check`,
confirmando que no hay errores de sintaxis.

---

## Cómo Aplicar Esta Corrección (si ya tenías el proyecto anterior)

Si ya habías descargado la versión 2.0.0 y quieres solo aplicar el fix sin
descargar todo de nuevo:

1. Abre `src/config/app.config.js`, busca `process.env` y reemplaza por
   `import.meta.env` (cambiando también `REACT_APP_` por `VITE_` en los nombres)
2. Haz lo mismo en `src/hooks/useAdminAuth.js`
3. Haz lo mismo en `src/utils/helpers.js`
4. Crea un archivo `.env` en la raíz con:
   ```
   VITE_ADMIN_PASSWORD=Admin123!
   ```
5. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`
6. Limpia caché del navegador: `Ctrl+Shift+R`

**O simplemente usa este ZIP nuevo**, que ya tiene todo corregido. ✅
