"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCollection, insertRow, deleteRow, updateRow } from "@/lib/db";
import {
  Centro,
  EstadoVoluntario,
  RolVoluntario,
  Voluntario,
} from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionTitle,
  Select,
  Textarea,
  SoloCoordinadores,
} from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";
import { useAuth } from "@/lib/auth";

const roles: { value: RolVoluntario; label: string }[] = [
  { value: "general", label: "General / cualquier tarea" },
  { value: "medico", label: "Médico / enfermería" },
  { value: "conductor", label: "Conductor" },
  { value: "carga", label: "Carga y descarga" },
  { value: "cocina", label: "Cocina / alimentos" },
  { value: "logistica", label: "Logística / inventario" },
];
const rolLabel = (r: RolVoluntario | null) =>
  roles.find((x) => x.value === r)?.label ?? "General";

const estados: EstadoVoluntario[] = ["disponible", "asignado", "inactivo"];

const vacio = {
  nombre: "",
  telefono: "",
  email: "",
  centro_id: "",
  rol: "general" as RolVoluntario,
  disponibilidad: "",
  estado: "disponible" as EstadoVoluntario,
  notas: "",
};

export default function VoluntariosPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: voluntarios, loading } =
    useCollection<Voluntario>("voluntarios");
  const { data: centros } = useCollection<Centro>("centros");
  const [form, setForm] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | EstadoVoluntario>("todos");

  const set =
    (k: keyof typeof vacio) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const centroNombre = (id: string | null) =>
    centros.find((c) => c.id === id)?.nombre ?? "Sin asignar";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await insertRow("voluntarios", {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim() || null,
        email: form.email.trim() || null,
        centro_id: form.centro_id || null,
        rol: form.rol,
        disponibilidad: form.disponibilidad.trim() || null,
        estado: form.estado,
        notas: form.notas.trim() || null,
      });
      setForm(vacio);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function cambiarEstado(id: string, estado: EstadoVoluntario) {
    try {
      await updateRow("voluntarios", id, { estado });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este voluntario del registro?")) return;
    try {
      await deleteRow("voluntarios", id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const visibles = useMemo(
    () =>
      voluntarios.filter((v) => filtro === "todos" || v.estado === filtro),
    [voluntarios, filtro]
  );

  if (authLoading)
    return <p className="text-center text-slate-500">Cargando…</p>;
  if (!isAdmin) return <SoloCoordinadores />;

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🙋 Voluntarios</h1>
        <p className="text-slate-500">
          Registro de personas que quieren ir a ayudar a los centros.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <SectionTitle>Registrar voluntario</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Nombre *">
              <Input
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Nombre y apellido"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Teléfono">
                <Input
                  value={form.telefono}
                  onChange={set("telefono")}
                  placeholder="Tel."
                  inputMode="tel"
                />
              </Field>
              <Field label="Email">
                <Input
                  value={form.email}
                  onChange={set("email")}
                  placeholder="correo@ejemplo.com"
                  type="email"
                />
              </Field>
            </div>
            <Field label="Rol / habilidad">
              <Select value={form.rol} onChange={set("rol")}>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Centro donde quiere ayudar">
              <Select value={form.centro_id} onChange={set("centro_id")}>
                <option value="">Sin asignar / cualquiera</option>
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Disponibilidad">
              <Input
                value={form.disponibilidad}
                onChange={set("disponibilidad")}
                placeholder="Ej. Fines de semana, mañanas…"
              />
            </Field>
            <Field label="Estado">
              <Select value={form.estado} onChange={set("estado")}>
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Notas">
              <Textarea
                value={form.notas}
                onChange={set("notas")}
                rows={2}
                placeholder="Tiene vehículo propio, experiencia previa, etc."
              />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Guardando…" : "Registrar voluntario"}
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["todos", "disponible", "asignado", "inactivo"] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                    filtro === f
                      ? "bg-brand text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>

          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : visibles.length === 0 ? (
            <EmptyState>No hay voluntarios en esta vista.</EmptyState>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[75vh]">
              {visibles.map((v) => (
                <Card key={v.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-800">
                        {v.nombre}
                      </h3>
                      <Badge value={v.estado} />
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        {rolLabel(v.rol)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                      {v.telefono && <span>📞 {v.telefono}</span>}
                      {v.email && <span>✉️ {v.email}</span>}
                      <span>🏢 {centroNombre(v.centro_id)}</span>
                      {v.disponibilidad && <span>🕒 {v.disponibilidad}</span>}
                    </div>
                    {v.notas && (
                      <p className="mt-1 text-sm text-slate-400">{v.notas}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Select
                      value={v.estado}
                      onChange={(e) =>
                        cambiarEstado(
                          v.id,
                          e.target.value as EstadoVoluntario
                        )
                      }
                      className="w-auto py-1 text-sm"
                    >
                      {estados.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </Select>
                    <Button variant="danger" onClick={() => onDelete(v.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
