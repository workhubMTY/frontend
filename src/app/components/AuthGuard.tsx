"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../modules/auth/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return null; // o un spinner

  if (!isAuthenticated) return null;

  return <>{children}</>;
}