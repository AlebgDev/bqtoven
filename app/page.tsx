"use client";

import Link from "next/link";
import { useCollection } from "@/lib/db";
import { Articulo, Camion, Centro, Viaje, Voluntario } from "@/lib/types";
import { Badge, Card, EmptyState, SectionTitle, StatCard } from "@/components/ui";
import SetupBanner from "@/components/SetupBanner";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { data: centros } = useCollection<Centro>("centros");
  const { data: camiones } = useCollection<Camion>("camiones");
  const { data: viajes } = useCollection<Viaje>("viajes");
  const { data: articulos } = useCollection<Articulo>("articulos");
  const { data: voluntarios } = useCollection<Voluntario>("voluntarios");

  const camionesDisponibles = camiones.filter(
    (c) => c.estado === "disponible"
  ).length;
  const viajesProgramados = viajes.filter(
    (v) => v.estado === "programado" || v.estado === "en_ruta"
  );
  const criticos = articulos.filter((a) => a.prioridad === "critica");

  const centroNombre = (id: string | null) =>
    centros.find((c) => c.id === id)?.nombre ?? "—";

  return (
    <div className="space-y-6">
      <SetupBanner />

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isAdmin ? "Panel de control" : "Centros de acopio Barquisimeto"}
        </h1>
        <p className="text-slate-500">
          {isAdmin
            ? "Resumen de la logística de donativos en tiempo real."
            : "¡Acércate a donar y ayudar! Aquí ves dónde llevar tu donación y lo más necesario ahora."}
        </p>
      </div>

      <div
        className={
          isAdmin
            ? "grid grid-cols-2 gap-3 lg:grid-cols-5"
            : "grid grid-cols-2 gap-3"
        }
      >
        <StatCard label="Centros" value={centros.length} />
        {isAdmin && (
          <StatCard
            label="Camiones disponibles"
            value={camionesDisponibles}
            accent="text-emerald-600"
          />
        )}
        {isAdmin && (
          <StatCard
            label="Viajes activos"
            value={viajesProgramados.length}
            accent="text-sky-600"
          />
        )}
        <StatCard
          label="Críticos por cubrir"
          value={criticos.length}
          accent="text-brand"
        />
        {isAdmin && (
          <StatCard
            label="Voluntarios disponibles"
            value={voluntarios.filter((v) => v.estado === "disponible").length}
            accent="text-indigo-600"
          />
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle hint="Puntos de recolección registrados">
            Centros de acopio
          </SectionTitle>
          {centros.length === 0 ? (
            <EmptyState>
              No hay centros registrados.{" "}
              <Link href="/centros" className="font-medium text-brand underline">
                Registrar uno
              </Link>
            </EmptyState>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {centros.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      🏢 {c.nombre}
                    </p>
                    {(c.direccion || c.contacto_telefono) && (
                      <p className="truncate text-sm text-slate-500">
                        {c.direccion ?? ""}
                        {c.direccion && c.contacto_telefono ? " · " : ""}
                        {c.contacto_telefono ?? ""}
                      </p>
                    )}
                  </div>
                  {c.capacidad && (
                    <span className="shrink-0 text-sm text-slate-400">
                      📦 {c.capacidad}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <SectionTitle hint="Máxima prioridad ahora mismo">
            Artículos críticos
          </SectionTitle>
          {criticos.length === 0 ? (
            <EmptyState>
              Sin artículos críticos.{" "}
              <Link href="/articulos" className="font-medium text-brand underline">
                Ver lista
              </Link>
            </EmptyState>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {criticos.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {a.nombre}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {a.cantidad} {a.unidad ?? "u."} · {centroNombre(a.centro_id)}
                    </p>
                  </div>
                  <Badge value={a.prioridad} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { href: "/centros", label: "Registrar centro", icon: "🏢" },
            { href: "/camiones", label: "Registrar camión", icon: "🚚" },
            { href: "/viajes", label: "Programar viaje", icon: "🗓️" },
            { href: "/articulos", label: "Añadir artículo", icon: "📦" },
            { href: "/voluntarios", label: "Registrar voluntario", icon: "🙋" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
            >
              <span className="text-2xl">{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/centros"
            className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
          >
            <span className="text-2xl">🏢</span>
            Ver centros de acopio
          </Link>
          <Link
            href="/articulos"
            className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
          >
            <span className="text-2xl">📦</span>
            Qué puedo donar
          </Link>
        </div>
      )}
    </div>
  );
}
