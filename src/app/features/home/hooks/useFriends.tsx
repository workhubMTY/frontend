"use client";

import { useState, useEffect } from "react";
import { listFriends } from "@/app/features/home/data/api";
import type { Friend } from "@/app/features/perfil/types/profile";

export type FriendStatus = "loading" | "error" | "success";

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [status, setStatus] = useState<FriendStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listFriends
      .getUserMeFriendships()
      .then((data: any) => {
        if (cancelled) return;
        const items: Friend[] = Array.isArray(data)
          ? data
          : (data?.items ?? []);
        setFriends(items);
        console.log("datos: ",data);
        setStatus("success");
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message ?? "Error al cargar contactos");
        setStatus("error");
      });

    return () => { cancelled = true; };
  }, []);

  return { friends, status, error };
}