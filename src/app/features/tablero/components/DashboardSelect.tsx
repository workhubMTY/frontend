"use client";

import type { DashboardView } from "../hooks/useDashboard";

const OPTIONS: { value: DashboardView; label: string }[] = [
  { value: "users", label: "Usuarios" },
  { value: "reservations", label: "Reservaciones" },
  { value: "stats", label: "Estadisticas"},
];

type Props = {
  value: DashboardView;
  onChange: (view: DashboardView) => void;
};

export function DashboardSelect({ value, onChange }: Props) {
  return (
    <div className="mb-4 grid grid-cols-3 border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-4 py-1.5 text-sm font-medium transition-all duration-200
            ${value === opt.value
              ? "bg-violet-700 text-white shadow-sm"
              : "hover:bg-white"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}