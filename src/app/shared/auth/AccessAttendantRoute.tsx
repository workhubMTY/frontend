"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function AccessAttendantRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "ACCESS_ATTENDANT") {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (user && user.role !== "ACCESS_ATTENDANT") return null;

  return <>{children}</>;
}
