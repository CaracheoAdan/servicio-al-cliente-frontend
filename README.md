# Servicio al Cliente & Logística - Frontend Empresarial

Este repositorio contiene la Single Page Application (SPA) encargada de la gestión operativa, control de producción y logística de envíos para la planta. El código ha sido diseñado bajo estándares corporativos estrictos de **Clean Code, Arquitectura Resiliente y Optimización de Rendimiento**.

---

## 1. Resumen Ejecutivo y Arquitectura
El proyecto se rige bajo dos mandamientos arquitectónicos inquebrantables:

### A. Delegación Computacional (Frontend-Heavy)
El servidor es exclusivamente un proveedor de datos crudos (JSON). **Toda la lógica de negocio secundaria se computa en el cliente** (cálculos matemáticos, promedios de cumplimiento, manipulación de gráficas Recharts).
* *Rendimiento:* Los cálculos masivos ocurren dentro de Custom Hooks puros y están protegidos por `useMemo` y selectores eficientes para garantizar que no bloqueen el hilo principal (Main Thread) del navegador.

### B. Diseño Feature-Sliced (Orientado a Dominios)
El código fuente está estrictamente segregado por "Dominios de Negocio" (`orders`, `reports`, `auth`). Un dominio vive en su propio silo. **Está terminantemente prohibida** la importación cruzada de componentes entre dominios (ej. `reports` no debe importar un componente visual de `orders`). Si un recurso es utilizado por ambos, debe ser promovido al directorio raíz `src/shared/`.

---

## 2. Decisiones Técnicas y Herramientas

### Gestión de Estado Profesional (Server State)
Se ha implementado **@tanstack/react-query** como el orquestador absoluto del estado asíncrono.
* **Prohibido:** No se debe usar `useState` + `useEffect` para llamar a la API.
* **Beneficios:** Las peticiones están cacheadas (evitando re-fetches masivos al servidor), incluyen reintentos automáticos, y la UI se suscribe a los selectores cacheados.

### Capa Anti-Corrupción y Orquestación (`orderService.ts`)
El backend utiliza reglas estrictas de API (OpenAPI 3.1.1): prohíbe IDs en los cuerpos de `PUT`, requiere Enums en `MAYÚSCULAS`, y separa la orden principal de sus detalles.
El servicio `src/shared/api/orderService.ts` actúa como el traductor definitivo. Toma los DTOs de React, los formatea a los caprichos del backend, y al recibir respuestas, orquesta múltiples llamadas concurrentes para devolver a React un objeto JSON único, hidratado y "digerido".

### Resiliencia y Manejo de Errores Globales
* **Error Boundaries:** Toda la aplicación (y las rutas individuales) están envueltas en `<ErrorBoundary />`. Un fallo en el código jamás dejará la pantalla en blanco; mostrará una interfaz amigable.
* **Interceptores HTTP:** `axiosInstance.ts` cuenta con un interceptor global que captura los códigos `400`, `401`, `500` y lanza automáticamente notificaciones amigables vía `react-hot-toast`, ocultando las trazas de error técnico al usuario final.

### Diseño UI, Componentes Base y Code Splitting
* **Sistema de Diseño Compartido:** Utilizando Tailwind CSS, los patrones de clases utilitarias masivas se extrajeron a componentes de diseño (`Button.tsx`, `Card.tsx`) ubicados en `src/shared/components/`. 
* **Lazy Loading:** Las vistas están particionadas mediante `React.lazy` y `Suspense`. Si un operador de planta solo visita la ruta de Órdenes, el navegador jamás descargará en memoria el código de las Gráficas.

---

## 3. Developer Experience (DX) y Code Quality
Para garantizar un código limpio y libre de malas prácticas:
1. **TypeScript Estricto:** Está prohibido el uso de `any`. Las interfaces (`CombinedOrder`, etc.) deben respetarse a rajatabla.
2. **ESLint + Prettier:** Recomendamos altamente el uso de extensiones de IDE y en CI/CD el uso de `oxlint` (ya configurado en `package.json`).
3. **Pre-commit Hooks (Recomendado):** Se debe configurar Husky y lint-staged para impedir `git commit` si hay advertencias de TypeScript o pruebas fallidas.

---

## 4. Árbol de Directorios (Folder Structure)
```text
src/
├── app/                  # Orquestador raíz (App.tsx con Lazy, Suspense y QueryClient)
├── assets/               # Recursos estáticos
├── features/             # Dominios de Negocio (SILOS Aislados)
│   ├── auth/
│   ├── catalogs/
│   ├── orders/
│   ├── reports/          # Hooks pesados (useReports), UI tonta (ReportsPage)
│   └── users/
└── shared/               # Componentes y Servicios core de toda la app
    ├── api/              # Capa de Orquestación (axiosInstance, orderService)
    ├── components/       # Sistema de Diseño Base (Button, Card, ErrorBoundary)
    └── layout/           # Estructura maestra (Sidebar)
```

---

## 5. Comandos de Operación

**Instalación:**
```bash
npm install
```

**Levantar el Entorno Local:**
```bash
npm run dev
```

**Ejecutar Pruebas (Vitest + JSDOM):**
```bash
# Validará los cálculos matemáticos (Reports) y el mocking de la API (orderService)
npm run test
```

**Compilación para Producción:**
```bash
npm run build
```
