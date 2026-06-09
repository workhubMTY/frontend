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

const COLLAPSED_EVENTS_COUNT = 3;

export function EventsCard({
  events = [],
  visibleEvents = [],
  conflictCount = 0,
  showAllEvents,
  onToggleShowAllEvents,
}: EventsCardProps) {
  const hasEvents = events.length > 0;
  const canToggleEvents = events.length > COLLAPSED_EVENTS_COUNT;

  const displayedEvents = showAllEvents
    ? events
    : events.slice(0, COLLAPSED_EVENTS_COUNT);

  return (
    <Card className="flex flex-1 flex-col gap-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Tus horarios</h2>

          {hasEvents && (
            <p className="mt-0.5 text-xs text-slate-500">
              {events.length} horario{events.length === 1 ? "" : "s"} para este
              día
            </p>
          )}
        </div>

        {hasEvents && conflictCount > 0 && (
          <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
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
        <>
          <div className="mt-3 divide-y divide-slate-200">
            {displayedEvents.map((event) => {
              const isConflict = isImportantScheduleItem(event);

              return (
                <article
                  key={event.id}
                  className="grid grid-cols-[10px_minmax(0,1fr)_auto] gap-3 py-3.5"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full",
                      isConflict ? "bg-red-500" : "bg-slate-300",
                    )}
                  />

                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-800">
                        {event.title}
                      </h3>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {getScheduleItemBadgeLabel(event)}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {event.reservableCode ?? event.sourceLabel}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-slate-600">
                      {event.start} - {event.end}
                    </p>

                    {isConflict && (
                      <span className="mt-2 inline-flex rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
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

          {canToggleEvents && (
            <button
              type="button"
              onClick={onToggleShowAllEvents}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              {showAllEvents
                ? "Mostrar menos"
                : `Mostrar ${events.length - COLLAPSED_EVENTS_COUNT} más`}
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showAllEvents && "-rotate-90",
                )}
              />
            </button>
          )}
        </>
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
