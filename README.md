# Sistema de Logística y Servicio al Cliente (Frontend)

Este repositorio contiene la arquitectura Frontend (Single Page Application) diseñada a nivel corporativo para la **Gestión Operativa, Control de Producción y Logística de Envíos**. 

El sistema actúa como la torre de control de la planta: permite a los operadores crear y monitorear transacciones de pedidos, gestionar la salida física (liberación) de camiones de entrega, y proyectar un Dashboard de Inteligencia de Negocios en tiempo real para gerencia, calculando métricas de rendimiento logístico y cumplimiento de productos.

---

## 1. Topología y Arquitectura del Proyecto

Para garantizar resiliencia, rendimiento y escalabilidad paralela, la aplicación emplea tres patrones de diseño críticos: **Frontend-Heavy Delegation**, **Feature-Sliced Design**, y un **Anti-Corruption Layer**.

### A. Delegación Computacional (Frontend-Heavy)
El servidor backend es tratado exclusivamente como un almacén de datos (Data Provider). La matemática pesada ocurre en el cliente:
* El cálculo de la **Métrica de Cumplimiento General** (Surtido vs Tiempo).
* La agregación de horas para detectar **Picos de Transporte**.
* La consolidación de órdenes maestras.

*Estrategia de Rendimiento:* Todo procesamiento masivo está aislado en *Custom Hooks* protegidos por Memoización (`useMemo`), impidiendo que el motor de renderizado de React (Main Thread) colapse o degrade los fotogramas por segundo (FPS).

### B. Anti-Corruption Layer (Capa de Traducción API)
El backend impone restricciones drásticas bajo el estándar OpenAPI 3.1.1 (ej. no permite incluir IDs en peticiones PUT, exige que todos los enumeradores de estado logístico viajen en UPPERCASE absoluto, y mantiene las cabeceras de orden separadas de sus ítems).

```mermaid
sequenceDiagram
    participant UI as 🖥️ UI (React Components)
    participant RQ as ⚡ React Query (Caché)
    participant ACL as 🛡️ orderService (Anti-Corruption Layer)
    participant API as 🗄️ Backend API (REST)

    UI->>RQ: useReports() solicita datos
    RQ->>ACL: Llama a getAllCombinedOrders()
    ACL->>API: Fetch paralelo (/orders, /orderDetails, /order_items)
    API-->>ACL: JSON fragmentado y estricto
    Note over ACL: El servicio limpia, formatea a UPPERCASE,<br/>y une la orden con sus items.
    ACL-->>RQ: Retorna DTO hidratado y limpio
    RQ-->>UI: Proveé métricas en caché a las gráficas
```

### C. Control de Acceso y Seguridad (RBAC)
La plataforma emplea un sistema de seguridad basado en roles (RBAC) gestionado localmente mediante un `AuthContext` reactivo y el componente `PermissionGuard`.
* **Protección de Rutas:** Cada módulo está protegido por un permiso específico (ej. `orders`, `reports`, `users`). 
* **Prevención de Escalación de Privilegios:** El payload de registro de usuarios previene activamente inyecciones de `roleId`.
* **Mitigación CWE-204:** Los endpoints de autenticación previenen la enumeración de usuarios utilizando mensajes de error genéricos ante credenciales inválidas.
* **Manejo Reactivo de Sesiones:** Cuando un token JWT expira (validado en cliente periódicamente o rechazado con un HTTP 401), se despacha un `CustomEvent` que limpia la sesión limpiamente a través de React Router en lugar de forzar recargas destructivas de la ventana.

---

## 2. Árbol de Directorios y Silos de Negocio

La base de código rechaza la estructura tradicional por tipo de archivo y abraza el **Diseño Orientado a Dominios (Feature-Sliced)**. A continuación, el mapa visual del ecosistema y su diccionario de responsabilidades:

```mermaid
graph TD
    %% Nodos Principales
    Root((Raíz del Proyecto)) --> App[📁 app /]
    Root --> Feat[📁 features /]
    Root --> Shared[📁 shared /]

    %% Detalles de App
    App --> AppFile[📄 App.tsx: Orquestador Maestro, Enrutador, Lazy Loading]

    %% Detalles de Features (Silos)
    Feat --> FOrders[📦 orders: Gestión de Transacciones]
    Feat --> FReports[📊 reports: Inteligencia de Negocios]
    Feat --> FAuth[🔐 auth: Control de Accesos]

    %% Detalles de Shared
    Shared --> SApi[🌐 api: Interceptores y orderService]
    Shared --> SComp[🧩 components: Design System Base]

    %% Relaciones
    FOrders -.->|Importación Permitida| Shared
    FReports -.->|Importación Permitida| Shared
    FOrders -.->|❌ Prohibido Cruzar| FReports

    classDef silo fill:#f9f2f4,stroke:#333,stroke-width:2px;
    class FOrders,FReports,FAuth silo;
```

### Diccionario Detallado del Proyecto

#### 📁 `src/app/` (El Motor de Arranque)
Es el punto de entrada de React. 
* **`App.tsx`**: Contiene la definición de todas las rutas de la aplicación. Configura herramientas globales críticas: el `QueryClientProvider` para manejar la caché de datos asíncronos, el `ErrorBoundary` global para atrapar crashes, y `React.lazy` con `Suspense` para dividir el código (Code Splitting) y asegurar que el navegador solo descargue los módulos que el usuario realmente visita.

#### 📁 `src/features/` (Los Dominios de Negocio Aislados)
* **`orders/`**: Maneja la vida de un pedido. Contiene `OrderFormPage` (formulario con blindaje de inputs) y `OrderListPage` (tabla de control donde los operadores ejecutan la acción logística de "Liberar Camión").
* **`reports/`**: El motor analítico. Separa su lógica en `hooks/useReports.ts` (descarga en caché y procesa cálculos matemáticos sin tocar la UI) y `pages/ReportsPage.tsx` (una UI que únicamente "dibuja" gráficas de SVG usando Recharts y alertas visuales de Emojis).
* **`catalogs/` & `users/` & `auth/`**: Módulos encargados de la administración maestra de la plataforma.

#### 📁 `src/shared/` (El Núcleo Reutilizable)
* **`api/axiosInstance.ts`**: El guardián de la red. Contiene un interceptor global que captura respuestas fallidas (400, 401, 429, 500) y lanza notificaciones emergentes amigables (`react-hot-toast`), ocultando el terror técnico al usuario y cerrando sesiones expiradas automáticamente mediante eventos custom.
* **`api/orderService.ts`**: El cerebro de orquestación. Intercepta los objetos de la interfaz y los moldea obligatoriamente a los caprichos del backend antes de enviarlos a la red.
* **`context/AuthContext.tsx`**: Estado centralizado de seguridad que gestiona sesión, permisos JWT, perfiles y persistencia.
* **`components/`**: El "Design System" de la empresa. Contiene componentes de infraestructura UI pura como `Button.tsx`, `PermissionGuard.tsx` para RBAC y el `ErrorBoundary.tsx`.

---

## 3. Resiliencia y Control de Calidad (DX)

* **Zero White Screens:** El sistema está protegido por Error Boundaries. Si un componente de terceros falla al renderizar, la aplicación aislará el error en una tarjeta visual elegante sin colapsar el resto de la interfaz.
* **Tipado Estricto (TypeScript):** El proyecto aplica una filosofía de "cero tolerance to any". Las interfaces del modelo de datos (`CombinedOrder`, `CreateOrderPayload`) garantizan la integridad de la información en tiempo de compilación.
* **Linter de Alta Velocidad:** Se emplea `oxlint` para garantizar de forma ultrarrápida que el código se apegue a estándares profesionales antes de llegar a producción.

---

## 4. Guía de Contribución (Agregando Módulos)

Si el equipo de ingeniería necesita incorporar un nuevo dominio (por ejemplo, **Facturación / Billing**), los pasos inquebrantables son:

1. **Crear el Silo:** Construir la carpeta en `src/features/billing`.
2. **Sub-división Interna:** Establecer carpetas exclusivas para `components`, `hooks`, `pages` y `types`.
3. **Restricción de Aislamiento:** Bajo ninguna circunstancia el módulo de facturación puede importar la lógica de botones o hooks pertenecientes a `src/features/orders`. Si ambos requieren un mismo recurso, el código debe ser promovido al directorio maestro `src/shared/`.
4. **Registro Perezoso:** Agregar la nueva ruta en `src/app/App.tsx` utilizando obligatoriamente la sintaxis `lazy(() => import(...))`.

---

## 5. Instrucciones de Despliegue y Operación

**Clonar e Instalar:**
```bash
npm install
```

**Entorno de Desarrollo:**
```bash
npm run dev
```

**Auditoría y Pruebas Unitarias (Vitest):**
Ejecuta la suite de pruebas aislando las funciones matemáticas y validando la efectividad de la Capa Anti-Corrupción (Mocking).
```bash
npm run test
```

**Compilación Final Optimizada:**
```bash
npm run build
```
