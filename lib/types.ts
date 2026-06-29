export type EstadoCamion = "disponible" | "en_ruta" | "mantenimiento";
export type EstadoViaje = "programado" | "en_ruta" | "entregado" | "cancelado";
export type Prioridad = "critica" | "alta" | "media" | "baja";
export type EstadoArticulo = "necesario" | "recibido";
export type EstadoVoluntario = "disponible" | "asignado" | "inactivo";
export type RolVoluntario =
  | "general"
  | "medico"
  | "conductor"
  | "carga"
  | "cocina"
  | "logistica";

export type Centro = {
  id: string;
  nombre: string;
  direccion: string | null;
  zona: string | null;
  contacto_nombre: string | null;
  contacto_telefono: string | null;
  capacidad: string | null;
  notas: string | null;
  created_at: string;
};

export const ZONAS = [
  "Este",
  "Oeste",
  "Norte",
  "Sur",
  "Centro",
  "Cabudare",
  "Otra",
] as const;

export type Camion = {
  id: string;
  placa: string;
  conductor: string | null;
  telefono_conductor: string | null;
  capacidad_kg: number | null;
  estado: EstadoCamion;
  created_at: string;
};

export type Viaje = {
  id: string;
  camion_id: string | null;
  centro_origen_id: string | null;
  destino: string;
  fecha_salida: string;
  estado: EstadoViaje;
  notas: string | null;
  created_at: string;
};

export type Articulo = {
  id: string;
  centro_id: string | null;
  nombre: string;
  categoria: string | null;
  cantidad: number;
  unidad: string | null;
  prioridad: Prioridad;
  estado: EstadoArticulo;
  created_at: string;
};

export type Voluntario = {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  centro_id: string | null;
  rol: RolVoluntario | null;
  disponibilidad: string | null;
  estado: EstadoVoluntario;
  notas: string | null;
  created_at: string;
};
