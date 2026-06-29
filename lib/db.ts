"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

/**
 * Hook genérico: obtiene todos los registros de una tabla y se suscribe a
 * cambios en tiempo real (insert/update/delete) para refrescar automáticamente.
 */
export function useCollection<T>(table: string, orderBy = "created_at") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: rows, error: err } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: false });

    if (err) setError(err.message);
    else {
      setData((rows as T[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => {
    fetchAll();
    if (!supabase) return;

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [table, fetchAll]);

  return { data, loading, error, refresh: fetchAll };
}

export async function insertRow<T extends object>(table: string, values: T) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.from(table).insert(values);
  if (error) throw error;
}

export async function updateRow<T extends object>(
  table: string,
  id: string,
  values: T
) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteRow(table: string, id: string) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
