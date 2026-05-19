"use client";

import NavbarWrapper from "../shared/components/Navbar/NavbarWrapper";
import { AuthProvider } from "../shared/auth/auth.context";
import { AuthGuard } from "../shared/auth/AuthGuard";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div
          className="flex flex-col min-h-screen  w-screen overflow-hidden"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          <NavbarWrapper />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
