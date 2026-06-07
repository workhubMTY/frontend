"use client";

import type { ReactNode } from "react";

type ConfirmReservationModalShellProps = {
  children: ReactNode;
  onClose: () => void;
};

export function ConfirmReservationModalShell({
  children,
  onClose,
}: ConfirmReservationModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex h-[92vh] w-full max-w-6xl overflow-hidden bg-white shadow-2xl">
        {children}
      </section>
    </div>
  );
}