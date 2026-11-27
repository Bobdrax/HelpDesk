import { axiosClient, isAxiosConfigured } from '../lib/axiosClient.js';

function assertAxiosConfigured() {
  if (!isAxiosConfigured) {
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
  assertAxiosConfigured();

  try {
    const { data } = await axiosClient.get('/tickets', {
      params: {
        select: '*',
        order: 'created_at.desc,id.desc',
      },
    });

    return (data || []).map(mapTicketFromDb);
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message;
    throw new Error(`Error al obtener los tickets: ${mensaje}`);
  }
}


export async function getTicketById(id) {
  assertAxiosConfigured();

  try {
    const { data } = await axiosClient.get('/tickets', {
      params: {
        select: '*',
        id: `eq.${id}`,
        limit: 1,
      },
    });

    return mapTicketFromDb(data?.[0] || null);
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message;
    throw new Error(`Error al obtener el ticket ${id}: ${mensaje}`);
  }
}

export async function createTicket(ticket) {
  assertAxiosConfigured();

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

  try {
    const { data } = await axiosClient.post('/tickets', payload, {
      headers: { Prefer: 'return=representation' },
    });

    return mapTicketFromDb(data?.[0] || null);
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message;
    throw new Error(`Error al crear el ticket: ${mensaje}`);
  }
}

export async function updateTicketStatus(id, estado) {
  assertAxiosConfigured();

  try {
    const { data } = await axiosClient.patch(
      '/tickets',
      { estado },
      {
        params: { id: `eq.${id}` },
        headers: { Prefer: 'return=representation' },
      }
    );

    return mapTicketFromDb(data?.[0] || null);
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message;
    throw new Error(`Error al actualizar el estado del ticket ${id}: ${mensaje}`);
  }
}
