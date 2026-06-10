import { Users, Monitor, Car, CalendarDays, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import type { AgendaFilter } from "@/app/features/home/hooks/unused/useHomePage";

const FILTERS: { key: AgendaFilter; label: string; icon: React.ReactNode }[] = [
  { key: "juntas",           label: "Juntas",      icon: <Users size={13} /> },
  { key: "coworking",        label: "Coworking",   icon: <Monitor size={13} /> },
  { key: "estacionamientos", label: "Estaciona.",  icon: <Car size={13} /> },
  { key: "eventos",          label: "Eventos",     icon: <CalendarDays size={13} /> },
];

type AgendaFilterTabsProps = {
  active: AgendaFilter[];
  onChange: (filters: AgendaFilter[]) => void;
};

export function AgendaFilterTabs({ active, onChange }: AgendaFilterTabsProps) {
  const allSelected = active.length === FILTERS.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : FILTERS.map((f) => f.key));
  };

  const toggle = (key: AgendaFilter) => {
    if (active.includes(key)) {
      onChange(active.filter((k) => k !== key));
    } else {
      onChange([...active, key]);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Botón Todos */}
      <button
        type="button"
        onClick={toggleAll}
        className={[
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer select-none",
          allSelected
            ? "border-violet-600 bg-violet-600 text-white shadow-sm"
            : "border-neutral-200 bg-white text-neutral-500 hover:border-violet-300 hover:text-violet-600",
        ].join(" ")}
      >
        <span className={allSelected ? "text-white" : "text-neutral-400"}>
          <LayoutGrid size={13} />
        </span>
        Todos
      </button>

      {/* Separador */}
      <span className="h-4 w-px bg-neutral-200 mx-0.5" />

      {/* Filtros individuales */}
      {FILTERS.map((f) => {
        const isActive = active.includes(f.key);
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => toggle(f.key)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer select-none",
              isActive
                ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-violet-300 hover:text-violet-600",
            ].join(" ")}
          >
            <span className={isActive ? "text-white" : "text-neutral-400"}>
              {f.icon}
            </span>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}