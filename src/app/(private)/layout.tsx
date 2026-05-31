"use client";

import NavbarWrapper from "../shared/components/Navbar/NavbarWrapper";
import { AuthProvider } from "../shared/auth/auth.context";
import { AuthGuard } from "../shared/auth/AuthGuard";
import { SocketProvider } from "../shared/socket/socket.context";
import { useAuth } from "../shared/auth/useAuth";
import type { ReactNode } from "react";

function SocketBridge({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken } = useAuth();
  return (
    <SocketProvider isAuthenticated={isAuthenticated} accessToken={accessToken}>
      {children}
    </SocketProvider>
  );
}

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SocketBridge>
        <AuthGuard>
          <div
            className="flex flex-col min-h-screen  w-screen overflow-hidden"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            <NavbarWrapper />
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
          </div>
        </AuthGuard>
      </SocketBridge>
    </AuthProvider>
  );
}