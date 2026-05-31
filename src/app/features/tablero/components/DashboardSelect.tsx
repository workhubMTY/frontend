"use client";

import type { DashboardView } from "../hooks/useDashboard";

const OPTIONS: { value: DashboardView; label: string }[] = [
  { value: "users", label: "Usuarios" },
  { value: "reservations", label: "Reservaciones" },
];

type Props = {
  value: DashboardView;
  onChange: (view: DashboardView) => void;
};

export function DashboardSelect({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${value === opt.value
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}