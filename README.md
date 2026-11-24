# HelpDesk - Sistema de Gestión de Solicitudes e Incidentes

HelpDesk es una plataforma web desarrollada con **Astro**, **Tailwind CSS** y **ReactJS** para la gestión, registro y seguimiento centralizado de tickets e incidentes técnicos.

## 🚀 Tecnologías Principales
* **Astro**: Framework principal, layouts y enrutamiento nativo por páginas.
* **Tailwind CSS**: Estilos modernos utilitarios y diseño SaaS responsive.
* **ReactJS**: Componentes interactivos con hidratación en cliente.
* **React Hooks**: `useState` para gestión del estado y `useEffect` para sincronización.

## 📁 Estructura del Proyecto
* `src/components/astro/`: Componentes estructurales estáticos (Sidebar, Navbar).
* `src/components/react/`: Componentes interactivos (Dashboard, TicketList, CreateTicketForm, TicketDetail).
* `src/data/`: Datos simulados modulares y persistencia en cliente (`mockTickets.js`).
* `src/layouts/`: Plantilla principal (`MainLayout.astro`).
* `src/pages/`: Rutas del sistema (`/`, `/tickets`, `/tickets/crear`, `/tickets/[id]`).

## 🛠️ Comandos Rápidos
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación
npm run preview
```

## 📖 Documentación Completa
Para una explicación exhaustiva de los conceptos, arquitectura, implementación de hooks e instrucciones de despliegue a GitHub, consulta el archivo:
👉 [DOCUMENTACION.md](./DOCUMENTACION.md)
