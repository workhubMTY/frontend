"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  if (user?.role !== "ADMIN") return null;

  return <>{children}</>;
}