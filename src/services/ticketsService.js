import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase no está configurado. Define PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.'
    );
  }
}

function mapTicketFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    solicitante: row.solicitante,
    email: row.email || '',
    titulo: row.titulo,
    descripcion: row.descripcion,
    categoria: row.categoria,
    prioridad: row.prioridad,
    estado: row.estado,
    fechaCreacion: row.fecha_creacion,
    createdAt: row.created_at,
  };
}

export async function getTickets() {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener los tickets: ${error.message}`);
  }

  return (data || []).map(mapTicketFromDb);
}

export async function getTicketById(id) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al obtener el ticket ${id}: ${error.message}`);
  }

  return mapTicketFromDb(data);
}

export async function createTicket(ticket) {
  assertSupabaseConfigured();
  const payload = {
    solicitante: ticket.solicitante,
    email: ticket.email || null,
    titulo: ticket.titulo,
    descripcion: ticket.descripcion,
    categoria: ticket.categoria,
    prioridad: ticket.prioridad,
    estado: ticket.estado,
    fecha_creacion: ticket.fechaCreacion,
  };

  const { data, error } = await supabase
    .from('tickets')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear el ticket: ${error.message}`);
  }

  return mapTicketFromDb(data);
}

export async function updateTicketStatus(id, estado) {
  assertSupabaseConfigured();
  const { data, error } = await supabase
    .from('tickets')
    .update({ estado })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar el estado del ticket ${id}: ${error.message}`);
  }

  return mapTicketFromDb(data);
}
