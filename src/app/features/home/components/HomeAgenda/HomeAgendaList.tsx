"use client";

import { CalendarDays, Clock } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../types/homeAgenda";

import { getAgendaItemStyles } from "../../lib/homeAgendaStyles";
import {
  formatAgendaItemRange,
  timeToMinutes,
} from "../../lib/homeAgendaTimeline";

type HomeAgendaListProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds: string[];
  isLoading?: boolean;
};

function sortItemsByTime(items: ScheduleItem[]) {
  return [...items].sort((a, b) => {
    const startDiff = timeToMinutes(a.start) - timeToMinutes(b.start);

    if (startDiff !== 0) return startDiff;

    return timeToMinutes(a.end) - timeToMinutes(b.end);
  });
}

function getItemLocation(item: ScheduleItem) {
  return item.location ?? item.reservableName ?? "Sin ubicación";
}

function getItemKey(item: ScheduleItem, index: number) {
  return [
    item.dateId,
    item.kind,
    item.start,
    item.end,
    item.title,
    index,
  ].join("-");
}

export function HomeAgendaList({
  days,
  itemsByDate,
  disabledDateIds,
  isLoading = false,
}: HomeAgendaListProps) {
  const disabledIds = new Set(disabledDateIds);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <span className="text-sm text-slate-400">Cargando agenda...</span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden">
      <div className="grid h-full min-h-0 grid-cols-5 divide-x divide-slate-100">
        {days.map((day) => {
          const isDisabled = disabledIds.has(day.id);
          const items = isDisabled
            ? []
            : sortItemsByTime(itemsByDate[day.id] ?? []);

          return (
            <section key={day.id} className="flex min-h-0 flex-col bg-white">
              <header
                className={cn(
                  "shrink-0 border-b border-slate-100 px-4 py-3",
                  day.isToday && "bg-primary-2/[0.03]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-xs font-semibold uppercase tracking-wide",
                          day.isToday ? "text-primary-2" : "text-slate-500",
                        )}
                      >
                        {day.dayLabel}
                      </p>

                      {day.isToday ? (
                        <span className="rounded-full bg-primary-2/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary-2">
                          Hoy
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold leading-none text-slate-900">
                        {day.dayNumber}
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        {day.monthLabel}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                    {items.length}
                  </span>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                {isDisabled ? (
                  <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 text-center text-xs text-slate-400">
                    Fuera del rango disponible
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 text-center text-xs text-slate-400">
                    Sin actividades
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, index) => {
                      const styles = getAgendaItemStyles(item);
                      const Icon = styles.icon;
                      const location = getItemLocation(item);

                      return (
                        <article
                          key={getItemKey(item, index)}
                          className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={cn(
                                "grid size-8 shrink-0 place-items-center rounded-md border",
                                styles.className,
                              )}
                            >
                              <Icon className="size-3.5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
                                {item.title}
                              </h4>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {location}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                              <Clock className="size-3" />
                              {formatAgendaItemRange(item)}
                            </span>

                            <span
                              className={cn(
                                "rounded-md border px-2 py-1 text-[11px] font-medium",
                                styles.className,
                              )}
                            >
                              {item.sourceLabel}
                            </span>
                          </div>

                          {item.reservableName ? (
                            <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400">
                              <CalendarDays className="size-3 shrink-0" />
                              <span className="truncate">
                                {item.reservableName}
                              </span>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}