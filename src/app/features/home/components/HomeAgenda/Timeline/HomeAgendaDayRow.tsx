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
    <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center pt-9">
        <span className="text-[10px] font-semibold uppercase text-slate-400">
          {day.dayLabel}
        </span>

        <span
          className={cn(
            "mt-1 grid size-6 place-items-center rounded-full text-xs font-semibold",
            day.isToday
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-700",
          )}
        >
          {day.dayNumber}
        </span>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-slate-50",
          isDisabled && "bg-slate-100 opacity-50",
        )}
        style={{ minHeight: rowHeight }}
      >
        <div className="absolute inset-0 grid grid-cols-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "border-l border-slate-200/80",
                index === 0 && "border-l-0",
              )}
            />
          ))}
        </div>

        {isDisabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-slate-400">
              Fuera del rango disponible
            </span>
          </div>
        ) : isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-slate-400">Cargando agenda...</span>
          </div>
        ) : positionedItems.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-slate-300">Sin actividades</span>
          </div>
        ) : (
          positionedItems.map((item) => (
            <HomeAgendaItemBlock key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}