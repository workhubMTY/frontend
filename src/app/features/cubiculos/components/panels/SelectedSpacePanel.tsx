"use client";
import { useEffect, useMemo, useRef } from "react";
import { UsersRound } from "lucide-react";
import type { TimelineBlock } from "../../types/reservableSpaces";

import {
  OfficeSlotSummary,
  ReservationSummary,
  SpaceStatus,
} from "../../data/types";

import { getStatusLabel } from "./SpacesResultsList";

type SelectedSpacePanelProps = {
  selectedSpace?: OfficeSlotSummary;
  selectedSpaceReservations?: ReservationSummary[];
  isLoading?: boolean;
  onContinue: () => void;
};

const DAY_HOURS = 24;
const HOUR_HEIGHT = 28;
const DAY_MINUTES = 24 * 60;
const AGENDA_VISIBLE_HEIGHT = 160;

const timelineHours = Array.from({ length: DAY_HOURS }, (_, index) => index);

function getStatusClass(status: SpaceStatus) {
  if (status === "available")
    return "bg-green-50 text-green-700 border-green-200";
  if (status === "occupied")
    return "bg-red-50 text-red-700 border-red-200";
  if (status === "soon")
    return "bg-orange-50 text-orange-700 border-orange-200";

  return "bg-blue-50 text-blue-700 border-blue-200";
}

function getStatusDotClass(status: SpaceStatus) {
  if (status === "available") return "bg-green-500";
  if (status === "occupied") return "bg-red-500";
  if (status === "soon") return "bg-orange-500";

  return "bg-blue-500";
}

function getTimelineBlockClass(status: TimelineBlock["status"]) {
  return "bg-slate-300 text-on-container";
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getMinutesFromDate(value: string) {
  const date = new Date(value);

  return date.getHours() * 60 + date.getMinutes();
}

function getCurrentMinutes() {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

function getCurrentTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatTimeFromDate(value: string) {
  const date = new Date(value);

  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getReservationPosition(startTime: string, endTime: string) {
  const startMinutes = getMinutesFromDate(startTime);
  let endMinutes = getMinutesFromDate(endTime);

  if (endMinutes <= startMinutes) {
    endMinutes = DAY_MINUTES;
  }

  const durationMinutes = Math.max(endMinutes - startMinutes, 0);

  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 10);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}

function getCurrentTimePosition(currentMinutes: number) {
  return (currentMinutes / 60) * HOUR_HEIGHT;
}

export function SelectedSpacePanel({
  selectedSpace,
  selectedSpaceReservations,
  isLoading = false,
  onContinue,
}: SelectedSpacePanelProps) {
  const agendaScrollRef = useRef<HTMLDivElement | null>(null);

  const currentMinutes = useMemo(() => getCurrentMinutes(), []);
  const currentTimeLabel = useMemo(() => getCurrentTimeLabel(), []);
  const currentTimeTop = getCurrentTimePosition(currentMinutes);

  useEffect(() => {
    if (!selectedSpace) return;

    const scrollElement = agendaScrollRef.current;
    if (!scrollElement) return;

    const targetScrollTop = Math.max(
      currentTimeTop - AGENDA_VISIBLE_HEIGHT / 2,
      0,
    );

    scrollElement.scrollTop = targetScrollTop;
  }, [selectedSpace, currentTimeTop]);

  if (isLoading) {
    return (
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-10 w-full rounded bg-slate-200" />
        </div>
      </section>
    );
  }

  if (!selectedSpace) {
    return (
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-700">
            Selecciona un espacio en el mapa
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Aquí aparecerá su disponibilidad y el timeline del día.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex gap-2 text-lg">
            <span className="text-slate-500">{selectedSpace.code}</span>

            <span className="font-semibold text-purple-700">
              {selectedSpace.name ?? ""}
            </span>
          </p>

          <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <UsersRound className="h-4 w-4" />
            {selectedSpace.capacity} personas
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold",
            getStatusClass(selectedSpace.status),
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              getStatusDotClass(selectedSpace.status),
            ].join(" ")}
          />

          <span className="text-xxs">
            {getStatusLabel(selectedSpace.status)}
          </span>
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-700">
            Disponibilidad del día
          </span>

          <span>24 horas</span>
        </div>

        <div
          ref={agendaScrollRef}
          className="max-h-[160px] overflow-y-auto rounded-md border border-slate-200 bg-white"
        >
          <div
            className="relative"
            style={{
              height: `${DAY_HOURS * HOUR_HEIGHT}px`,
            }}
          >
            {/* Líneas de horas */}
            <div className="absolute inset-0">
              {timelineHours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[46px_minmax(0,1fr)] border-b border-slate-100"
                  style={{
                    height: `${HOUR_HEIGHT}px`,
                  }}
                >
                  <div className="bg-slate-50 px-2 pt-1 text-[10px] font-medium text-slate-500">
                    {formatHour(hour)}
                  </div>

                  <div className="relative bg-white">
                    <div className="absolute left-0 top-1/2 h-px w-full bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>

            {/* Línea de hora actual */}
            <div
              className="pointer-events-none absolute left-0 right-2 z-20"
              style={{
                top: `${currentTimeTop}px`,
              }}
            >
              <div className="grid grid-cols-[46px_minmax(0,1fr)] items-center">
                <div className="pr-1 text-right text-[10px] font-semibold text-primary-2">
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-2" />
                  <div className="h-px w-full bg-primary-2" />
                </div>
              </div>
            </div>

            {/* Reservaciones */}
            <div className="absolute left-[46px] right-2 top-0">
              {selectedSpaceReservations?.map((reservation) => {
                const position = getReservationPosition(
                  reservation.start_time,
                  reservation.end_time,
                );

                const startLabel = formatTimeFromDate(reservation.start_time);
                const endLabel = formatTimeFromDate(reservation.end_time);

                return (
                  <div
                    key={reservation.id}
                    className={[
                      "absolute left-2 right-0 z-10 overflow-hidden rounded-md px-2 py-1 text-[10px] font-medium",
                      getTimelineBlockClass(reservation.attendance_status),
                    ].join(" ")}
                    title={`${startLabel} - ${endLabel}`}
                    style={position}
                  >
                    <span className="block truncate">
                      {startLabel} - {endLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 h-11 w-full bg-primary-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-1"
      >
        Continuar con este espacio
      </button>
    </section>
  );
}