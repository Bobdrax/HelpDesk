-- Secuencia para generar identificadores tipo TCK-1007, TCK-1008, ...
create sequence if not exists public.ticket_id_seq start with 1007 increment by 1;

-- Tabla principal de tickets de soporte
create table if not exists public.tickets (
  id text primary key default ('TCK-' || nextval('public.ticket_id_seq')::text),
  solicitante text not null,
  email text,
  titulo text not null,
  descripcion text not null,
  categoria text not null,
  prioridad text not null check (prioridad in ('Baja', 'Media', 'Alta', 'Urgente')),
  estado text not null default 'Pendiente' check (estado in ('Pendiente', 'En proceso', 'Resuelto')),
  fecha_creacion date not null default current_date,
  created_at timestamptz not null default now()
);

-- Habilitar Row Level Security (RLS)
alter table public.tickets enable row level security;

-- Políticas de acceso libre (sin autenticación) para el cliente público (anon)
drop policy if exists "Permitir lectura publica de tickets" on public.tickets;
create policy "Permitir lectura publica de tickets"
  on public.tickets
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Permitir creacion publica de tickets" on public.tickets;
create policy "Permitir creacion publica de tickets"
  on public.tickets
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Permitir actualizacion publica de tickets" on public.tickets;
create policy "Permitir actualizacion publica de tickets"
  on public.tickets
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Datos iniciales de prueba (equivalentes a INITIAL_TICKETS)
insert into public.tickets (id, solicitante, email, titulo, descripcion, categoria, prioridad, estado, fecha_creacion)
values
  ('TCK-1001', 'Carlos Mendoza', 'carlos.mendoza@empresa.com', 'Fallo al encender laptop corporativa', 'El equipo de cómputo no enciende tras la actualización del sistema operativo. La luz del cargador parpadea.', 'Hardware', 'Alta', 'En proceso', '2026-11-20'),
  ('TCK-1002', 'Mariana Ríos', 'mariana.rios@empresa.com', 'Restablecimiento de contraseña ERP', 'Usuario bloqueado tras 3 intentos fallidos al ingresar al sistema contable ERP.', 'Accesos y Seguridad', 'Media', 'Resuelto', '2026-11-21'),
  ('TCK-1003', 'Alejandro Gómez', 'alejandro.gomez@empresa.com', 'Sin acceso a internet en el piso 3', 'Pérdida de conectividad intermitente en todo el departamento de operaciones vía WiFi y cable.', 'Redes y Conectividad', 'Urgente', 'Pendiente', '2026-11-22'),
  ('TCK-1004', 'Valeria Duarte', 'valeria.duarte@empresa.com', 'Instalación de suite de diseño gráfico', 'Solicitud de licencia y paquete de software para nuevo integrante del equipo de marketing.', 'Software', 'Baja', 'En proceso', '2026-11-22'),
  ('TCK-1005', 'Fernando Castro', 'fernando.castro@empresa.com', 'Atasco de papel continuo en impresora central', 'La impresora multifuncional de planta emite error E-04 y no permite liberar hojas atascadas.', 'Correo e Impresoras', 'Media', 'Pendiente', '2026-11-23'),
  ('TCK-1006', 'Sofía Navarro', 'sofia.navarro@empresa.com', 'Error crítico en servidor de base de datos de pruebas', 'El servicio PostgreSQL en el ambiente de QA no responde a las conexiones de la API.', 'Software', 'Alta', 'En proceso', '2026-11-23')
on conflict (id) do nothing;
