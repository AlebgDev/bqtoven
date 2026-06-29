"use client";

import { FormEvent, useState } from "react";
import { useCollection, insertRow, deleteRow, updateRow } from "@/lib/db";
import { Camion, EstadoCamion } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionTitle,
  Select,
  SoloCoordinadores,
} from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";
import { useAuth } from "@/lib/auth";

const estados: EstadoCamion[] = ["disponible", "en_ruta", "mantenimiento"];

const vacio = {
  placa: "",
  conductor: "",
  telefono_conductor: "",
  capacidad_kg: "",
  estado: "disponible" as EstadoCamion,
};

export default function CamionesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: camiones, loading } = useCollection<Camion>("camiones");
  const [form, setForm] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof vacio) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.placa.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await insertRow("camiones", {
        placa: form.placa.trim(),
        conductor: form.conductor.trim() || null,
        telefono_conductor: form.telefono_conductor.trim() || null,
        capacidad_kg: form.capacidad_kg ? Number(form.capacidad_kg) : null,
        estado: form.estado,
      });
      setForm(vacio);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function cambiarEstado(id: string, estado: EstadoCamion) {
    try {
      await updateRow("camiones", id, { estado });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este camión?")) return;
    try {
      await deleteRow("camiones", id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (authLoading)
    return <p className="text-center text-slate-500">Cargando…</p>;
  if (!isAdmin) return <SoloCoordinadores />;

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🚚 Camiones</h1>
        <p className="text-slate-500">
          Flota disponible para transportar donativos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <SectionTitle>Nuevo camión</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Placa / identificador *">
              <Input
                value={form.placa}
                onChange={set("placa")}
                placeholder="Ej. ABC-123"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Conductor">
                <Input
                  value={form.conductor}
                  onChange={set("conductor")}
                  placeholder="Nombre"
                />
              </Field>
              <Field label="Teléfono">
                <Input
                  value={form.telefono_conductor}
                  onChange={set("telefono_conductor")}
                  placeholder="Tel."
                  inputMode="tel"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Capacidad (kg)">
                <Input
                  value={form.capacidad_kg}
                  onChange={set("capacidad_kg")}
                  placeholder="Ej. 3000"
                  inputMode="numeric"
                  type="number"
                  min="0"
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
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Guardando…" : "Registrar camión"}
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {camiones.length} {camiones.length === 1 ? "camión" : "camiones"}
          </p>
          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : camiones.length === 0 ? (
            <EmptyState>Aún no hay camiones registrados.</EmptyState>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[75vh]">
              {camiones.map((c) => (
                <Card key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{c.placa}</h3>
                      <Badge value={c.estado} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                      {c.conductor && (
                        <span>
                          👤 {c.conductor}
                          {c.telefono_conductor
                            ? ` · ${c.telefono_conductor}`
                            : ""}
                        </span>
                      )}
                      {c.capacidad_kg != null && (
                        <span>⚖️ {c.capacidad_kg} kg</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Select
                      value={c.estado}
                      onChange={(e) =>
                        cambiarEstado(c.id, e.target.value as EstadoCamion)
                      }
                      className="w-auto py-1 text-sm"
                    >
                      {estados.map((e) => (
                        <option key={e} value={e}>
                          {e.replace("_", " ")}
                        </option>
                      ))}
                    </Select>
                    <Button variant="danger" onClick={() => onDelete(c.id)}>
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
