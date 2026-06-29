-- ============================================================
--  Esquema para "Centros de Acopio" — Gestión de emergencia
--  Ejecútalo en: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1) Centros de acopio de la ciudad
create table if not exists centros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text,
  zona text,                       -- Este | Oeste | Norte | Sur | Centro | Cabudare | Otra
  contacto_nombre text,
  contacto_telefono text,
  capacidad text,
  notas text,
  created_at timestamptz default now()
);

-- 2) Camiones que transportan los donativos
create table if not exists camiones (
  id uuid primary key default gen_random_uuid(),
  placa text not null,
  conductor text,
  telefono_conductor text,
  capacidad_kg numeric,
  estado text not null default 'disponible', -- disponible | en_ruta | mantenimiento
  created_at timestamptz default now()
);

-- 3) Viajes / horarios de salida de los camiones
create table if not exists viajes (
  id uuid primary key default gen_random_uuid(),
  camion_id uuid references camiones(id) on delete set null,
  centro_origen_id uuid references centros(id) on delete set null,
  destino text not null,
  fecha_salida timestamptz not null,
  estado text not null default 'programado', -- programado | en_ruta | entregado | cancelado
  notas text,
  created_at timestamptz default now()
);

-- 4) Artículos necesarios para donar / inventario por centro
create table if not exists articulos (
  id uuid primary key default gen_random_uuid(),
  centro_id uuid references centros(id) on delete set null,
  nombre text not null,
  categoria text,
  cantidad numeric not null default 1,
  unidad text,
  prioridad text not null default 'media', -- alta | media | baja
  estado text not null default 'necesario', -- necesario | recibido
  created_at timestamptz default now()
);

-- 5) Voluntarios que quieren ir a ayudar a los centros
create table if not exists voluntarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  email text,
  centro_id uuid references centros(id) on delete set null,
  rol text,                                   -- médico | conductor | carga | cocina | logística | general
  disponibilidad text,
  estado text not null default 'disponible',  -- disponible | asignado | inactivo
  notas text,
  created_at timestamptz default now()
);

-- ============================================================
--  Seguridad: vista pública (solo lectura) + panel de coordinadores
--  - centros y articulos: lectura PÚBLICA (anon), escritura solo auth.
--  - camiones, viajes, voluntarios: TODO solo coordinadores autenticados
--    (contienen datos sensibles: teléfonos, emails).
--  Los coordinadores se autentican con Supabase Auth (email/contraseña).
-- ============================================================
alter table centros     enable row level security;
alter table camiones    enable row level security;
alter table viajes      enable row level security;
alter table articulos   enable row level security;
alter table voluntarios enable row level security;

drop policy if exists "centros_select_public"   on centros;
drop policy if exists "centros_write_auth"      on centros;
drop policy if exists "articulos_select_public" on articulos;
drop policy if exists "articulos_write_auth"    on articulos;
drop policy if exists "camiones_all_auth"       on camiones;
drop policy if exists "viajes_all_auth"         on viajes;
drop policy if exists "voluntarios_all_auth"    on voluntarios;

-- Lectura pública + escritura autenticada
create policy "centros_select_public" on centros for select using (true);
create policy "centros_write_auth"    on centros for all to authenticated using (true) with check (true);

create policy "articulos_select_public" on articulos for select using (true);
create policy "articulos_write_auth"    on articulos for all to authenticated using (true) with check (true);

-- Solo coordinadores autenticados (lectura y escritura)
create policy "camiones_all_auth"    on camiones    for all to authenticated using (true) with check (true);
create policy "viajes_all_auth"      on viajes      for all to authenticated using (true) with check (true);
create policy "voluntarios_all_auth" on voluntarios for all to authenticated using (true) with check (true);

-- ============================================================
--  Realtime: para que los cambios se reflejen al instante
--  en todos los dispositivos conectados.
-- ============================================================
alter publication supabase_realtime add table centros;
alter publication supabase_realtime add table camiones;
alter publication supabase_realtime add table viajes;
alter publication supabase_realtime add table articulos;
alter publication supabase_realtime add table voluntarios;
