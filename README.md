# HelpDesk - Sistema de Gestión de Solicitudes e Incidentes

HelpDesk es una plataforma web desarrollada con **Astro**, **Tailwind CSS** y **ReactJS** para la gestión, registro y seguimiento centralizado de tickets e incidentes técnicos.

##  Tecnologías Principales
* **Astro**: Framework principal, layouts y enrutamiento nativo por páginas.
* **Tailwind CSS**: Estilos modernos utilitarios y diseño SaaS responsive.
* **ReactJS**: Componentes interactivos con hidratación en cliente.
* **React Hooks**: `useState` para gestión del estado y `useEffect` para sincronización.

## Estructura del Proyecto
* `src/components/astro/`: Componentes estructurales estáticos (Sidebar, Navbar).
* `src/components/react/`: Componentes interactivos (Dashboard, TicketList, CreateTicketForm, TicketDetail).
* `src/data/`: Datos simulados modulares y persistencia en cliente (`mockTickets.js`).
* `src/layouts/`: Plantilla principal (`MainLayout.astro`).
* `src/pages/`: Rutas del sistema (`/`, `/tickets`, `/tickets/crear`, `/tickets/[id]`).

##  Comandos Rápidos
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación
npm run preview
```



```markdown
## Estado del proyecto

### Funcionalidades implementadas

- [x] Context API global para la gestión de tickets (`TicketsContext`)
- [x] Consumo del contexto con `useContext` en el dashboard
- [x] Provider montado a nivel de página con hidratación en cliente (`client:load`)
- [x] Cálculo de métricas derivadas del estado global (totales, porcentajes,
      prioridades)
- [x] Actualización del estado de un ticket desde la tabla del dashboard
- [ ] Gestión del estado con `useReducer`
- [ ] Servicios HTTP con Axios
- [ ] Creación de nuevos tickets
- [ ] Integración con el back-end
- [ ] Despliegue

## Estructura del proyecto

```
src/
├── components/
│   └── react/
│       ├── DashboardConProvider.jsx   # Envuelve el dashboard con el Provider
│       └── DashboardOverview.jsx      # Dashboard; consume el contexto
├── context/
│   └── TicketsContext.jsx             # Contexto global de tickets y reducer
├── data/
│   └── mockTickets.js                 # Datos simulados y constantes
├── services/
│   └── api.js                         # Servicios de comunicación (Axios)
└── pages/
    └── index.astro                    # Punto de entrada
```



##  Documentación Completa
Para una explicación exhaustiva de los conceptos, arquitectura, implementación de hooks e instrucciones de despliegue a GitHub, consulta el archivo:
 [DOCUMENTACION.md](./DOCUMENTACION.md)
