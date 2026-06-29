import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER_EMAIL = (process.env.NEXT_PUBLIC_OWNER_EMAIL || "").toLowerCase();

function getAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Verifica que quien llama esté autenticado Y sea el owner.
async function requireOwner(req: Request) {
  const admin = getAdmin();
  if (!admin) return { error: "Servidor no configurado", status: 500 } as const;

  const token = (req.headers.get("authorization") || "").replace(
    /^Bearer\s+/i,
    ""
  );
  if (!token) return { error: "No autorizado", status: 401 } as const;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user)
    return { error: "Sesión inválida", status: 401 } as const;

  if ((data.user.email || "").toLowerCase() !== OWNER_EMAIL)
    return { error: "Solo el owner puede gestionar coordinadores", status: 403 } as const;

  return { admin, owner: data.user } as const;
}

export async function GET(req: Request) {
  const auth = await requireOwner(req);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await auth.admin.auth.admin.listUsers();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const coordinadores = data.users
    .map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      isOwner: (u.email || "").toLowerCase() === OWNER_EMAIL,
    }))
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));

  return NextResponse.json({ coordinadores });
}

export async function POST(req: Request) {
  const auth = await requireOwner(req);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password)
    return NextResponse.json(
      { error: "Correo y contraseña son obligatorios" },
      { status: 400 }
    );
  if (password.length < 8)
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    );

  const { data, error } = await auth.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    coordinador: { id: data.user.id, email: data.user.email },
  });
}

export async function DELETE(req: Request) {
  const auth = await requireOwner(req);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.id)
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  if (body.id === auth.owner.id)
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta de owner" },
      { status: 400 }
    );

  const { error } = await auth.admin.auth.admin.deleteUser(body.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
