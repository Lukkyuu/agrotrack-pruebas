# Stitch Constitution: AgroTrack

**Project Name:** AgroTrack — Plataforma Inteligente de Trazabilidad y Gestión de Acopio Agrícola  
**Stitch Project ID:** `projects/agrotrack-cloud-native`  
**Version:** 1.0.0  
**Backend Framework:** Spring Boot 3.x (Microservicios BFF, Catalog, Deliveries)  
**Target Client Stack:** React 18 + Vite + TypeScript + TanStack Query + Tailwind CSS  

---

## 1. Core Identity

### 1.1 Misión
Proveer una interfaz de monitoreo y operación en tiempo real para centros de acopio agrícola y productores, garantizando trazabilidad de extremo a extremo desde el pesaje y recepción de materias primas hasta el despacho final, optimizando la capacidad física de bodegas y asegurando un gobierno de accesos estricto mediante Azure AD (Microsoft Entra ID).

### 1.2 Audiencia Objetivo y Perfiles de Acceso (RBAC)
La interfaz adapta su navegación, paneles y acciones según los App Roles declarados en el token JWT del usuario:
- **`ROLE_ADMIN` (Administrador de Planta / Sistema):** Supervisión global, creación y configuración de productos en catálogo, auditoría de eventos y anulación/cambios excepcionales de estado.
- **`ROLE_OPERADOR` (Jefe de Acopio / Operador de Bodega):** Operación táctica en terreno; recepción de camiones, pesaje en báscula, inspección de calidad, transición de estados en la línea de acopio (`REGISTRADA` ➔ `RECIBIDA` ➔ `EN_CLASIFICACION` ➔ `EN_DESPACHO` ➔ `DESPACHADA`).
- **`ROLE_PRODUCTOR` (Productor Agrícola / Agricultor):** Auto-registro de lotes de entrega previa llegada a planta y seguimiento en vivo del estado de sus cosechas entregadas mediante su RUT.
- **`ROLE_AUDITOR` (Auditor de Calidad y Cumplimiento):** Monitoreo pasivo de métricas de rechazo, trazabilidad cronológica de lotes y logs de eventos.

### 1.3 Tono y Voz
- **Utilitario y Eficiente:** Orientado a faenas agroindustriales con interfaces densas en datos, tablas legibles bajo luz solar directa o tablets de bodega, sin fricción ni adornos superfluos.
- **Transparente y Fiable:** Claridad absoluta en el estado de las cargas y los motivos de rechazo o falta de capacidad.
- **Robusto y Preventivo:** Retroalimentación inmediata ante transiciones de estado no permitidas (409 Conflict) o alertas de sobrecupo en silos/bodegas.

---

## 2. Visual Language & Design Tokens

### 2.1 Aesthetic Keywords (Vibe)
1. **Agritech Precision:** Estética limpia inspirada en software satelital y agrícola moderno, combinando verdes orgánicos con fondos técnicos de alta legibilidad.
2. **Industrial Utility:** Jerarquía tipográfica marcada, métricas numéricas en fuentes monoespaciadas para pesajes y RUTs, y estados visuales tipo semáforo industrial.
3. **Tactile & Responsive:** Controles de estado tipo botones de mando, tarjetas con micro-elevaciones y bordes sutilmente contrastados tanto en modo claro como en modo oscuro.

### 2.2 Color Palette & Semantic Roles

| Token | Nombre Descriptivo | Hex | Rol Funcional en la UI |
|---|---|---|---|
| `color-brand-primary` | Forest Canopy Emerald | `#0D5C3A` | Color primario de marca, botones principales, barra lateral activa |
| `color-brand-accent` | Fresh Sprout Green | `#10B981` | Acentos positivos, estado `DESPACHADA`, capacidad disponible saludable (>30%) |
| `color-surface-bg-light` | Morning Mist Off-White | `#F8FAFC` | Fondo principal en tema claro |
| `color-surface-card-light`| Pure Crisp White | `#FFFFFF` | Tarjetas, modales y superficies elevadas (claro) |
| `color-surface-bg-dark` | Deep Earth Charcoal | `#0B0F19` | Fondo principal en tema oscuro |
| `color-surface-card-dark`| Midnight Slate | `#131B2E` | Tarjetas, tablas y paneles laterales (oscuro) |
| `color-border-subtle` | Weathered Wire | `#E2E8F0` (Dark: `#1E293B`) | Bordes divisores de tablas, inputs y tarjetas |
| `color-status-registrada`| Slate Neutral | `#64748B` | Estado `REGISTRADA` (esperando arribo a báscula) |
| `color-status-recibida`  | Golden Amber | `#D97706` | Estado `RECIBIDA` (ingresada a bodega, descuenta stock) |
| `color-status-clasif`    | Ocean Indigo | `#3B82F6` | Estado `EN_CLASIFICACION` (control de calidad/selección) |
| `color-status-despacho`  | Purple Harvest | `#8B5CF6` | Estado `EN_DESPACHO` (asignada a camión saliente) |
| `color-status-despachada`| Emerald Success | `#10B981` | Estado final `DESPACHADA` (completada con éxito) |
| `color-status-rechazada` | Crimson Distress | `#EF4444` | Estado final `RECHAZADA` (no apta, no ocupa bodega) |

### 2.3 Tipografía
- **Fuente Principal (Sans-Serif):** `Inter`, `system-ui` para títulos, navegación y cuerpo de texto general.
- **Fuente Técnica / Numérica (Mono):** `JetBrains Mono`, `Roboto Mono` para códigos de lote (`#DEL-001`), RUT de productores (`12.345.678-9`), capacidades en kilogramos (`1,250.00 kg`) y timestamps ISO.

### 2.4 Geometría, Profundidad y Elevación
- **Bordes:** `rounded-lg` (8px) para tarjetas y tablas; `rounded-full` (pill) para badges de estado y avatares; `rounded-md` (6px) para inputs y botones.
- **Elevación:** 
  - Nivel 0 (Flat): Fondo de canvas `#F8FAFC` / `#0B0F19`.
  - Nivel 1 (Cards): `shadow-sm ring-1 ring-black/5 dark:ring-white/10`.
  - Nivel 2 (Modales/Drawers): `shadow-xl ring-1 ring-black/10 dark:ring-white/15 backdrop-blur-md`.

---

## 3. Architecture & File Structure

El frontend consumirá exclusivamente los endpoints expuestos por el **BFF (`ms-agrotrack-bff` en el puerto 8080)**, el cual maneja la autenticación y reenvía las peticiones a `ms-agrotrack-deliveries` (8081) y `ms-agrotrack-catalog` (8082).

```text
agrotrack-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                     # Clientes HTTP y endpoints BFF (/api/deliveries, /api/catalog)
│   │   ├── client.ts            # Axios / Fetch con interceptor Bearer Token MSAL
│   │   ├── catalogApi.ts        # GET/POST productos, descontar capacidad
│   │   └── deliveriesApi.ts     # GET/POST/PUT entregas y status
│   ├── components/              # Componentes visuales atómicos y moleculares
│   │   ├── common/              # Botones, Badges, Modales, Skeletons
│   │   │   ├── DeliveryStatusBadge.tsx
│   │   │   ├── CapacityProgressBar.tsx
│   │   │   └── SkeletonCard.tsx
│   │   ├── layout/              # Shell, Navbar, Sidebar
│   │   │   ├── AppShell.tsx
│   │   │   ├── TopAppBar.tsx
│   │   │   └── SidebarNav.tsx
│   │   └── dashboard/           # Widgets específicos del Dashboard
│   │       ├── MetricSummaryCards.tsx
│   │       ├── WarehouseCapacityWidget.tsx
│   │       ├── DeliveryPipelineFlow.tsx
│   │       ├── RecentDeliveriesTable.tsx
│   │       ├── StatusTransitionModal.tsx
│   │       └── CreateDeliveryDrawer.tsx
│   ├── hooks/                   # Lógica aislada y TanStack Queries
│   │   ├── useDeliveries.ts
│   │   ├── useCatalog.ts
│   │   ├── useDeliveryTransition.ts
│   │   └── useAuthUser.ts
│   ├── data/                    # Datos desacoplados y mocks de fallback
│   │   └── mockData.ts
│   ├── types/                   # Tipos TypeScript compartidos con backend
│   │   └── agrotrack.ts
│   ├── pages/                   # Vistas principales
│   │   ├── DashboardPage.tsx
│   │   ├── DeliveriesPage.tsx
│   │   └── CatalogPage.tsx
│   ├── App.tsx                  # Enrutador y Providers (QueryClient, Auth)
│   ├── main.tsx
│   └── index.css                # Variables CSS de tokens Stitch y Tailwind
├── .stitch/
│   └── SITE.md                  # Constitución de diseño Stitch
├── package.json
└── tailwind.config.js
```

---

## 4. Live Sitemap & Matriz de Rutas

| Estado | Ruta | Nombre de Pantalla | Roles Permitidos | Descripción Funcional |
|:---:|---|---|---|---|
| `[x]` | `/` o `/dashboard` | **Dashboard Central de Operaciones** | Todos (`ADMIN`, `OPERADOR`, `PRODUCTOR`, `AUDITOR`) | KPIs en vivo (kilos recibidos, capacidad bodega, tasa rechazo), embudo de estados y tabla de entregas recientes con acción de cambio de estado. |
| `[ ]` | `/deliveries` | **Gestión Integral de Entregas** | Todos | Tabla y vista Kanban con filtros por estado (`status`), búsqueda por RUT y selector de rango de fechas. |
| `[ ]` | `/deliveries/new` | **Recepción de Carga / Nueva Entrega** | `ADMIN`, `OPERADOR`, `PRODUCTOR` | Formulario con validación de RUT chileno, selección de producto en catálogo y comprobación previa de capacidad libre. |
| `[ ]` | `/deliveries/:id` | **Ficha y Trazabilidad del Lote** | Todos | Línea de tiempo cronológica de transiciones, auditoría de cambios y comprobante de recepción para pesaje. |
| `[ ]` | `/catalog` | **Silos y Capacidad de Almacenaje** | `ADMIN`, `OPERADOR` | Gestión de productos (`POST /api/catalog/products`), monitoreo de capacidad total vs disponible y alertas de sobrecupo. |
| `[ ]` | `/profile` | **Credenciales y Roles Azure AD** | Todos | Inspección de token JWT decodificado, claim `roles`, tenant ID y cierre de sesión. |

---

## 5. The Roadmap & Backlog de Desarrollo

### 5.1 Prioridad Alta (P0 — Núcleo Operativo EP1)
- [x] **Arquitectura y Modelado:** Sincronización con contratos del BFF y entidades JPA (`Delivery`, `Producto`, `DeliveryStatus`).
- [ ] **Dashboard Principal React:** Implementación de métricas de acopio, gráfico de capacidad de silos y tabla dinámica de entregas.
- [ ] **Máquina de Estados Interactiva:** Modal de transición de estado que respete `TRANSICIONES_VALIDAS` y capture el error `409 Conflict` (`InvalidStatusTransitionException`).
- [ ] **Integración MSAL / Azure AD:** Manejo del Bearer token en headers HTTP y despliegue condicional de UI según `roles`.

### 5.2 Prioridad Media (P1 — Flujos de Terreno)
- [ ] **Formulario Rápido de Ingreso de Entrega:** Registro con modal/drawer lateral validando capacidad disponible antes de enviar el POST.
- [ ] **Alerta de Capacidad Crítica:** Banner o tooltip preventivo cuando `capacidadDisponibleKg / capacidadTotalKg < 0.15`.
- [ ] **Búsqueda Dinámica por RUT de Productor:** Filtro en cliente y debounce para operadores de romana/báscula.

### 5.3 Prioridad Baja (P2 — Trazabilidad Avanzada y Auditoría)
- [ ] **Simulador de Eventos Kafka:** Indicador visual de publicación de eventos en el tópico `deliveries.events`.
- [ ] **Exportación de Manifiestos:** Generación de PDF/Excel con el resumen del lote entregado para firma del transportista.
- [ ] **Modo Alto Contraste para Tablets:** Optimización de brillo y botones extra-grandes para operarios con guantes en bodega.

---

## 6. Stitch Creative Freedom & UI Directives

1. **Cumplimiento Estricto de la Máquina de Estados:** La UI nunca debe ofrecer transiciones ilegales como opciones por defecto. Si un lote está en `REGISTRADA`, el botón de acción rápida solo debe desplegar `RECIBIDA` o `RECHAZADA`. La opción `EN_DESPACHO` debe estar inhabilitada o no renderizada.
2. **Alertas de Conflicto Claras:** Cuando el backend retorne `HTTP 409` (ej: intento de salto inválido o `CapacidadInsuficienteException`), el frontend debe presentar un Toast flotante contextual con el mensaje exacto retornado por `GlobalExceptionHandler`.
3. **Indicador de Autenticación Activa:** En el `TopAppBar`, mostrar el nombre del usuario, RUT asociado y una insignia destacada con su rol actual (`ADMIN`, `OPERADOR`, `PRODUCTOR` o `AUDITOR`).
