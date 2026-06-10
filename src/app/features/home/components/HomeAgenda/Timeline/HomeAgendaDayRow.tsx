"use client";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../../types/homeAgenda";

import { HomeAgendaItemBlock } from "./HomeAgendaItemBlock";

import {
  getHomeAgendaRowHeight,
  getMaxLane,
  placeItemsInLanes,
} from "../../../lib/homeAgendaTimeline";

type HomeAgendaDayRowProps = {
  day: HomeAgendaDay;
  items: ScheduleItem[];
  isDisabled?: boolean;
  isLoading?: boolean;
};

export function HomeAgendaDayRow({
  day,
  items,
  isDisabled = false,
  isLoading = false,
}: HomeAgendaDayRowProps) {
  const positionedItems = placeItemsInLanes(items);
  const laneCount = getMaxLane(positionedItems);
  const rowHeight = getHomeAgendaRowHeight(laneCount);

  return (
    <div className="grid grid-cols-[46px_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center pt-8">
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wide",
            day.isToday ? "text-slate-700" : "text-slate-400",
          )}
        >
          {day.dayLabel}
        </span>

        <span
          className={cn(
            "mt-1 grid size-7 place-items-center rounded-md text-xs font-semibold transition",
            day.isToday
              ? "border border-[#5B5FC7]/20 bg-[#5B5FC7]/10 text-[#4F52B2]"
              : "text-slate-700",
          )}
        >
          {day.dayNumber}
        </span>

      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-slate-200 bg-[#F8F8FA]",
          "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
          isDisabled && "bg-slate-100/70 opacity-60",
        )}
        style={{ minHeight: rowHeight }}
      >
        <div className="absolute inset-0 grid grid-cols-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "border-l border-slate-200/60",
                index === 0 && "border-l-0",
              )}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />

        {isDisabled ? (
          <AgendaRowState label="Fuera del rango disponible" />
        ) : isLoading ? (
          <AgendaRowState label="Cargando agenda..." />
        ) : positionedItems.length === 0 ? (
          <AgendaRowState label="Sin actividades" muted />
        ) : (
          positionedItems.map((item) => (
            <HomeAgendaItemBlock key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function AgendaRowState({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        className={cn(
          "rounded-md border border-slate-200 bg-white/70 px-2.5 py-1 text-xs shadow-sm",
          muted ? "text-slate-300" : "text-slate-400",
        )}
      >
        {label}
      </span>
    </div>
  );
}