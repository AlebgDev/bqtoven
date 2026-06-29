"use client";

import { ReactNode } from "react";
import Link from "next/link";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold text-slate-800">{children}</h2>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} ${props.className ?? ""}`} />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea {...props} className={`${inputBase} ${props.className ?? ""}`} />
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles: Record<string, string> = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    ghost: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

const badgeColors: Record<string, string> = {
  disponible: "bg-emerald-100 text-emerald-700",
  en_ruta: "bg-amber-100 text-amber-700",
  mantenimiento: "bg-slate-200 text-slate-600",
  programado: "bg-sky-100 text-sky-700",
  entregado: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
  critica: "bg-red-600 text-white",
  alta: "bg-red-100 text-red-700",
  media: "bg-amber-100 text-amber-700",
  baja: "bg-slate-200 text-slate-600",
  necesario: "bg-amber-100 text-amber-700",
  recibido: "bg-emerald-100 text-emerald-700",
  asignado: "bg-sky-100 text-sky-700",
  inactivo: "bg-slate-200 text-slate-600",
};

const badgeLabels: Record<string, string> = {
  critica: "crítica",
  en_ruta: "en ruta",
};

export function Badge({ value }: { value: string }) {
  const color = badgeColors[value] ?? "bg-slate-100 text-slate-600";
  const label = badgeLabels[value] ?? value.replace("_", " ");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}
    >
      {label}
    </span>
  );
}

export function SoloCoordinadores() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-4xl">🔒</p>
      <h2 className="mt-3 text-lg font-semibold text-slate-800">
        Solo para coordinadores
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Esta sección contiene información interna. Inicia sesión para
        acceder.
      </p>
      <Link
        href="/login"
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  accent = "text-slate-800",
}: {
  label: string;
  value: ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
