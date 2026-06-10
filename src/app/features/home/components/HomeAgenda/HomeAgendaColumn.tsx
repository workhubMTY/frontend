"use client";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../types/homeAgenda";

import { MAX_VISIBLE_ITEMS_PER_DAY } from "./HomeAgendaList";
import { HomeAgendaListItem } from "./HomeAgendaListItem";

type HomeAgendaDayColumnProps = {
  day: HomeAgendaDay;
  items: ScheduleItem[];
  isDisabled: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
};

export function HomeAgendaDayColumn({
  day,
  items,
  isDisabled,
  isExpanded,
  onToggleExpanded,
}: HomeAgendaDayColumnProps) {
  const hasItems = items.length > 0;
  const hasHiddenItems = items.length > MAX_VISIBLE_ITEMS_PER_DAY;

  const visibleItems = isExpanded
    ? items
    : items.slice(0, MAX_VISIBLE_ITEMS_PER_DAY);

  const hiddenCount = Math.max(items.length - MAX_VISIBLE_ITEMS_PER_DAY, 0);

  return (
    <section className="flex min-h-0 flex-col bg-white">
      <header
        className={cn(
          "shrink-0 border-b border-slate-100 px-3 py-2.5",
          day.isToday && "bg-primary-2/[0.04]",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className={cn(
                  "truncate text-[11px] font-semibold uppercase tracking-wide",
                  day.isToday ? "text-primary-2" : "text-slate-500",
                )}
              >
                {day.dayLabel}
              </p>

              {day.isToday ? (
                <span className="rounded-full bg-primary-2/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary-2">
                  Hoy
                </span>
              ) : null}
            </div>

            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-xl font-semibold leading-none text-slate-900">
                {day.dayNumber}
              </span>

              <span className="text-[11px] font-medium text-slate-400">
                {day.monthLabel}
              </span>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {items.length}
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {isDisabled ? (
          <EmptyAgendaState label="Fuera de rango" />
        ) : !hasItems ? (
          <EmptyAgendaState label="Sin actividades" />
        ) : (
          <div className="space-y-1.5">
            {visibleItems.map((item, index) => (
              <HomeAgendaListItem
                key={[
                  item.dateId,
                  item.kind,
                  item.start,
                  item.end,
                  item.title,
                  index,
                ].join("-")}
                item={item}
              />
            ))}

            {hasHiddenItems ? (
              <button
                type="button"
                onClick={onToggleExpanded}
                className={cn(
                  "flex w-full items-center justify-center rounded-md border px-2 py-2 text-[11px] font-medium transition",
                  isExpanded
                    ? "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    : "border-dashed border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700",
                )}
              >
                {isExpanded ? "Mostrar menos" : `+${hiddenCount} más`}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyAgendaState({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-2 text-center text-[11px] text-slate-400">
      {label}
    </div>
  );
}