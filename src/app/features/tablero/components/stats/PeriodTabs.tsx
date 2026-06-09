"use client";

import type { Period } from "../../data/types";

const OPTIONS: { value: Period; label: string }[] = [
    { value: "day",   label: "Día" },
    { value: "week",  label: "Semana" },
    { value: "month", label: "Mes" },
];

type PeriodTabsProps = {
    value: Period;
    onChange: (p: Period) => void;
};

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
    return (
        <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            {OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                        value === opt.value
                            ? "bg-violet-700 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
