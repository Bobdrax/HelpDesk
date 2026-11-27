import React, { useState, useEffect } from 'react';
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
} from '../../data/mockTickets.js';
import { createTicket } from '../../services/ticketsService.js';

export default function CreateTicketForm() {
  // 1. Estados controlados mediante useState para cada campo del formulario
  const [solicitante, setSolicitante] = useState('');
  const [email, setEmail] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(TICKET_CATEGORIES[0]);
  const [prioridad, setPrioridad] = useState(TICKET_PRIORITIES.MEDIA);
  const [estado, setEstado] = useState(TICKET_STATUSES.PENDIENTE);
  const [fechaCreacion, setFechaCreacion] = useState('');

  // Estados de control de interfaz y validaciones
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [errorEnvio, setErrorEnvio] = useState(null);

  // 2. useEffect para inicializar la fecha de creación con la fecha actual del sistema
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    setFechaCreacion(hoy);
  }, []);

  // Validación básica de campos requeridos
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!solicitante.trim()) {
      nuevosErrores.solicitante = 'El nombre del solicitante es obligatorio.';
    } else if (solicitante.trim().length < 3) {
      nuevosErrores.solicitante = 'El nombre debe contener al menos 3 caracteres.';
    }

    if (!titulo.trim()) {
      nuevosErrores.titulo = 'El título del incidente es obligatorio.';
    } else if (titulo.trim().length < 5) {
      nuevosErrores.titulo = 'El título debe tener al menos 5 caracteres descriptivos.';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción detallada del problema es obligatoria.';
    } else if (descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'Por favor provee una descripción de al menos 10 caracteres.';
    }

    if (!fechaCreacion) {
      nuevosErrores.fechaCreacion = 'La fecha de creación es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const nuevoTicket = await createTicket({
        solicitante: solicitante.trim(),
        email: email.trim() || `${solicitante.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        prioridad,
        estado,
        fechaCreacion,
      });

      setMensajeExito(`¡Ticket ${nuevoTicket.id} registrado correctamente!`);

      // Limpiar formulario excepto fecha
      setSolicitante('');
      setEmail('');
      setTitulo('');
      setDescripcion('');
      setCategoria(TICKET_CATEGORIES[0]);
      setPrioridad(TICKET_PRIORITIES.MEDIA);
      setEstado(TICKET_STATUSES.PENDIENTE);
      setErrores({});
    } catch (err) {
      setErrorEnvio(err.message || 'No se pudo registrar el ticket en Supabase.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Alerta de error al enviar */}
      {errorEnvio && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <p className="font-bold mb-1">No se pudo guardar el ticket</p>
          <p>{errorEnvio}</p>
        </div>
      )}

      {/* Alerta de confirmación de éxito */}
      {mensajeExito && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-800">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">{mensajeExito}</p>
              <p className="text-xs text-emerald-700">El ticket ya se encuentra disponible en la lista y en el Dashboard.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/tickets"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Ver Tickets
            </a>
            <button
              onClick={() => setMensajeExito(null)}
              className="text-emerald-500 hover:text-emerald-700 p-1"
              aria-label="Cerrar notificación"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tarjeta del Formulario */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Registrar Nuevo Incidente de Soporte</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Diligencia todos los campos para clasificar y asignar la solicitud al equipo de HelpDesk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Fila 1: Solicitante y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="solicitante" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nombre del Solicitante <span className="text-red-500">*</span>
              </label>
              <input
                id="solicitante"
                type="text"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                placeholder="Ej. Laura Restrepo"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errores.solicitante
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errores.solicitante && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <span>⚠</span> {errores.solicitante}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correo Electrónico (Opcional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="laura.restrepo@empresa.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Fila 2: Título del Ticket */}
          <div>
            <label htmlFor="titulo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Título del Incidente <span className="text-red-500">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Problema de autenticación con VPN corporativa"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                errores.titulo
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            {errores.titulo && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <span>⚠</span> {errores.titulo}
              </p>
            )}
          </div>

          {/* Fila 3: Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descripción del Problema <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe detalladamente qué sucedió, mensajes de error y pasos para reproducir..."
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                errores.descripcion
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            ></textarea>
            {errores.descripcion && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <span>⚠</span> {errores.descripcion}
              </p>
            )}
          </div>

          {/* Fila 4: Categoría, Prioridad, Estado y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Categoría
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {TICKET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label htmlFor="prioridad" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Prioridad
              </label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={TICKET_PRIORITIES.BAJA}>Baja</option>
                <option value={TICKET_PRIORITIES.MEDIA}>Media</option>
                <option value={TICKET_PRIORITIES.ALTA}>Alta</option>
                <option value={TICKET_PRIORITIES.URGENTE}>Urgente</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Estado
              </label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={TICKET_STATUSES.PENDIENTE}>Pendiente</option>
                <option value={TICKET_STATUSES.EN_PROCESO}>En proceso</option>
                <option value={TICKET_STATUSES.RESUELTO}>Resuelto</option>
              </select>
            </div>

            {/* Fecha de Creación */}
            <div>
              <label htmlFor="fechaCreacion" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fecha de Creación <span className="text-red-500">*</span>
              </label>
              <input
                id="fechaCreacion"
                type="date"
                value={fechaCreacion}
                onChange={(e) => setFechaCreacion(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <a
              href="/tickets"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors text-center"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={enviando}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>{enviando ? 'Guardando...' : 'Crear Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
