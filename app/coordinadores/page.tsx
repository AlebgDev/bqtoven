"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionTitle,
  SoloCoordinadores,
} from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";

type Coordinador = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  isOwner: boolean;
};

function generarPassword() {
  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint32Array(10);
  crypto.getRandomValues(arr);
  return "Coord-" + Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export default function CoordinadoresPage() {
  const { isOwner, loading: authLoading, session } = useAuth();
  const token = session?.access_token;

  const [lista, setLista] = useState<Coordinador[]>([]);
  const [cargando, setCargando] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!token) return;
    setCargando(true);
    try {
      const res = await fetch("/api/coordinadores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar");
      setLista(data.coordinadores);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOwner && token) cargar();
  }, [isOwner, token, cargar]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/coordinadores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear");
      setOk(
        `✓ Coordinador creado: ${email} · contraseña: ${password} (cópiala y compártela ahora)`
      );
      setEmail("");
      setPassword("");
      cargar();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function eliminar(id: string, correo: string) {
    if (!confirm(`¿Eliminar el acceso de ${correo}?`)) return;
    try {
      const res = await fetch("/api/coordinadores", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      cargar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (authLoading)
    return <p className="text-center text-slate-500">Cargando…</p>;
  if (!isOwner) return <SoloCoordinadores />;

  return (
    <div className="space-y-6">
      <SetupBanner />
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          👑 Coordinadores
        </h1>
        <p className="text-slate-500">
          Da de alta a las personas que podrán gestionar la logística.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <SectionTitle>Nuevo coordinador</SectionTitle>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Correo *">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinador@ejemplo.com"
                required
              />
            </Field>
            <Field label="Contraseña * (mín. 8)">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
              />
            </Field>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setPassword(generarPassword())}
            >
              🎲 Generar contraseña
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {ok && (
              <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">
                {ok}
              </p>
            )}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Creando…" : "Crear coordinador"}
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {lista.length}{" "}
            {lista.length === 1 ? "coordinador" : "coordinadores"}
          </p>
          {cargando ? (
            <EmptyState>Cargando…</EmptyState>
          ) : lista.length === 0 ? (
            <EmptyState>Aún no hay coordinadores.</EmptyState>
          ) : (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:max-h-[75vh]">
              {lista.map((c) => (
                <Card key={c.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-800">
                          {c.email}
                        </h3>
                        {c.isOwner && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                            owner
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {c.last_sign_in_at
                          ? `Último acceso: ${new Date(
                              c.last_sign_in_at
                            ).toLocaleString("es")}`
                          : "Nunca ha iniciado sesión"}
                      </p>
                    </div>
                    {!c.isOwner && (
                      <Button
                        variant="danger"
                        onClick={() => eliminar(c.id, c.email)}
                      >
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
