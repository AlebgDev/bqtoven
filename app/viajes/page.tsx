"use client";

import { FormEvent, useState } from "react";
import { useCollection, insertRow, deleteRow, updateRow } from "@/lib/db";
import { Camion, Centro, EstadoViaje, Viaje } from "@/lib/types";
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

const estados: EstadoViaje[] = [
  "programado",
  "en_ruta",
  "entregado",
  "cancelado",
];

const vacio = {
  camion_id: "",
  centro_origen_id: "",
  destino: "",
  fecha_salida: "",
  estado: "programado" as EstadoViaje,
  notas: "",
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ViajesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: viajes, loading } = useCollection<Viaje>("viajes");
  const { data: camiones } = useCollection<Camion>("camiones");
  const { data: centros } = useCollection<Centro>("centros");
  const [form, setForm] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof vacio) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const camionPlaca = (id: string | null) =>
    camiones.find((c) => c.id === id)?.placa ?? "Sin asignar";
  const centroNombre = (id: string | null) =>
    centros.find((c) => c.id === id)?.nombre ?? "—";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.destino.trim() || !form.fecha_salida) return;
    setSaving(true);
    setError(null);
    try {
      await insertRow("viajes", {
        camion_id: form.camion_id || null,
        centro_origen_id: form.centro_origen_id || null,
        destino: form.destino.trim(),
        fecha_salida: new Date(form.fecha_salida).toISOString(),
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

  async function cambiarEstado(id: string, estado: EstadoViaje) {
    try {
      await updateRow("viajes", id, { estado });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este viaje?")) return;
    try {
      await deleteRow("viajes", id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const ordenados = [...viajes].sort(
    (a, b) =>
      new Date(a.fecha_salida).getTime() - new Date(b.fecha_salida).getTime()
  );

  if (authLoading)
    return <p className="text-center text-slate-500">Cargando…</p>;
  if (!isAdmin) return <SoloCoordinadores />;

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          🗓️ Viajes y horarios de salida
        </h1>
        <p className="text-slate-500">
          Programa qué camión sale, desde qué centro y hacia dónde.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <SectionTitle>Programar viaje</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Camión">
              <Select value={form.camion_id} onChange={set("camion_id")}>
                <option value="">— Selecciona —</option>
                {camiones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.placa}
                    {c.conductor ? ` (${c.conductor})` : ""}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Centro de origen">
              <Select
                value={form.centro_origen_id}
                onChange={set("centro_origen_id")}
              >
                <option value="">— Selecciona —</option>
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Destino *">
              <Input
                value={form.destino}
                onChange={set("destino")}
                placeholder="Zona / albergue / comunidad"
                required
              />
            </Field>
            <Field label="Fecha y hora de salida *">
              <Input
                type="datetime-local"
                value={form.fecha_salida}
                onChange={set("fecha_salida")}
                required
              />
            </Field>
            <Field label="Estado">
              <Select value={form.estado} onChange={set("estado")}>
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Notas">
              <Textarea
                value={form.notas}
                onChange={set("notas")}
                rows={2}
                placeholder="Carga, ruta, observaciones"
              />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {camiones.length === 0 && centros.length === 0 && (
              <p className="text-sm text-amber-600">
                Tip: registra primero centros y camiones para asignarlos.
              </p>
            )}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Guardando…" : "Programar viaje"}
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {ordenados.length} {ordenados.length === 1 ? "viaje" : "viajes"}
          </p>
          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : ordenados.length === 0 ? (
            <EmptyState>Aún no hay viajes programados.</EmptyState>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[75vh]">
              {ordenados.map((v) => (
                <Card key={v.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-800">
                        🚚 {camionPlaca(v.camion_id)} → {v.destino}
                      </h3>
                      <Badge value={v.estado} />
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-slate-600">
                      🕒 {formatFecha(v.fecha_salida)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Origen: {centroNombre(v.centro_origen_id)}
                    </p>
                    {v.notas && (
                      <p className="mt-1 text-sm text-slate-400">{v.notas}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Select
                      value={v.estado}
                      onChange={(e) =>
                        cambiarEstado(v.id, e.target.value as EstadoViaje)
                      }
                      className="w-auto py-1 text-sm"
                    >
                      {estados.map((e) => (
                        <option key={e} value={e}>
                          {e.replace("_", " ")}
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
