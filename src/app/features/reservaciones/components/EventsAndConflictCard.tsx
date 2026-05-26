import { AlertTriangle, CalendarDays, ChevronRight } from "lucide-react";

import type { DayEvent } from "../types/reservaciones";
import { cn } from "../lib/cn";
import { Card } from "./Card";

type EventsAndConflictsCardProps = {
  events: DayEvent[];
  visibleEvents: DayEvent[];
  conflictCount: number;
  showAllEvents: boolean;
  onToggleShowAllEvents: () => void;
};

export function EventsAndConflictsCard({
  events,
  visibleEvents,
  conflictCount,
  showAllEvents,
  onToggleShowAllEvents,
}: EventsAndConflictsCardProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-bold text-slate-950">Eventos y conflictos</h2>

      <div className="my-4 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-sm font-semibold text-slate-700">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          {events.length} eventos
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-sm font-semibold text-slate-700">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          {conflictCount} conflictos
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {visibleEvents.map((event) => {
          const isConflict = event.status !== "normal";

          return (
            <article
              key={event.id}
              className="grid grid-cols-[12px_1fr_auto] gap-3 py-4"
            >
              <span
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 rounded-full",
                  isConflict ? "bg-red-500" : "bg-blue-500",
                )}
              />

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{event.location}</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-slate-600">
                  {event.time}
                </p>

                {isConflict && (
                  <span className="mt-2 inline-flex whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold leading-tight text-red-600">
                    {event.status === "conflict"
                      ? "Conflicto"
                      : "Conflicto\nparcial"}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onToggleShowAllEvents}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
      >
        {showAllEvents
          ? "Ver menos"
          : `Ver todos los eventos (${events.length})`}
        <ChevronRight
          className={cn("h-4 w-4 transition", showAllEvents && "rotate-90")}
        />
      </button>
    </Card>
  );
}
