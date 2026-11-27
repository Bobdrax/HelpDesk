# HelpDesk - Sistema de Gestión de Solicitudes e Incidentes

HelpDesk es una plataforma web desarrollada con **Astro**, **Tailwind CSS** y **ReactJS** para la gestión, registro y seguimiento centralizado de tickets e incidentes técnicos.

## Tecnologías Principales
* **Astro**: Framework principal, layouts y enrutamiento nativo por páginas.
* **Tailwind CSS**: Estilos modernos utilitarios y diseño SaaS responsive.
* **ReactJS**: Componentes interactivos con hidratación en cliente.
* **React Hooks**: `useReducer` para la gestión centralizada del estado, `useContext` para el consumo del contexto global y `useEffect` para sincronización.

## Estado del Proyecto

## Checklist del proyecto

- [x] Estructura base del proyecto con Astro
- [x] Componentes estructurales (Sidebar y Navbar)
- [x] Componentes interactivos en React
- [x] Estado global con Context API y useReducer
- [x] Hook personalizado para consumir el contexto
- [x] Listado de tickets con búsqueda y filtros
- [x] Formulario de creación de tickets
- [x] Vista de detalle y cambio de estado
- [x] Rutas y navegación con Astro
- [x] Capa de servicios HTTP preparada con Axios
- [x] Persistencia local de datos simulados
- [x] Integración con el back-end (Supabase)
- [ ] Despliegue en producción


## Estructura del Proyecto

```
src/
├── components/
│   ├── astro/                  # Componentes estructurales estáticos
│   │   ├── Sidebar.astro
│   │   └── Navbar.astro
│   └── react/                  # Componentes interactivos
│       ├── DashboardConProvider.jsx   # Envuelve el dashboard con el Provider
│       ├── DashboardOverview.jsx      # Dashboard; consume el contexto
│       ├── TicketList.jsx             # Listado con búsqueda y filtros
│       ├── CreateTicketForm.jsx       # Formulario de creación
│       └── TicketDetail.jsx           # Detalle y cambio de estado
├── context/
│   └── TicketsContext.jsx      # Contexto global de tickets y reducer
├── data/
│   └── mockTickets.js          # Datos simulados y persistencia en cliente
├── lib/
│   └── axiosClient.js          # Instancia de Axios con baseURL y timeouts
├── layouts/
│   └── MainLayout.astro        # Plantilla principal
├── pages/                      # Rutas del sistema
│   ├── index.astro             # Dashboard principal
│   └── tickets/
│       ├── index.astro         # Listado de tickets
│       ├── crear.astro         # Formulario de creación
│       └── [id].astro          # Detalle del ticket
└── services/
    └── ticketsService.js       # Capa de acceso a datos (Axios)

```

## Arquitectura del Estado

El estado global de los tickets vive en `TicketsContext.jsx` y se gestiona con `useReducer`. El flujo es el siguiente:

1. `index.astro` renderiza `DashboardConProvider` con `client:load`.
2. `DashboardConProvider` envuelve a `DashboardOverview` con `<TicketsProvider>`.
3. `DashboardOverview` consume el contexto con `useContext` y lee `estado.tickets`.
4. Las acciones se despachan con `dispatch` y el reducer devuelve un estado nuevo.

### Acciones del reducer

| Acción | Efecto |
|---|---|
| `CARGAR_INICIO` | Marca `cargando: true` y limpia el error |
| `CARGAR_EXITO` | Guarda la lista de tickets recibida |
| `CARGAR_ERROR` | Guarda el mensaje de error y detiene la carga |
| `AGREGAR_TICKET` | Añade un ticket nuevo al arreglo |
| `ACTUALIZAR_TICKET` | Reemplaza los campos de un ticket por su `id` |
| `CAMBIAR_ESTADO` | Modifica únicamente el campo `estado` de un ticket |

## Comandos Rápidos
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación
npm run preview
```

## Documentación Completa
Para una explicación exhaustiva de los conceptos, arquitectura, implementación de hooks e instrucciones de despliegue a GitHub, consulta el archivo:
[DOCUMENTACION.md](./DOCUMENTACION.md)
