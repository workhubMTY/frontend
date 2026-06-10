"use client";

import {
  Calendar,
  Car,
  Monitor,
  Users,
  LayoutGrid,
} from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { HomeAgendaFilter } from "../../types/homeAgenda";

const FILTERS: Array<{
  value: HomeAgendaFilter;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "all",
    label: "Todos",
    icon: <LayoutGrid className="size-3.5" />,
  },
  {
    value: "meeting",
    label: "Juntas",
    icon: <Users className="size-3.5" />,
  },
  {
    value: "coworking",
    label: "Coworking",
    icon: <Monitor className="size-3.5" />,
  },
  {
    value: "parking",
    label: "Parking",
    icon: <Car className="size-3.5" />,
  },
  {
    value: "events",
    label: "Eventos",
    icon: <Calendar className="size-3.5" />,
  },
];

type HomeAgendaFiltersProps = {
  activeFilter: HomeAgendaFilter;
  onChangeFilter: (filter: HomeAgendaFilter) => void;
};

export function HomeAgendaFilters({
  activeFilter,
  onChangeFilter,
}: HomeAgendaFiltersProps) {
  return (
    <div className="flex flex-wrap self-center items-center border border-grid-lines gap-2 bg-container p-1 bg-neutral-50" >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChangeFilter(filter.value)}
            className={cn(
              "inline-flex h-8 items-center gap-2 px-3 text-xs font-medium transition",
              isActive
                ? "bg-primary-2 text-on-primary"
                : "text-slate-500 hover:border-slate-300 hover:text-slate-800",
            )}
          >
            {filter.icon}
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}