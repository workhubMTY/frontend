"use client";
import type { Period } from "../data/estadisticas";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const OPTIONS: { label: string; value: Period }[] = [
  { label: "Día", value: "dia" },
  { label: "Semana", value: "semana" },
  { label: "Mes", value: "mes" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex overflow-hidden border border-neutral-200">
      {OPTIONS.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            "px-4 py-2 text-sm transition-colors",
            i > 0 ? "border-l border-neutral-200" : "",
            value === opt.value
              ? "bg-purple-700 text-white"
              : "bg-white text-neutral-500 hover:bg-neutral-50",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}