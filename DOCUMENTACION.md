# Documentación Técnica - HelpDesk Application

## 1. Contexto General del Proyecto
**HelpDesk** es una aplicación web moderna diseñada para centralizar la gestión, registro, seguimiento y resolución de solicitudes e incidentes de soporte técnico dentro de una organización. 

El presente desarrollo comprende la estructura fundamental del frontend, el diseño de la interfaz visual estilo SaaS, la navegación multi-página con el enrutador nativo de Astro, componentes interactivos construidos en React y la gestión de estado local mediante React Hooks (`useState` y `useEffect`).

---

## 2. Tecnologías Utilizadas y Justificación

| Tecnología | Rol en la Aplicación | Justificación Técnica |
| :--- | :--- | :--- |
| **Astro (v7+)** | Framework base, layouts y enrutamiento | Proporciona una arquitectura *Content-First* y *Astro Islands*. Genera HTML estático ultraligero y rápido por defecto, eliminando JavaScript innecesario y cargándolo únicamente en los componentes interactivos mediante directivas de hidratación. |
| **React (v19+)** | Componentes interactivos | Permite construir interfaces reactivas, declarativas y componentes modulares enriquecidos con hooks nativos para gestionar la lógica del usuario. |
| **Tailwind CSS (v4+)** | Sistema de diseño y estilos | Proporciona clases utilitarias altamente optimizadas integradas con `@tailwindcss/vite`, permitiendo crear una interfaz SaaS moderna, con paleta cromática profesional, bordes redondeados, sombras sutiles y diseño totalmente responsive sin colisión de estilos. |
| **React Hooks (`useState`, `useEffect`)** | Manejo de estado y ciclo de vida | `useState` controla la reactividad local (filtros de búsqueda, datos de formulario, alertas de éxito y cambios de estado de tickets). `useEffect` controla los efectos secundarios (inicialización de fechas, carga sincronizada de datos de persistencia local). |

---

## 3. Arquitectura y Organización del Proyecto

La estructura del proyecto fue diseñada siguiendo el principio de modularidad y separación de responsabilidades:

```text
helpdesk/
├── astro.config.mjs             # Configuración de Astro, integraciones de React y Tailwind
├── package.json                 # Dependencias y scripts de desarrollo/construcción
├── tsconfig.json                # Configuración de TypeScript y JSX de React
├── public/                      # Recursos estáticos globales (favicons, SVGs)
├── src/
│   ├── components/
│   │   ├── astro/               # Componentes estructurales de Astro (HTML estático)
│   │   │   ├── Navbar.astro     # Barra superior con navegación y acciones rápidas
│   │   │   └── Sidebar.astro    # Menú lateral responsive con control de rutas
│   │   └── react/               # Componentes dinámicos interactivos de React
│   │       ├── CreateTicketForm.jsx # Formulario reactivo de registro de tickets
│   │       ├── DashboardOverview.jsx# Métricas, tabla de recientes y resumen visual
│   │       ├── TicketDetail.jsx     # Vista detallada y cambio de estado del ticket
│   │       ├── TicketList.jsx       # Listado general con búsqueda y filtros
│   │       └── TestComponent.jsx    # Componente de verificación inicial
│   ├── data/
│   │   └── mockTickets.js       # Base de datos simulada y persistencia en localStorage
│   ├── layouts/
│   │   └── MainLayout.astro     # Plantilla maestra con Navbar, Sidebar y viewport
│   ├── pages/                   # Sistema de enrutamiento basado en archivos de Astro
│   │   ├── index.astro          # Ruta "/" (Dashboard Principal)
│   │   └── tickets/
│   │       ├── index.astro      # Ruta "/tickets" (Catálogo y listado de tickets)
│   │       ├── crear.astro      # Ruta "/tickets/crear" (Formulario de creación)
│   │       └── [id].astro       # Ruta "/tickets/[id]" (Detalle dinámico de ticket)
│   └── styles/
│       └── global.css           # Hoja de estilos global (@import "tailwindcss")
```

---

## 4. Conceptos Clave Implementados

### 4.1. Arquitectura de Islas de Astro (Islands Architecture) e Hidratación
En lugar de convertir toda la aplicación en una Single Page Application (SPA) pesada, Astro trata la página web como un documento HTML estático y reserva "islas" aisladas para los componentes interactivos de React.
* **Directiva `client:load`**: Utilizada en `<DashboardOverview client:load />`, `<TicketList client:load />` y `<CreateTicketForm client:load />`. Le indica al navegador que debe descargar e hidratar el código JavaScript de ese componente inmediatamente al cargar la página para que los botones, inputs y hooks comiencen a operar de forma instantánea.

### 4.2. Implementación de `useState`
El hook `useState` es el pilar para la gestión del estado reactivo en los componentes de React:
1. **En el Formulario de Creación (`CreateTicketForm.jsx`):**
   * Controla cada campo del formulario: `solicitante`, `email`, `titulo`, `descripcion`, `categoria`, `prioridad`, `estado` y `fechaCreacion`.
   * Controla la validación de errores en tiempo real (`errores`) y el estado de envío/notificación (`enviando`, `mensajeExito`).
2. **En la Página de Tickets (`TicketList.jsx`):**
   * Controla el término de búsqueda (`busqueda`).
   * Controla los filtros desplegables de estado (`filtroEstado`) y prioridad (`filtroPrioridad`).
   * Realiza el filtrado dinámico instantáneo sin recargar la página.
3. **En el Detalle del Ticket (`TicketDetail.jsx`):**
   * Permite actualizar el estado del ticket (`nuevoEstado`) dinámicamente y reflejarlo de inmediato en la interfaz.

### 4.3. Implementación de `useEffect`
El hook `useEffect` se encarga de manejar efectos secundarios y la sincronización con el entorno de ejecución:
1. **Carga y Sincronización Inicial de Datos:**
   * Al montarse el componente (`[]` como array de dependencias), se obtienen los tickets disponibles en el almacenamiento local simulado (`getStoredTickets()`), asegurando que cualquier ticket creado por el usuario en `/tickets/crear` se refleje inmediatamente en el Dashboard y en la tabla general.
2. **Inicialización de Fechas Automáticas:**
   * En `CreateTicketForm.jsx`, `useEffect` calcula la fecha actual del sistema en formato `YYYY-MM-DD` y la preasigna al campo de fecha del ticket.

### 4.4. Rutas Nativas y Generación Estática en Astro (`getStaticPaths`)
Astro resuelve las páginas a través de la carpeta `src/pages/`:
* `/` -> Carga el Dashboard.
* `/tickets` -> Carga el listado con filtros.
* `/tickets/crear` -> Carga el formulario.
* `/tickets/[id]` -> Ruta dinámica parametrizada. Utiliza `getStaticPaths()` para precompilar de forma estática los identificadores iniciales (`TCK-1001` a `TCK-1006`) y un rango predeterminado para nuevos tickets registrados.

---

## 5. Diseño y Responsividad (Tailwind CSS)
* **Sidebar:** Fijo en pantallas de escritorio (`md:pl-64`), con transición oculta en dispositivos móviles y un botón flotante tipo hamburguesa en el `Navbar` para desplegarlo.
* **Badges Semánticos:**
  * **Estados:**
    * *Pendiente:* Fondo amarillo/ámbar (`bg-amber-100 text-amber-700`).
    * *En proceso:* Fondo azul corporativo (`bg-blue-100 text-blue-700`).
    * *Resuelto:* Fondo esmeralda/verde (`bg-emerald-100 text-emerald-700`).
  * **Prioridades:**
    * *Baja:* Gris neutro (`bg-slate-100 text-slate-700`).
    * *Media:* Azul suave (`bg-blue-100 text-blue-700`).
    * *Alta:* Ámbar (`bg-amber-100 text-amber-800`).
    * *Urgente:* Rojo (`bg-red-100 text-red-700`).
* **Visual Summary Bar:** Barra segmentada de porcentaje que muestra gráficamente la proporción de tickets resueltos, en proceso y pendientes.

---

## 6. Preparación para la Integración Posterior
La arquitectura está estrictamente preparada para que la compañera encargada de los temas avanzados pueda integrarse sin necesidad de refactorizar la UI:
1. **Sustitución de `mockTickets.js` por Axios/Fetch:**
   * Las funciones `getStoredTickets()` y `saveStoredTickets()` pueden ser reemplazadas directamente por llamadas `axios.get('/api/tickets')` y `axios.post('/api/tickets')`.
2. **Integración de Context API y `useReducer`:**
   * Los estados que actualmente se manejan mediante `useState` dentro de cada componente pueden conectarse a un `TicketContext` y procesarse mediante acciones de un `ticketReducer` (`ADD_TICKET`, `UPDATE_STATUS`, `DELETE_TICKET`).

---

## 7. Guía de Ejecución Local

### Comandos de Desarrollo
```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo en modo interactivo
npm run dev

# Compilar para producción (comprobación de tipos y generación estática)
npm run build

# Previsualizar la versión de producción
npm run preview
```

El servidor local se ejecuta típicamente en: `http://localhost:4321`.

---

## 8. Preparación para GitHub
Para subir el proyecto a un repositorio de GitHub:

```bash
# 1. Inicializar git
git init

# 2. Agregar todos los archivos al staging (.gitignore ya excluye node_modules y dist)
git add .

# 3. Realizar el commit inicial
git commit -m "feat: implementacion inicial HelpDesk con Astro, React, Tailwind y Hooks"

# 4. Vincular el repositorio remoto de GitHub (reemplazar con la URL de tu repo)
git remote add origin https://github.com/TU_USUARIO/helpdesk.git

# 5. Establecer la rama main y subir cambios
git branch -M main
git push -u origin main
```

## Integrante 2 — Katy Yulieth Hernández Lambraño

### 1. Implementación de Context API y useContext

Se implementó un contexto global para la gestión de tickets, con el fin de
evitar el paso de props entre componentes y centralizar el estado de la
aplicación.

**Archivos involucrados**

| Archivo | Responsabilidad |
|---|---|
| `src/context/TicketsContext.jsx` | Define `TicketsContext`, el `TicketsProvider` y el hook de acceso al estado |
| `src/components/react/DashboardConProvider.jsx` | Envuelve el dashboard con el Provider |
| `src/components/react/DashboardOverview.jsx` | Consume el contexto mediante `useContext` |
| `src/pages/index.astro` | Monta el componente con `client:load` |

**Flujo de datos**

1. `index.astro` importa `DashboardConProvider` y lo renderiza con `client:load`,
   de modo que el componente se hidrata en el cliente.
2. `DashboardConProvider` envuelve a `DashboardOverview` con `<TicketsProvider>`.
3. `DashboardOverview` obtiene el estado con:
   `const { estado } = useContext(TicketsContext);`
4. Los tickets se leen desde `estado.tickets`, y los cálculos de las tarjetas
   (total, pendientes, en proceso, resueltos, alta prioridad) se derivan de ese
   arreglo.

**Problemas encontrados y solución**

- `ReferenceError: DashboardConProvider is not defined`: el componente se usaba
  en `index.astro` sin haber sido importado. Se creó el archivo
  `DashboardConProvider.jsx` y se agregó su importación.
- `TypeError: Cannot destructure property 'estado' of useContext(...) as it is
  undefined`: el componente se renderizaba sin el Provider por encima, por lo
  que el contexto llegaba como `undefined`. Se corrigió la estructura para que
  `DashboardOverview` siempre quede dentro de `<TicketsProvider>`.
- Ruta de importación incorrecta en `index.astro` (`./context/...` en lugar de
  `../context/...`).

### 2. Actualización de estado desde la interfaz

Se agregó un selector de estado en la columna **Acción** de la tabla de tickets
recientes, que permite modificar el estado de cada solicitud directamente desde
el dashboard.

```jsx
<select
  value={ticket.estado}
  onChange={(e) => cambiarEstado(ticket.id, e.target.value)}
>
  <option value={TICKET_STATUSES.PENDIENTE}>Pendiente</option>
  <option value={TICKET_STATUSES.EN_PROCESO}>En proceso</option>
  <option value={TICKET_STATUSES.RESUELTO}>Resuelto</option>
</select>

```

---

## Integración de Backend con Supabase

### 1. Arquitectura de Conexión
Los componentes interactivos de React se conectan directamente a **Supabase** desde el cliente utilizando `@supabase/supabase-js` y variables de entorno públicas de Astro (`PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`), manteniendo el modo estático de Astro y el acceso libre sin autenticación.

### 2. Archivos Agregados y Modificados

| Archivo | Responsabilidad |
|---|---|
| `supabase/schema.sql` | Script SQL con la secuencia `ticket_id_seq`, la tabla `public.tickets`, políticas RLS de acceso público y los 6 tickets iniciales de prueba. |
| `.env.example` | Plantilla de variables de entorno requeridas para conectar con Supabase. |
| `src/lib/supabase.js` | Inicialización del cliente `supabase` y bandera `isSupabaseConfigured`. |
| `src/services/ticketsService.js` | Capa de acceso a datos (`getTickets`, `getTicketById`, `createTicket`, `updateTicketStatus`) y mapeo `fecha_creacion` ↔ `fechaCreacion`. |
| `src/components/react/DashboardOverview.jsx` | Carga asíncrona de métricas y tickets recientes desde `getTickets()` con manejo de carga y error. |
| `src/components/react/TicketList.jsx` | Carga asíncrona del catálogo de tickets desde `getTickets()` manteniendo los filtros en tiempo real. |
| `src/components/react/CreateTicketForm.jsx` | Registro de nuevos tickets en Supabase mediante `createTicket()`. |
| `src/components/react/TicketDetail.jsx` | Consulta individual con `getTicketById()` y actualización de estado con `updateTicketStatus()`. |
| `src/pages/tickets/[id].astro` | Amplía el rango estático de rutas `TCK-1001` a `TCK-1206` para tickets creados dinámicamente. |

### 3. Esquema de Base de Datos y RLS (`supabase/schema.sql`)
* **Tabla `public.tickets`**:
  * `id` (`text`, PK): generado automáticamente con formato `'TCK-' || nextval('public.ticket_id_seq')::text` iniciando en `1007`.
  * `solicitante`, `email`, `titulo`, `descripcion`, `categoria`, `prioridad`, `estado`, `fecha_creacion`, `created_at`.
  * Restricciones `CHECK` para `prioridad` (`Baja`, `Media`, `Alta`, `Urgente`) y `estado` (`Pendiente`, `En proceso`, `Resuelto`).
* **Row Level Security (RLS)**:
  * Habilitado en `public.tickets` con políticas abiertas (`SELECT`, `INSERT`, `UPDATE`) para los roles `anon` y `authenticated`, permitiendo operar sin inicio de sesión.

### 4. Pasos de Configuración
1. Ejecutar el contenido de `supabase/schema.sql` en el **SQL Editor** del proyecto en Supabase.
2. Copiar `.env.example` a `.env` en la raíz del proyecto y completar con la URL y la Anon Key de Supabase:
   ```env
   PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
3. Iniciar el servidor de desarrollo (`npm run dev`).
