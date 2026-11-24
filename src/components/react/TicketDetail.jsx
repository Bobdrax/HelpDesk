import React, { useState, useEffect } from 'react';
import { getStoredTickets, saveStoredTickets, TICKET_STATUSES } from '../../data/mockTickets.js';

export default function TicketDetail({ ticketId }) {
  const [ticket, setTicket] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [notificacion, setNotificacion] = useState(null);

  // useEffect para buscar el ticket en la persistencia local o datos base
  useEffect(() => {
    const todos = getStoredTickets();
    const encontrado = todos.find((t) => t.id === ticketId);
    if (encontrado) {
      setTicket(encontrado);
      setNuevoEstado(encontrado.estado);
    }
    setCargando(false);
  }, [ticketId]);

  const handleCambiarEstado = (e) => {
    const estadoActualizado = e.target.value;
    setNuevoEstado(estadoActualizado);

    const todos = getStoredTickets();
    const listaActualizada = todos.map((t) =>
      t.id === ticketId ? { ...t, estado: estadoActualizado } : t
    );
    saveStoredTickets(listaActualizada);
    setTicket((prev) => ({ ...prev, estado: estadoActualizado }));
    setNotificacion(`Estado actualizado a "${estadoActualizado}"`);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const getPriorityBadge = (prioridad) => {
    switch (prioridad) {
      case 'Urgente':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Alta':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Media':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Baja':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Resuelto':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'En proceso':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pendiente':
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Ticket no encontrado</h3>
        <p className="text-sm text-slate-500 mb-6">
          El ticket con identificador <code className="font-mono font-bold text-slate-700">{ticketId}</code> no existe o fue eliminado.
        </p>
        <a
          href="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          Volver a la lista de tickets
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón Volver y Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <a
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al listado</span>
        </a>

        {notificacion && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-fadeIn">
            ✓ {notificacion}
          </span>
        )}
      </div>

      {/* Tarjeta Principal de Detalle */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Cabecera del Ticket */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                {ticket.id}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(
                  ticket.prioridad
                )}`}
              >
                Prioridad {ticket.prioridad}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                  ticket.estado
                )}`}
              >
                {ticket.estado}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{ticket.titulo}</h2>
          </div>

          {/* Selector interactivo para cambiar estado mediante useState */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
            <label htmlFor="cambiar-estado" className="text-xs font-bold text-slate-500 pl-2">
              Estado:
            </label>
            <select
              id="cambiar-estado"
              value={nuevoEstado}
              onChange={handleCambiarEstado}
              className="text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value={TICKET_STATUSES.PENDIENTE}>Pendiente</option>
              <option value={TICKET_STATUSES.EN_PROCESO}>En proceso</option>
              <option value={TICKET_STATUSES.RESUELTO}>Resuelto</option>
            </select>
          </div>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadatos en Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Solicitante</p>
              <p className="font-semibold text-slate-900">{ticket.solicitante}</p>
              <p className="text-xs text-slate-500">{ticket.email || 'No registrado'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Categoría</p>
              <p className="font-semibold text-slate-900">{ticket.categoria}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Fecha Registro</p>
              <p className="font-semibold text-slate-900">{ticket.fechaCreacion}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Canal de Ingreso</p>
              <p className="font-semibold text-slate-900">Portal Web HelpDesk</p>
            </div>
          </div>

          {/* Descripción del Incidente */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Descripción Completa del Incidente
            </h4>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-line shadow-xs">
              {ticket.descripcion}
            </div>
          </div>

          {/* Historial o Notas Simuladas */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Historial y Seguimiento Técnico
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  HD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Sistema HelpDesk</span>
                    <span className="text-[11px] text-slate-400">{ticket.fechaCreacion}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Ticket generado automáticamente con estado inicial "{ticket.estado}". Notificación enviada al solicitante.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
