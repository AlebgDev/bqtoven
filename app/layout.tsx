import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Centros de acopio Barquisimeto — Gestión de Emergencia",
  description:
    "Gestión de inventario y logística de donativos para centros de acopio tras un desastre natural.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
