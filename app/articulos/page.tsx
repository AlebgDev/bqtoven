"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCollection, insertRow, deleteRow } from "@/lib/db";
import { Articulo, Centro, EstadoArticulo, Prioridad } from "@/lib/types";
import { CATALOGO_BASICO } from "@/lib/catalogo";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionTitle,
  Select,
} from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";
import { useAuth } from "@/lib/auth";

const prioridades: Prioridad[] = ["critica", "alta", "media", "baja"];

const vacio = {
  nombre: "",
  categoria: "",
  cantidad: "1",
  unidad: "",
  prioridad: "media" as Prioridad,
  centro_id: "",
};

export default function ArticulosPage() {
  const { isAdmin } = useAuth();
  const { data: articulos, loading } = useCollection<Articulo>("articulos");
  const { data: centros } = useCollection<Centro>("centros");
  const [form, setForm] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | Prioridad>("todos");

  const set =
    (k: keyof typeof vacio) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const centroNombre = (id: string | null) =>
    centros.find((c) => c.id === id)?.nombre ?? "General";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await insertRow("articulos", {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim() || null,
        cantidad: form.cantidad ? Number(form.cantidad) : 1,
        unidad: form.unidad.trim() || null,
        prioridad: form.prioridad,
        centro_id: form.centro_id || null,
        estado: "necesario",
      });
      setForm({ ...vacio, centro_id: form.centro_id });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function cargarBasica() {
    const existentes = new Set(
      articulos.map((a) => a.nombre.trim().toLowerCase())
    );
    const nuevos = CATALOGO_BASICO.filter(
      (it) => !existentes.has(it.nombre.toLowerCase())
    ).map((it) => ({
      nombre: it.nombre,
      categoria: it.categoria,
      cantidad: 1,
      unidad: it.unidad,
      prioridad: it.prioridad,
      centro_id: form.centro_id || null,
      estado: "necesario" as EstadoArticulo,
    }));

    if (nuevos.length === 0) {
      alert("Ya tienes todos los artículos de la lista básica. 👍");
      return;
    }
    if (
      !confirm(
        `Se agregarán ${nuevos.length} artículos de primera necesidad${
          form.centro_id
            ? " al centro seleccionado"
            : " (sin centro asignado)"
        }. ¿Continuar?`
      )
    )
      return;

    setSeeding(true);
    setError(null);
    try {
      await insertRow("articulos", nuevos);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSeeding(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este artículo?")) return;
    try {
      await deleteRow("articulos", id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const visibles = useMemo(() => {
    const rank: Record<Prioridad, number> = {
      critica: 0,
      alta: 1,
      media: 2,
      baja: 3,
    };
    return [...articulos]
      .filter((a) => filtro === "todos" || a.prioridad === filtro)
      .sort((a, b) => rank[a.prioridad] - rank[b.prioridad]);
  }, [articulos, filtro]);

  const conteo = (p: "todos" | Prioridad) =>
    p === "todos"
      ? articulos.length
      : articulos.filter((a) => a.prioridad === p).length;

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          📦 Artículos necesarios
        </h1>
        <p className="text-slate-500">
          {isAdmin
            ? "Lista global de donativos requeridos, ordenada por prioridad."
            : "Esto es lo que más se necesita ahora. ¡Tu donación cuenta!"}
        </p>
      </div>

      <div
        className={
          isAdmin ? "grid gap-6 lg:grid-cols-[360px_1fr]" : "space-y-6"
        }
      >
        {isAdmin && (
        <Card className="h-fit">
          <SectionTitle>Añadir artículo</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Artículo *">
              <Input
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Ej. Agua embotellada"
                required
              />
            </Field>
            <Field label="Categoría">
              <Input
                value={form.categoria}
                onChange={set("categoria")}
                placeholder="Alimentos, higiene, medicina…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cantidad">
                <Input
                  type="number"
                  min="0"
                  value={form.cantidad}
                  onChange={set("cantidad")}
                  inputMode="numeric"
                />
              </Field>
              <Field label="Unidad">
                <Input
                  value={form.unidad}
                  onChange={set("unidad")}
                  placeholder="cajas, litros…"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prioridad">
                <Select value={form.prioridad} onChange={set("prioridad")}>
                  {prioridades.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Centro">
                <Select value={form.centro_id} onChange={set("centro_id")}>
                  <option value="">General</option>
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Guardando…" : "Añadir artículo"}
            </Button>
          </form>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-sm text-slate-500">
              ¿Empezando de cero? Carga la lista de artículos de primera
              necesidad (medicamentos, primeros auxilios, alimentos no
              perecederos, higiene…). Se agregan{" "}
              {form.centro_id ? "al centro seleccionado arriba" : "sin centro"}.
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={cargarBasica}
              disabled={seeding}
              className="w-full"
            >
              {seeding ? "Cargando…" : "📋 Cargar lista básica"}
            </Button>
          </div>
        </Card>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["todos", "critica", "alta", "media", "baja"] as const).map(
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
                  {f === "critica" ? "crítica" : f}{" "}
                  <span
                    className={
                      filtro === f ? "text-white/80" : "text-slate-400"
                    }
                  >
                    ({conteo(f)})
                  </span>
                </button>
              )
            )}
          </div>

          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : visibles.length === 0 ? (
            <EmptyState>
              {articulos.length === 0
                ? "No hay artículos todavía. Usa el formulario o “Cargar lista básica”."
                : "No hay artículos con esta prioridad."}
            </EmptyState>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[75vh]">
              {visibles.map((a) => (
                <Card key={a.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {a.nombre}
                        </h3>
                        <Badge value={a.prioridad} />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                        <span>
                          🔢 {a.cantidad} {a.unidad ?? "u."}
                        </span>
                        {a.categoria && <span>🏷️ {a.categoria}</span>}
                        <span>🏢 {centroNombre(a.centro_id)}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button variant="danger" onClick={() => onDelete(a.id)}>
                        Eliminar
                      </Button>
                    )}
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
