import { useState, useContext } from 'react';
import api from '../../services/api.js';
import { TICKET_STATUSES, TICKET_PRIORITIES, getStoredTickets } from '../../data/mockTickets.js';
import { TicketsContext, ACCIONES } from '../../context/TicketsContext.jsx';

export default function DashboardOverview() {

  // Los tickets vienen del contexto global, no de un estado local
  const { estado, dispatch } = useContext(TicketsContext);
  const tickets = estado.tickets;
  const [cargando, setCargando] = useState(false);

  

  // Cálculos estadísticos derivados del estado
  const totalTickets = tickets.length;
  const ticketsPendientes = tickets.filter((t) => t.estado === TICKET_STATUSES.PENDIENTE).length;
  const ticketsEnProceso = tickets.filter((t) => t.estado === TICKET_STATUSES.EN_PROCESO).length;
  const ticketsResueltos = tickets.filter((t) => t.estado === TICKET_STATUSES.RESUELTO).length;
  const ticketsPrioridadAlta = tickets.filter(
    (t) => t.prioridad === TICKET_PRIORITIES.ALTA || t.prioridad === TICKET_PRIORITIES.URGENTE
  ).length;

  // Porcentajes para el resumen visual
  const pctResueltos = totalTickets > 0 ? Math.round((ticketsResueltos / totalTickets) * 100) : 0;
  const pctEnProceso = totalTickets > 0 ? Math.round((ticketsEnProceso / totalTickets) * 100) : 0;
  const pctPendientes = totalTickets > 0 ? Math.round((ticketsPendientes / totalTickets) * 100) : 0;

  // Tickets recientes (últimos 5)
  const ticketsRecientes = [...tickets].slice(0, 5);

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

  const cambiarEstado = (id, nuevoEstado) => {
    dispatch({
      type: ACCIONES.CAMBIAR_ESTADO,
      payload: { id, estado: nuevoEstado },
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tickets</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalTickets}</span>
            <span className="text-xs text-slate-400 font-medium">registrados</span>
          </div>
        </div>

        {/* Tickets Pendientes */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pendientes</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{ticketsPendientes}</span>
            <span className="text-xs text-amber-600 font-medium">por atender</span>
          </div>
        </div>

        {/* Tickets En Proceso */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">En Proceso</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{ticketsEnProceso}</span>
            <span className="text-xs text-blue-600 font-medium">en gestión activa</span>
          </div>
        </div>

        {/* Tickets Resueltos */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Resueltos</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{ticketsResueltos}</span>
            <span className="text-xs text-emerald-600 font-medium">{pctResueltos}% del total</span>
          </div>
        </div>

        {/* Tickets Prioridad Alta / Urgente */}
        <div className="bg-white p-5 rounded-2xl border border-red-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">Alta Prioridad</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-700">{ticketsPrioridadAlta}</span>
            <span className="text-xs text-red-600 font-medium">críticos</span>
          </div>
        </div>
      </div>

      {/* 2. Resumen Visual del Estado de los Tickets */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Resumen Visual de Estados</h3>
            <p className="text-xs text-slate-500">Distribución porcentual de los incidentes en la plataforma</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-600">Resueltos ({pctResueltos}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span className="text-slate-600">En Proceso ({pctEnProceso}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400"></span>
              <span className="text-slate-600">Pendientes ({pctPendientes}%)</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso visual segmentada */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-90"
            style={{ width: `${pctResueltos}%` }}
            title={`Resueltos: ${ticketsResueltos} (${pctResueltos}%)`}
          ></div>
          <div
            className="bg-blue-500 h-full transition-all duration-500 hover:opacity-90"
            style={{ width: `${pctEnProceso}%` }}
            title={`En proceso: ${ticketsEnProceso} (${pctEnProceso}%)`}
          ></div>
          <div
            className="bg-amber-400 h-full transition-all duration-500 hover:opacity-90"
            style={{ width: `${pctPendientes}%` }}
            title={`Pendientes: ${ticketsPendientes} (${pctPendientes}%)`}
          ></div>
        </div>
      </div>

      {/* 3. Tabla de Tickets Recientes */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Tickets Recientes</h3>
            <p className="text-xs text-slate-500">Últimas solicitudes recibidas en la mesa de ayuda</p>
          </div>
          <a
            href="/tickets"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Ver todos los tickets</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Solicitante</th>
                <th className="py-3 px-6">Título e Incidente</th>
                <th className="py-3 px-6">Categoría</th>
                <th className="py-3 px-6">Prioridad</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6 ">Acción</th>
                <th className="py-3 px-6 ">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ticketsRecientes.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-blue-600">
                    {ticket.id}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-900">
                    {ticket.solicitante}
                  </td>
                  <td className="py-3.5 px-6 max-w-xs">
                    <p className="font-semibold text-slate-800 truncate">{ticket.titulo}</p>
                    <p className="text-xs text-slate-400 truncate">{ticket.descripcion}</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {ticket.categoria}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(
                        ticket.prioridad
                      )}`}
                    >
                      {ticket.prioridad}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        ticket.estado
                      )}`}
                    >
                      {ticket.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                    {ticket.fechaCreacion}
                  </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <select
                          value={ticket.estado}
                          onChange={(e) => cambiarEstado(ticket.id, e.target.value)}
                          className="text-xs border border-slate-300 rounded-md px-2 py-1 mr-3 align-middle"
                        >
                          <option value={TICKET_STATUSES.PENDIENTE}>Pendiente</option>
                          <option value={TICKET_STATUSES.EN_PROCESO}>En proceso</option>
                          <option value={TICKET_STATUSES.RESUELTO}>Resuelto</option>
                        </select>
                        </td>
                          <td className="py-3.5 px-6 text-right">
                            <a
                              href={`/tickets/${ticket.id}`}
                              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Detalle
                            </a>
                          </td>
                </tr>
              ))}  
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

