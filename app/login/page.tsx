"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button, Card, Field, Input, SectionTitle } from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";

export default function LoginPage() {
  const router = useRouter();
  const { isAdmin, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) router.replace("/");
  }, [isAdmin, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      router.push("/");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <SetupBanner />
      <div className="text-center">
        <p className="text-4xl">🔑</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Acceso de coordinadores
        </h1>
        <p className="text-slate-500">
          Inicia sesión para gestionar la logística. Los donantes no necesitan
          cuenta.
        </p>
      </div>

      <Card>
        <SectionTitle>Iniciar sesión</SectionTitle>
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Correo">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Contraseña">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
