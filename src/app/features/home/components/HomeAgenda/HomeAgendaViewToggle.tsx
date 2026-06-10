"use client";

import { CalendarDays, List } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { HomeAgendaViewMode } from "../../types/homeAgenda";

type HomeAgendaViewToggleProps = {
  activeView: HomeAgendaViewMode;
  onChangeView: (view: HomeAgendaViewMode) => void;
};

const VIEWS: Array<{
  value: HomeAgendaViewMode;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "agenda",
    label: "Agenda",
    icon: <CalendarDays className="size-3.5" />,
  },
  {
    value: "list",
    label: "Lista",
    icon: <List className="size-3.5" />,
  },
];

export function HomeAgendaViewToggle({
  activeView,
  onChangeView,
}: HomeAgendaViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5">
      {VIEWS.map((view) => {
        const isActive = activeView === view.value;

        return (
          <button
            key={view.value}
            type="button"
            onClick={() => onChangeView(view.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-xs font-medium transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/30",
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-800",
            )}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}