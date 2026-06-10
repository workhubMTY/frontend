"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../types/homeAgenda";

import { getAgendaItemStyles } from "../../lib/homeAgendaStyles";
import { formatAgendaItemRange, timeToMinutes } from "../../lib/homeAgendaTimeline";

type HomeAgendaListProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds: string[];
  isLoading?: boolean;
};

function formatDayTitle(day: HomeAgendaDay) {
  return day.date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function sortItemsByTime(items: ScheduleItem[]) {
  return [...items].sort((a, b) => {
    const startDiff = timeToMinutes(a.start) - timeToMinutes(b.start);

    if (startDiff !== 0) return startDiff;

    return timeToMinutes(a.end) - timeToMinutes(b.end);
  });
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
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <span className="text-sm text-slate-400">Cargando agenda...</span>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div className="space-y-5">
        {days.map((day) => {
          const isDisabled = disabledIds.has(day.id);
          const items = isDisabled
            ? []
            : sortItemsByTime(itemsByDate[day.id] ?? []);

          return (
            <section key={day.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold capitalize text-slate-800">
                    {formatDayTitle(day)}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {day.isToday ? "Hoy" : day.id}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {items.length} {items.length === 1 ? "actividad" : "actividades"}
                </span>
              </div>

              {isDisabled ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-xs text-slate-400">
                  Fuera del rango disponible
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-xs text-slate-400">
                  Sin actividades
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => {
                    const styles = getAgendaItemStyles(item);
                    const Icon = styles.icon;

                    const location =
                      item.location ?? item.reservableName ?? "Sin ubicación";

                    return (
                      <article
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                      >
                        <div
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-lg border",
                            styles.className,
                          )}
                        >
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold text-slate-800">
                                {item.title}
                              </h4>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {location}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                              {formatAgendaItemRange(item)}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                styles.className,
                              )}
                            >
                              {item.sourceLabel}
                            </span>

                            {item.reservableName ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                <CalendarDays className="size-3" />
                                {item.reservableName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}