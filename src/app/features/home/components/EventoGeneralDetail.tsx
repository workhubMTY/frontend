import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { EventoGeneral } from "../types/types";
import { formatEventTime, getDayLabel } from "../utils/utils";

type EventoGeneralDetailProps = {
  evento: EventoGeneral | null;
  currentIndex?: number;
  totalEvents?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onOpenAgenda?: () => void;
};

const eventTypeStyles: Record<EventoGeneral["tipo"], string> = {
  Festivo: "border-amber-200 bg-amber-50 text-amber-700",
  Corporativo: "border-purple-200 bg-purple-50 text-purple-700",
  Social: "border-blue-200 bg-blue-50 text-blue-700",
};

export function EventoGeneralDetail({
  evento,
  currentIndex = 0,
  totalEvents = 0,
  onPrevious,
  onNext,
  onOpenAgenda,
}: EventoGeneralDetailProps) {
  const hasEvent = Boolean(evento);

  return (
    <section className="shrink-0 overflow-hidden border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-3">
        <div className="flex items-center gap-3">
          <CalendarDays size={18} className="text-neutral-700" />

          <div>
            <h2 className="text-base font-semibold tracking-tight text-neutral-950">
              Eventos & Festivos
            </h2>

            {totalEvents > 0 && (
              <p className="mt-0.5 text-sm text-neutral-500">
                {currentIndex + 1} de {totalEvents}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!onPrevious || totalEvents <= 1}
            aria-label="Evento anterior"
            className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!onNext || totalEvents <= 1}
            aria-label="Siguiente evento"
            className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {!hasEvent || !evento ? (
        <div className="px-7 py-6">
          <article className="grid grid-cols-[auto_1fr] gap-4 border-l-4 border-purple-700 bg-purple-50/70 px-5 py-4">
            <div className="flex h-14 w-14 items-center justify-center bg-purple-100 text-xl font-semibold text-purple-700">
              —
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-neutral-950">Sin eventos</h3>

                <span className="inline-flex items-center border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                  Agenda general
                </span>
              </div>

              <p className="mt-1 text-sm text-neutral-500">
                No hay eventos cargados para este periodo.
              </p>

              <button
                type="button"
                disabled
                className="mt-4 inline-flex h-9 cursor-not-allowed items-center justify-center border border-neutral-200 bg-neutral-50 px-4 text-xs font-medium text-neutral-400"
              >
                Ver en agenda
              </button>
            </div>
          </article>
        </div>
      ) : (
        <article className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-l-4 border-purple-700 bg-purple-50/70 px-7 py-5 pl-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-purple-100 text-xl font-semibold text-purple-700">
            {evento.icono}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-neutral-950">
                {evento.titulo}
              </h3>

              <span
                className={[
                  "inline-flex items-center border px-2.5 py-1 text-xs font-medium",
                  eventTypeStyles[evento.tipo],
                ].join(" ")}
              >
                {evento.tipo}
              </span>
            </div>

            <p className="mt-1 line-clamp-2 text-xs leading-6 text-neutral-600">
              {evento.descripcion}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} className="text-neutral-400" />
                {getDayLabel(evento.day)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} className="text-neutral-400" />
                {formatEventTime(evento.start, evento.end)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-neutral-400" />
                Agenda general
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onOpenAgenda}
              className="inline-flex h-10 items-center border border-neutral-300 bg-white px-4 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Ver en agenda
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
