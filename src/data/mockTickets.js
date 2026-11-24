/**
 * Datos simulados y constantes para el sistema HelpDesk.
 * Diseñado de forma modular para que posteriormente pueda ser sustituido
 * por llamadas a un backend (Axios, Fetch, Context API, etc.).
 */

export const TICKET_STATUSES = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
};

export const TICKET_PRIORITIES = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
};

export const TICKET_CATEGORIES = [
  'Hardware',
  'Software',
  'Redes y Conectividad',
  'Accesos y Seguridad',
  'Correo e Impresoras',
  'Otro',
];

export const INITIAL_TICKETS = [
  {
    id: 'TCK-1001',
    solicitante: 'Carlos Mendoza',
    email: 'carlos.mendoza@empresa.com',
    titulo: 'Fallo al encender laptop corporativa',
    descripcion: 'El equipo de cómputo no enciende tras la actualización del sistema operativo. La luz del cargador parpadea.',
    categoria: 'Hardware',
    prioridad: 'Alta',
    estado: 'En proceso',
    fechaCreacion: '2026-11-20',
  },
  {
    id: 'TCK-1002',
    solicitante: 'Mariana Ríos',
    email: 'mariana.rios@empresa.com',
    titulo: 'Restablecimiento de contraseña ERP',
    descripcion: 'Usuario bloqueado tras 3 intentos fallidos al ingresar al sistema contable ERP.',
    categoria: 'Accesos y Seguridad',
    prioridad: 'Media',
    estado: 'Resuelto',
    fechaCreacion: '2026-11-21',
  },
  {
    id: 'TCK-1003',
    solicitante: 'Alejandro Gómez',
    email: 'alejandro.gomez@empresa.com',
    titulo: 'Sin acceso a internet en el piso 3',
    descripcion: 'Pérdida de conectividad intermitente en todo el departamento de operaciones vía WiFi y cable.',
    categoria: 'Redes y Conectividad',
    prioridad: 'Urgente',
    estado: 'Pendiente',
    fechaCreacion: '2026-11-22',
  },
  {
    id: 'TCK-1004',
    solicitante: 'Valeria Duarte',
    email: 'valeria.duarte@empresa.com',
    titulo: 'Instalación de suite de diseño gráfico',
    descripcion: 'Solicitud de licencia y paquete de software para nuevo integrante del equipo de marketing.',
    categoria: 'Software',
    prioridad: 'Baja',
    estado: 'En proceso',
    fechaCreacion: '2026-11-22',
  },
  {
    id: 'TCK-1005',
    solicitante: 'Fernando Castro',
    email: 'fernando.castro@empresa.com',
    titulo: 'Atasco de papel continuo en impresora central',
    descripcion: 'La impresora multifuncional de planta emite error E-04 y no permite liberar hojas atascadas.',
    categoria: 'Correo e Impresoras',
    prioridad: 'Media',
    estado: 'Pendiente',
    fechaCreacion: '2026-11-23',
  },
  {
    id: 'TCK-1006',
    solicitante: 'Sofía Navarro',
    email: 'sofia.navarro@empresa.com',
    titulo: 'Error crítico en servidor de base de datos de pruebas',
    descripcion: 'El servicio PostgreSQL en el ambiente de QA no responde a las conexiones de la API.',
    categoria: 'Software',
    prioridad: 'Alta',
    estado: 'En proceso',
    fechaCreacion: '2026-11-23',
  },
];

const STORAGE_KEY = 'helpdesk_tickets_db';

/**
 * Utilidad para obtener los tickets persistidos en localStorage
 * o los iniciales si es la primera vez que se carga en el navegador.
 */
export function getStoredTickets() {
  if (typeof window === 'undefined') {
    return INITIAL_TICKETS;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error al leer de localStorage:', e);
    return INITIAL_TICKETS;
  }
}

/**
 * Utilidad para guardar la lista de tickets actualizada en el navegador.
 */
export function saveStoredTickets(tickets) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }
}
