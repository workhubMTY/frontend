"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import { useReservationDetail } from "@/app/features/reservaciones/crear/data/hooks";

type OfficeReservationDetail = {
  id: number;
  reservable_id: number;
  category: string;
  start_time: string;
  end_time: string;
  description: string | null;
  attendance_status: string;
  created_at: string;
  updated_at: string;
  lifecycle_status: "ACTIVE" | "FINALIZED" | "CANCELED" | string;
  reservable: {
    id: number;
    name: string | null;
    code: string;
    capacity: number;
    floor_id: number;
    is_blocked: boolean;
  } | null;
  participants: OfficeReservationParticipant[];
};

type OfficeReservationParticipant = {
  id: number;
  reservations_id: number;
  user_id: string | null;
  ownership_priority: number;
  attendance_status: string;
  created_at: string;
  updated_at: string;
};

type HomeAgendaReservationDetailModalProps = {
  reservationId: number | null;
  open: boolean;
  onClose: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAttendanceLabel(status?: string | null) {
  switch (status) {
    case "INVITED":
      return "Invitado";
    case "NOT_ARRIVED":
      return "No ha llegado";
    case "CHECKED_IN":
      return "Check-in";
    case "CHECKED_OUT":
      return "Check-out";
    case "NO_SHOW":
      return "No asistió";
    case "NOT_ACCEPTED":
      return "No aceptado";
    case "REJECTED":
      return "Rechazado";
    case "CANCELED":
      return "Cancelado";
    default:
      return status ?? "Sin estado";
  }
}

function getAttendanceClassName(status?: string | null) {
  switch (status) {
    case "CHECKED_IN":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CHECKED_OUT":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "CANCELED":
    case "REJECTED":
    case "NO_SHOW":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "NOT_ARRIVED":
    case "INVITED":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getLifecycleLabel(status?: string | null) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "FINALIZED":
      return "Finalizada";
    case "CANCELED":
      return "Cancelada";
    default:
      return status ?? "Sin estado";
  }
}

function getLifecycleClassName(status?: string | null) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "FINALIZED":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "CANCELED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function HomeAgendaReservationDetailModal({
  reservationId,
  open,
  onClose,
}: HomeAgendaReservationDetailModalProps) {
  const detailQuery = useReservationDetail(open ? reservationId : null);

  if (!open) return null;

  const reservation = detailQuery.data as OfficeReservationDetail | undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[1px]">
      <section className="flex max-h-[min(720px,calc(100vh-48px))] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Detalle de reservación
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-slate-950">
              {detailQuery.isLoading
                ? "Cargando reservación..."
                : reservation?.reservable?.code
                  ? `Reservación ${reservation.reservable.code}`
                  : `Reservación #${reservation?.id ?? reservationId}`}
            </h2>

            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {reservation?.description?.trim()
                ? reservation.description
                : "Sin descripción adicional"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar detalle"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-5">
          {detailQuery.isLoading ? (
            <LoadingState />
          ) : detailQuery.isError ? (
            <ErrorState />
          ) : !reservation ? (
            <EmptyState />
          ) : (
            <ReservationDetailContent reservation={reservation} />
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </footer>
      </section>
    </div>
  );
}

function ReservationDetailContent({
  reservation,
}: {
  reservation: OfficeReservationDetail;
}) {
  const participants = reservation.participants ?? [];

  const checkedInCount = participants.filter(
    (participant) => participant.attendance_status === "CHECKED_IN",
  ).length;

  const ownerParticipant = participants.find(
    (participant) => participant.ownership_priority === 0,
  );

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <DetailTile
          icon={<CalendarDays className="size-4" />}
          label="Fecha"
          value={formatDate(reservation.start_time)}
        />

        <DetailTile
          icon={<Clock className="size-4" />}
          label="Horario"
          value={`${formatTime(reservation.start_time)} - ${formatTime(
            reservation.end_time,
          )}`}
        />

        <DetailTile
          icon={<Users className="size-4" />}
          label="Participantes"
          value={`${participants.length} total`}
          description={`${checkedInCount} con check-in`}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
            <MapPin className="size-4" />
          </div>

          <p className="text-xs font-medium text-slate-400">Espacio</p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {reservation.reservable?.code ?? "Sin código"}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Capacidad {reservation.reservable?.capacity ?? "—"} · Piso{" "}
            {reservation.reservable?.floor_id ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-400">Estado</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium",
                getLifecycleClassName(reservation.lifecycle_status),
              )}
            >
              {getLifecycleLabel(reservation.lifecycle_status)}
            </span>

            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium",
                getAttendanceClassName(reservation.attendance_status),
              )}
            >
              {getAttendanceLabel(reservation.attendance_status)}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Información general
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {reservation.description?.trim() ||
                "Esta reservación no tiene descripción registrada."}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
            {reservation.category}
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Participantes
            </h3>

            <p className="text-xs text-slate-400">
              Estado de asistencia de la reservación
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
            {participants.length}
          </span>
        </header>

        <div className="divide-y divide-slate-100">
          {participants.length === 0 ? (
            <div className="px-4 py-5 text-sm text-slate-400">
              No hay participantes registrados.
            </div>
          ) : (
            participants.map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                isOwner={ownerParticipant?.id === participant.id}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ParticipantRow({
  participant,
  isOwner,
}: {
  participant: OfficeReservationParticipant;
  isOwner: boolean;
}) {
  const name = participant.user_id ?? "Usuario sin asignar";

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-medium text-slate-800">
              {name}
            </p>

            {participant.attendance_status === "CHECKED_IN" ? (
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
            ) : null}

            {isOwner ? (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                Organizador
              </span>
            ) : null}
          </div>

          <p className="truncate text-xs text-slate-400">
            Prioridad {participant.ownership_priority}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
          getAttendanceClassName(participant.attendance_status),
        )}
      >
        {getAttendanceLabel(participant.attendance_status)}
      </span>
    </div>
  );
}

function DetailTile({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>

      {description ? (
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="size-4 animate-spin" />
        Cargando información...
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      No se pudo cargar el detalle de la reservación.
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
      No hay información disponible.
    </div>
  );
}