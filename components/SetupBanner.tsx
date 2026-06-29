"use client";

import { isSupabaseConfigured } from "@/lib/supabase";

export default function SetupBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">⚠️ Falta configurar Supabase</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>
          Crea un proyecto gratis en{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline"
          >
            supabase.com
          </a>
          .
        </li>
        <li>
          Abre <strong>SQL Editor</strong> y ejecuta el contenido de{" "}
          <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>.
        </li>
        <li>
          Copia <code className="rounded bg-amber-100 px-1">.env.local.example</code>{" "}
          como <code className="rounded bg-amber-100 px-1">.env.local</code> y
          pega tu URL y anon key (Project Settings → API).
        </li>
        <li>Reinicia el servidor: <code className="rounded bg-amber-100 px-1">npm run dev</code>.</li>
      </ol>
    </div>
  );
}
