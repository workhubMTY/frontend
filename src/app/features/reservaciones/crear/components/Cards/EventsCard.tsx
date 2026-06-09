import { CalendarDays, ChevronRight } from "lucide-react";

import { cn } from "../../../../../shared/lib/cn";
import { Card } from "@/app/shared/components/Card";
import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

type EventsCardProps = {
  events?: ScheduleItem[];
  visibleEvents?: ScheduleItem[];
  conflictCount?: number;
  showAllEvents: boolean;
  onToggleShowAllEvents: () => void;
};

export function EventsCard({
  events = [],
  visibleEvents = [],
  conflictCount = 0,
  showAllEvents,
  onToggleShowAllEvents,
}: EventsCardProps) {
  const hasEvents = events.length > 0;
  const hasHiddenEvents = events.length > visibleEvents.length;

  return (
    <Card className="flex flex-1 flex-col gap-2 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">
          Tus horarios
        </h2>

        {hasEvents && conflictCount > 0 && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
            {conflictCount} conflicto{conflictCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {!hasEvents ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center">
          <CalendarDays className="h-7 w-7 text-slate-400" />

          <h3 className="mt-4 text-sm font-semibold text-slate-700">
            No hay eventos para este día
          </h3>
        </div>
      ) : (
        <div className="mt-3 divide-y divide-slate-200">
          {visibleEvents.map((event) => {
            const isConflict = isImportantScheduleItem(event);

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
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      {event.title}
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {getScheduleItemBadgeLabel(event)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {event.reservableCode ?? event.sourceLabel}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-slate-600">
                    {event.start} - {event.end}
                  </p>

                  {isConflict && (
                    <span className="mt-2 inline-flex whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold leading-tight text-red-600">
                      {event.status === "conflict"
                        ? "Conflicto"
                        : "Advertencia"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {hasEvents && hasHiddenEvents && (
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
      )}
    </Card>
  );
}

function getScheduleItemBadgeLabel(item: ScheduleItem) {
  if (item.kind === "calendar_event") return "Evento";
  if (item.kind === "parking_reservation") return "Parking";
  if (item.kind === "my_reservation") return "Reservación";
  return "Espacio";
}

function isImportantScheduleItem(item: ScheduleItem) {
  return item.status === "conflict" || item.status === "warning";
}