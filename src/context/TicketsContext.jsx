import { createContext, useReducer, useEffect } from 'react';
import { getStoredTickets } from '../data/mockTickets.js';

// Estado inicial del contexto: la lista de tickets arranca vacía
export const estadoInicial = {
  tickets: [],
  cargando: false,
  error: null,
};

// Tipos de acciones que el reducer va a reconocer
export const ACCIONES = {
  CARGAR_INICIO: 'CARGAR_INICIO',
  CARGAR_EXITO: 'CARGAR_EXITO',
  CARGAR_ERROR: 'CARGAR_ERROR',
  AGREGAR_TICKET: 'AGREGAR_TICKET',
  ACTUALIZAR_TICKET: 'ACTUALIZAR_TICKET',
  CAMBIAR_ESTADO: 'CAMBIAR_ESTADO',
};

// El reducer: recibe el estado actual y una acción, y devuelve el estado nuevo
export function ticketsReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.CARGAR_INICIO:
      return { ...estado, cargando: true, error: null };

    case ACCIONES.CARGAR_EXITO:
      return {
        ...estado,
        cargando: false,
        tickets: [...accion.payload].sort(
          (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        ),
      };

    case ACCIONES.CARGAR_ERROR:
      return { ...estado, cargando: false, error: accion.payload };

    case ACCIONES.AGREGAR_TICKET:
            return {
        ...estado,
        tickets: [...estado.tickets, accion.payload].sort(
          (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        ),
      };


    case ACCIONES.ACTUALIZAR_TICKET:
      return {
        ...estado,
        tickets: estado.tickets.map((t) =>
          t.id === accion.payload.id ? { ...t, ...accion.payload } : t
        ),
      };

    case ACCIONES.CAMBIAR_ESTADO:
      return {
        ...estado,
        tickets: estado.tickets.map((t) =>
          t.id === accion.payload.id
            ? { ...t, estado: accion.payload.estado }
            : t
        ),
      };

    default:
      return estado;
  }
}

// El contexto: la caja que se va a compartir con toda la app
export const TicketsContext = createContext();

// El Provider: envuelve la app y reparte el estado y las acciones
export function TicketsProvider({ children }) {
  const [estado, dispatch] = useReducer(ticketsReducer, estadoInicial);

  // Carga inicial: trae los tickets guardados y los mete al estado global
  useEffect(() => {
    dispatch({ type: ACCIONES.CARGAR_INICIO });
    try {
      const guardados = getStoredTickets();
      dispatch({ type: ACCIONES.CARGAR_EXITO, payload: guardados });
    } catch (error) {
      dispatch({ type: ACCIONES.CARGAR_ERROR, payload: error.message });
    }
  }, []);

  // Atajo para cambiar el estado de un ticket desde cualquier vista
  const cambiarEstado = (id, estado) => {
    dispatch({ type: ACCIONES.CAMBIAR_ESTADO, payload: { id, estado } });
  };

  return (
    <TicketsContext.Provider value={{ estado, dispatch, cambiarEstado }}>
      {children}
    </TicketsContext.Provider>
  );
}
