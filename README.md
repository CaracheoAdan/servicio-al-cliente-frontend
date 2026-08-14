# Servicio al Cliente & Logística - Frontend

Este repositorio contiene la Single Page Application (SPA) encargada de la gestión operativa, control de producción y logística de envíos para la planta. El frontend no solo es una interfaz de usuario, sino un "Heavy Client" que asume la responsabilidad de procesar cálculos matemáticos, orquestar llamadas de red y blindar la integridad de los datos de negocio antes de tocar el servidor.

---

## 1. Resumen Ejecutivo
El proyecto está construido bajo un ecosistema corporativo moderno diseñado para alta escalabilidad:
- **Core:** React + Vite
- **Lenguaje:** TypeScript (Tipado Estricto Empresarial)
- **Estilos:** Tailwind CSS
- **Testing:** Vitest + React Testing Library

El objetivo central de la aplicación es permitir a los operadores gestionar la creación de órdenes, orquestar la salida física de camiones de entrega y proveer a la gerencia un **Dashboard de Analíticas en Tiempo Real** procesado enteramente del lado del cliente.

---

## 2. Arquitectura del Proyecto

### A. Delegación Computacional (Frontend-Heavy)
Para proteger los recursos del servidor y garantizar una experiencia en tiempo real sin latencias de red por cada cálculo, **el backend actúa exclusivamente como un proveedor de datos crudos (JSON/REST)**. 

Toda la lógica de negocio secundaria se computa en el frontend:
- Cálculos matemáticos y métricas de desempeño (Cumplimiento de Entregas, Promedios de Tiempo).
- Cruce de relaciones entre Órdenes y Detalles.
- Transformaciones de datos masivos para las gráficas de `Recharts`.

*Nota de Rendimiento:* Los cálculos pesados están delegados en **Custom Hooks puros** (`useReports.ts`, etc.) para evitar re-renderizados innecesarios y proteger los FPS de la interfaz.

### B. Diseño Orientado a Características (Feature-Sliced Architecture)
El código está segregado verticalmente por "Dominios de Negocio" en lugar de estar separado horizontalmente por "Tipos de Archivo". Esta arquitectura garantiza un acoplamiento débil (loose coupling). Si se añade un módulo de "Facturación", este no romperá el módulo de "Órdenes" porque vivirán en silos paralelos.

---

## 3. Árbol de Directorios (Folder Structure)

```text
src/
├── app/                  # Configuración de nivel superior (Layouts globales, Providers)
├── assets/               # Recursos estáticos (imágenes, SVGs puros)
├── features/             # Módulos de dominio de negocio (SILOS Aislados)
│   ├── auth/             # Dominio: Autenticación de usuarios
│   ├── catalogs/         # Dominio: Catálogos maestros (Productos)
│   ├── orders/           # Dominio: Transacciones principales y formularios
│   ├── reports/          # Dominio: Analíticas y procesamiento de datos
│   └── users/            # Dominio: Gestión de personal y roles
└── shared/               # Núcleo de componentes compartidos y servicios base
    ├── api/              # Capa de Orquestación (axiosInstance, orderService)
    ├── components/       # UI Genérica "Tonta" (Botones, Tablas genéricas)
    └── utils/            # Funciones puras de formateo (Fechas, Monedas)
```

---

## 4. Capa de Orquestación (Anti-Corruption Layer)

El archivo crítico de infraestructura es `src/shared/api/orderService.ts`. Su propósito es actuar como una **Capa Anti-Corrupción (ACL)** entre la UI y el Backend.

**Reglas que encapsula:**
1. **Desacoplamiento de Entidades:** El backend guarda la orden y los detalles en rutas distintas. `orderService` realiza múltiples peticiones simultáneas, fusiona los datos en memoria, y le entrega a React un objeto "hidratado".
2. **Mutaciones Estrictas (OpenAPI 3.1.1):** El backend no admite la llave `id` en el *payload* JSON de una petición `PUT`. `orderService` limpia estos payloads dinámicamente antes del envío.
3. **Normalización de Enums:** El servidor transmite los estados en MAYÚSCULAS (`IN_DELIVERY`, `CLOSED`). El servicio asegura que React no tenga que lidiar con problemas de capitalización.

---

## 5. Guía de Contribución (Agregando un Nuevo Módulo)

Si deseas agregar un nuevo módulo (Ejemplo: **Facturación**), debes seguir este flujo estricto:

1. Crea el dominio en features: `mkdir src/features/billing`
2. Divide el dominio internamente:
   - `src/features/billing/components/` (UI atada a facturación)
   - `src/features/billing/hooks/` (Custom Hooks y Lógica de Estado)
   - `src/features/billing/pages/` (Vistas completas enrutables)
   - `src/features/billing/types/` (Interfaces TypeScript exclusivas del dominio)
3. **Regla de Aislamiento:** Un archivo dentro de `billing` NO DEBE importar componentes desde `features/orders`. Si dos dominios necesitan un mismo recurso, el recurso debe ser promovido (movido) a la carpeta `src/shared/`.
4. Añade la ruta de tu vista en el Router principal y en el Menú de Navegación de `src/app/`.

---

## 6. Comandos de Ejecución y Testing

**Instalación:**
```bash
npm install
```

**Levantar el Servidor de Desarrollo:**
```bash
npm run dev
```

**Ejecutar Pruebas Unitarias (Testing):**
```bash
# Corre las pruebas con watch
npm run test

# Corre las pruebas con reporte de cobertura (Coverage)
npm run test:coverage
```

**Compilación para Producción:**
```bash
npm run build
```
