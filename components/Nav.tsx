"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const publicLinks = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/centros", label: "Centros", icon: "🏢" },
  { href: "/articulos", label: "Artículos", icon: "📦" },
];

const adminLinks = [
  { href: "/camiones", label: "Camiones", icon: "🚚" },
  { href: "/viajes", label: "Viajes", icon: "🗓️" },
  { href: "/voluntarios", label: "Voluntarios", icon: "🙋" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isOwner, signOut } = useAuth();

  const links = isAdmin
    ? [
        ...publicLinks,
        ...adminLinks,
        ...(isOwner
          ? [{ href: "/coordinadores", label: "Coordinadores", icon: "👑" }]
          : []),
      ]
    : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <>
      {/* Barra superior (escritorio) */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🆘</span>
            <span className="font-bold text-slate-800">
              Centros de acopio Barquisimeto
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(l.href)
                    ? "bg-brand text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin ? (
              <button
                onClick={handleSignOut}
                className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Salir
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Coordinadores
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Barra inferior (móvil/tablet) */}
      <nav className="fixed bottom-0 left-0 z-20 w-full border-t border-slate-200 bg-white md:hidden">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${links.length + 1}, minmax(0, 1fr))`,
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                isActive(l.href) ? "text-brand" : "text-slate-500"
              }`}
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </Link>
          ))}
          {isAdmin ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-slate-500"
            >
              <span className="text-lg">🚪</span>
              Salir
            </button>
          ) : (
            <Link
              href="/login"
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                isActive("/login") ? "text-brand" : "text-slate-500"
              }`}
            >
              <span className="text-lg">🔑</span>
              Acceso
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
