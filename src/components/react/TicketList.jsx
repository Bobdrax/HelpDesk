import React, { useState, useEffect } from 'react';
import { TICKET_STATUSES, TICKET_PRIORITIES } from '../../data/mockTickets.js';
import { getTickets } from '../../services/ticketsService.js';

export default function TicketList() {
  // Estados para gestionar la lista de tickets y los filtros de búsqueda
  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODAS');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para cargar los datos desde Supabase en el montaje del componente
  useEffect(() => {
    let activo = true;
    async function cargarTickets() {
      try {
        setCargando(true);
        setError(null);
        const data = await getTickets();
        if (activo) setTickets(data);
      } catch (err) {
        if (activo) setError(err.message || 'No se pudieron cargar los tickets.');
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargarTickets();
    return () => {
      activo = false;
    };
  }, []);

  // Filtrado reactivo en tiempo real utilizando useState
  const ticketsFiltrados = tickets.filter((ticket) => {
    // 1. Búsqueda por término (nombre de solicitante, título o ID de ticket)
    const termino = busqueda.toLowerCase().trim();
    const coincideBusqueda =
      termino === '' ||
      (ticket.id || '').toLowerCase().includes(termino) ||
      (ticket.solicitante || '').toLowerCase().includes(termino) ||
      (ticket.titulo || '').toLowerCase().includes(termino) ||
      (ticket.descripcion || '').toLowerCase().includes(termino);

    // 2. Filtro por Estado
    const coincideEstado = filtroEstado === 'TODOS' || ticket.estado === filtroEstado;

    // 3. Filtro por Prioridad
    const coincidePrioridad = filtroPrioridad === 'TODAS' || ticket.prioridad === filtroPrioridad;

    return coincideBusqueda && coincideEstado && coincidePrioridad;
  });

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

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('TODOS');
    setFiltroPrioridad('TODAS');
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-sm">
        <p className="font-bold mb-1">Error al cargar tickets desde Supabase</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Campo de Búsqueda por Nombre, Título o Identificador */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ID (ej. TCK-1001), solicitante o título..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros desplegables */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
            {/* Filtro por Estado */}
            <div className="w-full sm:w-auto">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full sm:w-44 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              >
                <option value="TODOS">Todos los Estados</option>
                <option value={TICKET_STATUSES.PENDIENTE}>Pendiente</option>
                <option value={TICKET_STATUSES.EN_PROCESO}>En proceso</option>
                <option value={TICKET_STATUSES.RESUELTO}>Resuelto</option>
              </select>
            </div>

            {/* Filtro por Prioridad */}
            <div className="w-full sm:w-auto">
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="w-full sm:w-44 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              >
                <option value="TODAS">Todas las Prioridades</option>
                <option value={TICKET_PRIORITIES.URGENTE}>Urgente</option>
                <option value={TICKET_PRIORITIES.ALTA}>Alta</option>
                <option value={TICKET_PRIORITIES.MEDIA}>Media</option>
                <option value={TICKET_PRIORITIES.BAJA}>Baja</option>
              </select>
            </div>

            {/* Botón de limpiar filtros */}
            {(busqueda !== '' || filtroEstado !== 'TODOS' || filtroPrioridad !== 'TODAS') && (
              <button
                onClick={limpiarFiltros}
                className="px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Mostrando <strong className="text-slate-800">{ticketsFiltrados.length}</strong> de{' '}
            <strong className="text-slate-800">{tickets.length}</strong> tickets registrados
          </span>
          <a
            href="/tickets/crear"
            className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
          >
            <span>+ Registrar nuevo</span>
          </a>
        </div>
      </div>

      {/* Tabla de Tickets */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {ticketsFiltrados.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">No se encontraron tickets</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              No hay tickets que coincidan con los criterios de búsqueda o filtros seleccionados.
            </p>
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Solicitante</th>
                  <th className="py-3.5 px-6">Asunto y Descripción</th>
                  <th className="py-3.5 px-6">Categoría</th>
                  <th className="py-3.5 px-6">Prioridad</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6">Fecha</th>
                  <th className="py-3.5 px-6 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ticketsFiltrados.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-blue-600 whitespace-nowrap">
                      {ticket.id}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{ticket.solicitante}</div>
                      {ticket.email && <div className="text-xs text-slate-400">{ticket.email}</div>}
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <p className="font-semibold text-slate-800 truncate">{ticket.titulo}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{ticket.descripcion}</p>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {ticket.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(
                          ticket.prioridad
                        )}`}
                      >
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          ticket.estado
                        )}`}
                      >
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      {ticket.fechaCreacion}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <a
                        href={`/tickets/${ticket.id}`}
                        className="inline-flex items-center px-3 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Ver Detalle
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
