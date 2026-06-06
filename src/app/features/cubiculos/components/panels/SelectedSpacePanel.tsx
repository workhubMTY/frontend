import { UsersRound } from "lucide-react";
import type { TimelineBlock } from "../../types/reservableSpaces";

import {
  OfficeSlotSummary,
  ReservationSummary,
  SpaceStatus,
} from "../../data/types";

import {
  getSpaceDisplayName,
  getStatusLabel,
} from "./SpacesResultsList";

type SelectedSpacePanelProps = {
  selectedSpace?: OfficeSlotSummary;
  selectedSpaceReservations?: ReservationSummary[];
  isLoading?: boolean;
  onContinue: () => void;
};

const timelineLabelHours = [
  "00:00",
  "04:00",
  "08:00",
  "12:00",
  "16:00",
  "20:00",
  "24:00",
];

const DAY_MINUTES = 24 * 60;

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

  return " bg-slate-500";
}

function getMinutesFromDate(value: string) {
  const date = new Date(value);

  return date.getHours() * 60 + date.getMinutes();
}

function getReservationPosition(startTime: string, endTime: string) {
  const startMinutes = getMinutesFromDate(startTime);
  let endMinutes = getMinutesFromDate(endTime);

  /**
   * Caso especial:
   * Si una reserva empieza en la noche y termina después de medianoche,
   * por ejemplo 23:00 → 02:00, solo pintamos hasta las 24:00.
   */
  if (endMinutes <= startMinutes) {
    endMinutes = DAY_MINUTES;
  }

  const durationMinutes = Math.max(endMinutes - startMinutes, 0);

  const left = (startMinutes / DAY_MINUTES) * 100;
  const width = (durationMinutes / DAY_MINUTES) * 100;

  return {
    left: `${left}%`,
    width: `${width}%`,
  };
}

export function SelectedSpacePanel({
  selectedSpace,
  selectedSpaceReservations,
  isLoading = false,
  onContinue,
}: SelectedSpacePanelProps) {
  console.log("SelectedSpacePanel render", {
    selectedSpace,
    selectedSpaceReservations,
    isLoading,
  });

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

        <div className=" border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
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
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* <h2 className="text-lg font-semibold text-slate-950">
            Espacio seleccionado
          </h2> */}

          <p className="text-lg flex gap-2">
            <span className="text-slate-500">{selectedSpace.code}</span> 
            <span className="font-semibold text-purple-700">{selectedSpace.name ?? ""}</span>
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

          {getStatusLabel(selectedSpace.status)}
        </span>
      </div>

      <div >
        <div className="mt-4">
          <div className="mb-2 grid grid-cols-7 text-xs text-slate-500">
            {timelineLabelHours.map((hour, index) => (
              <span
                key={hour}
                className={[
                  index === 0 ? "text-left" : "",
                  index === timelineLabelHours.length - 1 ? "text-right" : "",
                  index !== 0 && index !== timelineLabelHours.length - 1
                    ? "text-center"
                    : "",
                ].join(" ")}
              >
                {hour}
              </span>
            ))}
          </div>

          <div className="relative h-10 overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="absolute inset-0 grid grid-cols-24">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="border-r border-slate-100 last:border-r-0"
                />
              ))}
            </div>

            {selectedSpaceReservations?.map((reservation) => {
              const position = getReservationPosition(
                reservation.start_time,
                reservation.end_time,
              );

              return (
                <div
                  key={reservation.id}
                  className={[
                    "absolute top-0 z-10 h-full",
                    getTimelineBlockClass(reservation.attendance_status),
                  ].join(" ")}
                  title={`${reservation.start_time} - ${reservation.end_time}`}
                  style={position}
                />
              );
            })}
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