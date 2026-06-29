"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCollection, insertRow } from "@/lib/db";
import { Centro, ZONAS } from "@/lib/types";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionTitle,
  Select,
  Textarea,
} from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";
import { useAuth } from "@/lib/auth";

const vacio = {
  nombre: "",
  direccion: "",
  zona: "",
  contacto_nombre: "",
  contacto_telefono: "",
  capacidad: "",
  notas: "",
};

export default function CentrosPage() {
  const { isAdmin } = useAuth();
  const { data: centros, loading } = useCollection<Centro>("centros");
  const [form, setForm] = useState(vacio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const grupos = useMemo(() => {
    const byZona: Record<string, Centro[]> = {};
    for (const c of centros) {
      const z = c.zona || "Otras ubicaciones";
      (byZona[z] ||= []).push(c);
    }
    const rank = (z: string) => {
      const i = (ZONAS as readonly string[]).indexOf(z);
      if (i !== -1) return i;
      return z === "Otras ubicaciones" ? 999 : 500;
    };
    return Object.keys(byZona)
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
      .map((zona) => ({ zona, items: byZona[zona] }));
  }, [centros]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await insertRow("centros", {
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim() || null,
        zona: form.zona || null,
        contacto_nombre: form.contacto_nombre.trim() || null,
        contacto_telefono: form.contacto_telefono.trim() || null,
        capacidad: form.capacidad.trim() || null,
        notas: form.notas.trim() || null,
      });
      setForm(vacio);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🏢 Centros de acopio</h1>
        <p className="text-slate-500">
          {isAdmin
            ? "Registra los puntos de recolección de tu ciudad."
            : "Acércate a donar y ayudar en cualquiera de estos puntos."}
        </p>
      </div>

      <div
        className={
          isAdmin ? "grid gap-6 lg:grid-cols-[360px_1fr]" : "space-y-6"
        }
      >
        {isAdmin && (
        <Card className="h-fit">
          <SectionTitle>Nuevo centro</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Nombre *">
              <Input
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Ej. Polideportivo Central"
                required
              />
            </Field>
            <Field label="Dirección">
              <Input
                value={form.direccion}
                onChange={set("direccion")}
                placeholder="Calle, número, colonia"
              />
            </Field>
            <Field label="Zona">
              <Select value={form.zona} onChange={set("zona")}>
                <option value="">— Selecciona zona —</option>
                {ZONAS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Contacto">
                <Input
                  value={form.contacto_nombre}
                  onChange={set("contacto_nombre")}
                  placeholder="Nombre"
                />
              </Field>
              <Field label="Teléfono">
                <Input
                  value={form.contacto_telefono}
                  onChange={set("contacto_telefono")}
                  placeholder="Tel."
                  inputMode="tel"
                />
              </Field>
            </div>
            <Field label="Capacidad">
              <Input
                value={form.capacidad}
                onChange={set("capacidad")}
                placeholder="Ej. 200 cajas / 5 ton"
              />
            </Field>
            <Field label="Notas">
              <Textarea
                value={form.notas}
                onChange={set("notas")}
                rows={2}
                placeholder="Horarios, accesos, etc."
              />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Guardando…" : "Registrar centro"}
            </Button>
          </form>
        </Card>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {centros.length} {centros.length === 1 ? "centro" : "centros"}
          </p>
          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : centros.length === 0 ? (
            <EmptyState>Aún no hay centros registrados.</EmptyState>
          ) : (
            <div className="max-h-[72vh] space-y-5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[76vh]">
              {grupos.map((g) => (
                <div key={g.zona} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <h2 className="text-base font-bold text-brand">
                      📍 {g.zona}
                    </h2>
                    <span className="text-xs text-slate-400">
                      ({g.items.length})
                    </span>
                  </div>
                  {g.items.map((c) => (
                    <Card key={c.id}>
                      <h3 className="font-semibold text-slate-800">
                        {c.nombre}
                      </h3>
                      {c.direccion && (
                        <p className="text-sm text-slate-500">
                          📍 {c.direccion}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                        {c.contacto_nombre && (
                          <span>
                            👤 {c.contacto_nombre}
                            {c.contacto_telefono
                              ? ` · ${c.contacto_telefono}`
                              : ""}
                          </span>
                        )}
                        {c.capacidad && <span>📦 {c.capacidad}</span>}
                      </div>
                      {c.notas && (
                        <p className="mt-1 text-sm text-slate-400">{c.notas}</p>
                      )}
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
