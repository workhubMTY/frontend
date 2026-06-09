"use client";

import type { OfficeReservationWithParticipants } from "@/app/features/guard-checkin/types";
import { Users, MapPin, Layers } from "lucide-react";

type Props = {
  reservation: OfficeReservationWithParticipants;
};

function fmt(date: Date | string) {
  return new Date(date).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function OfficeCheckinSuccessContent({ reservation }: Props) {
  const { reservable, participants, start_time, end_time, category } = reservation;

  const checkedIn = participants.filter(
    (p) => p.attendance_status === "CHECKED_IN" && p.user_id !== null
  ).length;

  const total = participants.filter((p) => p.user_id !== null).length;

  return (
    <div className="mt-2 text-left space-y-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {reservable.name ?? reservable.code}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {category === "MEETING" ? "Sala de reunión" : "Cubículo individual"}
        </p>
      </div>

      {/* Schedule */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Horario</p>
        <p className="font-medium text-slate-900">{fmtDate(start_time)}</p>
        <p className="text-slate-600">
          {fmt(start_time)} – {fmt(end_time)}
        </p>
      </div>

      {/* Space details */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 flex flex-col items-center gap-1">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-500">Código</span>
          <span className="font-semibold text-slate-800 text-xs">{reservable.code}</span>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 flex flex-col items-center gap-1">
          <Layers className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-500">Piso</span>
          <span className="font-semibold text-slate-800 text-xs">{reservable.floor}</span>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 flex flex-col items-center gap-1">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-500">Cap.</span>
          <span className="font-semibold text-slate-800 text-xs">{reservable.capacity}</span>
        </div>
      </div>

      {/* Participants */}
      {total > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Participantes ({checkedIn}/{total} con check-in)
          </p>
          <ul className="space-y-1">
            {participants
              .filter((p) => p.user_id !== null)
              .map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="text-slate-700 text-xs">{p.user_id}</span>
                  <StatusBadge status={p.attendance_status} />
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; className: string }> = {
    CHECKED_IN: { label: "Check-in", className: "bg-emerald-100 text-emerald-700" },
    NOT_ARRIVED: { label: "Pendiente", className: "bg-slate-100 text-slate-500" },
    INVITED: { label: "Invitado", className: "bg-blue-100 text-blue-600" },
    CHECKED_OUT: { label: "Salió", className: "bg-purple-100 text-purple-600" },
    NO_SHOW: { label: "No asistió", className: "bg-red-100 text-red-500" },
    CANCELED: { label: "Cancelado", className: "bg-red-100 text-red-500" },
  };

  const info = status ? (map[status] ?? { label: status, className: "bg-slate-100 text-slate-500" }) : { label: "—", className: "bg-slate-100 text-slate-400" };

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${info.className}`}>
      {info.label}
    </span>
  );
}
