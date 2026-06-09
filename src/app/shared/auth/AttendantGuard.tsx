"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function AttendantGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === "ACCESS_ATTENDANT") {
      router.replace("/parking-checkin");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user?.role === "ACCESS_ATTENDANT") return null;

  return <>{children}</>;
}
