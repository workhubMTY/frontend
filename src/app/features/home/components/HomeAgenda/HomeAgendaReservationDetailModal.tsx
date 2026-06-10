"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
  MapPin,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/shared/auth/useAuth";
import { reservationsApi } from "@/app/features/reservaciones/crear/data/api";
import { reservationKeys } from "@/app/features/reservaciones/crear/data/hooks";

import { cn } from "@/app/shared/lib/cn";
import { useReservationDetail } from "@/app/features/reservaciones/crear/data/hooks";
import { userTimelineKeys } from "@/app/features/reservaciones/crear/hooks/useUserTimeline";
import { officeSlotKeys } from "@/app/features/cubiculos/data/hooks";

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

function formatDate(value?: string | Date | null) {
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

function formatShortDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value?: string | Date | null) {
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const cancelReservationMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.cancelReservation(id),
    onSuccess: async () => {
      if (reservationId) {
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.detail(reservationId),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["user-timeline"],
      });

      onClose();
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: ({
      reservationId,
      participantId,
    }: {
      reservationId: number;
      participantId: number;
    }) =>
      reservationsApi.patchParticipantAttendance(reservationId, participantId, {
        attendance_status: "CHECKED_OUT",
      }),

    onSuccess: async () => {
      if (reservationId) {
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.detail(reservationId),
        });        
      }
        await queryClient.invalidateQueries({queryKey:userTimelineKeys.all})
        await queryClient.invalidateQueries({queryKey:officeSlotKeys.all})

    },
  });

  if (!open) return null;

  const reservation = detailQuery.data as OfficeReservationDetail | undefined;
  const reservable = reservation?.reservable ?? null;
  const currentUserId = user?.eId ? String(user.eId) : null;

  const currentParticipant =
    reservation?.participants?.find(
      (participant) =>
        currentUserId !== null && String(participant.user_id) === currentUserId,
    ) ?? null;

  const canCheckout =
    reservation?.lifecycle_status === "ACTIVE" &&
    currentParticipant?.attendance_status === "CHECKED_IN";

  const canCancel = reservation?.lifecycle_status === "ACTIVE";

  const isMutating =
    cancelReservationMutation.isPending || checkoutMutation.isPending;

  function handleCancelReservation() {
    if (!reservation) return;

    const confirmed = window.confirm(
      "¿Seguro que quieres cancelar esta reservación?",
    );

    if (!confirmed) return;

    cancelReservationMutation.mutate(reservation.id);
  }

  function handleCheckout() {
    if (!reservation || !currentParticipant) return;

    checkoutMutation.mutate({
      reservationId: reservation.id,
      participantId: currentParticipant.id,
    });
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl lg:flex-row">
        {detailQuery.isLoading ? (
          <LoadingModal onClose={onClose} />
        ) : detailQuery.isError ? (
          <ErrorModal onClose={onClose} />
        ) : !reservation ? (
          <EmptyModal onClose={onClose} />
        ) : (
          <>
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                    Reservación de espacio
                  </p>

                  <h3 className="mt-2 truncate text-xl font-bold text-slate-950">
                    {reservable?.code
                      ? `Reservación ${reservable.code}`
                      : `Reservación #${reservation.id}`}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Consulta el detalle del espacio, horario y participantes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar modal"
                >
                  <X className="size-5" />
                </button>
              </header>

              <main className="min-h-0 flex-1 overflow-y-auto bg-white">
                <div className="space-y-4 px-4 py-4 sm:px-6 lg:hidden">
                  <MobileOfficeSummary reservation={reservation} />
                </div>

                <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <section className="space-y-4">
                    <ReservationInfoCard reservation={reservation} />
                    <ReservationStatusCard reservation={reservation} />
                  </section>

                  <aside className="hidden space-y-4 lg:block">
                    <ParticipantsCard
                      participants={reservation.participants ?? []}
                    />
                  </aside>
                </div>
              </main>
              <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-500">
                  Revisa participantes, estado y datos del espacio reservado.
                </p>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleCancelReservation}
                    disabled={!canCancel || isMutating}
                    className={cn(
                      "inline-flex items-center justify-center gap-2  border px-4 py-2.5 text-sm font-semibold transition",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "border-rose-200 bg-white text-rose-700 hover:bg-rose-50",
                    )}
                  >
                    {cancelReservationMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Borrar reservación
                  </button>

                  {canCheckout ? (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isMutating}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-sm font-semibold transition",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "border-slate-800 bg-slate-900 text-white hover:bg-slate-800",
                      )}
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LogOut className="size-4" />
                      )}
                      Hacer check-out
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isMutating}
                    className="border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cerrar
                  </button>
                </div>
              </footer>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function MobileOfficeSummary({
  reservation,
}: {
  reservation: OfficeReservationDetail;
}) {
  const reservable = reservation.reservable;

  return (
    <section className="border border-slate-200 bg-slate-50 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <MapPin size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
            Espacio reservado
          </p>

          <h4 className="mt-1 truncate text-base font-bold text-slate-950">
            {reservable?.code ?? `Reservación #${reservation.id}`}
          </h4>

          <p className="text-sm text-slate-500">
            {formatShortDate(reservation.start_time)} ·{" "}
            {formatTime(reservation.start_time)} –{" "}
            {formatTime(reservation.end_time)}
          </p>
        </div>
      </div>
    </section>
  );
}

function ReservationStatusCard({
  reservation,
}: {
  reservation: OfficeReservationDetail;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-950">
            Estado de la reservación
          </h4>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Consulta el ciclo de vida y el estado actual de asistencia.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <StatusBadge
            className={getLifecycleClassName(reservation.lifecycle_status)}
          >
            {getLifecycleLabel(reservation.lifecycle_status)}
          </StatusBadge>

          <StatusBadge
            className={getAttendanceClassName(reservation.attendance_status)}
          >
            {getAttendanceLabel(reservation.attendance_status)}
          </StatusBadge>
        </div>
      </div>
    </section>
  );
}

function ReservationInfoCard({
  reservation,
}: {
  reservation: OfficeReservationDetail;
}) {
  const reservable = reservation.reservable;

  return (
    <section className="border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-bold text-slate-950">
        Información de la reservación
      </h4>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <InfoBlock label="Reservación" value={`#${reservation.id}`} />
        <InfoBlock label="Categoría" value={reservation.category} />
        <InfoBlock label="Espacio" value={reservable?.code ?? "Sin espacio"} />
        <InfoBlock
          label="Capacidad"
          value={
            typeof reservable?.capacity === "number"
              ? `${reservable.capacity} personas`
              : "—"
          }
        />
        <InfoBlock
          label="Inicio"
          value={`${formatDate(reservation.start_time)} · ${formatTime(
            reservation.start_time,
          )}`}
        />
        <InfoBlock
          label="Fin"
          value={`${formatDate(reservation.end_time)} · ${formatTime(
            reservation.end_time,
          )}`}
        />
      </div>
    </section>
  );
}

function ParticipantsCard({
  participants,
}: {
  participants: OfficeReservationParticipant[];
}) {
  const ownerParticipant = participants.find(
    (participant) => participant.ownership_priority === 0,
  );

  return (
    <section className="overflow-hidden border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h4 className="text-sm font-bold text-slate-950">Participantes</h4>

          <p className="text-sm text-slate-500">
            Estado de asistencia de la reservación.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          {participants.length}
        </span>
      </header>

      <div className="divide-y divide-slate-100">
        {participants.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-400">
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
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-800">
              {name}
            </p>

            {participant.attendance_status === "CHECKED_IN" ? (
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
            ) : null}

            {isOwner ? (
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                Organizador
              </span>
            ) : null}
          </div>

          <p className="mt-0.5 text-xs text-slate-400">
            Prioridad {participant.ownership_priority}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
          getAttendanceClassName(participant.attendance_status),
        )}
      >
        {getAttendanceLabel(participant.attendance_status)}
      </span>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="text-slate-400">{icon}</div>
      </div>

      <p className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 truncate text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  );
}

function SummaryBlock({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold leading-5 text-slate-950">
          {value}
        </p>

        {helper ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}

function LoadingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ModalHeader
        eyebrow="Reservación"
        title="Cargando reservación..."
        description="Estamos preparando el detalle del espacio reservado."
        onClose={onClose}
      />

      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" />
          Cargando información...
        </div>
      </div>
    </div>
  );
}

function ErrorModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ModalHeader
        eyebrow="Reservación"
        title="No se pudo cargar"
        description="Ocurrió un problema al consultar la reservación."
        onClose={onClose}
      />

      <div className="p-6">
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudo cargar el detalle de la reservación.
        </div>
      </div>
    </div>
  );
}

function EmptyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ModalHeader
        eyebrow="Reservación"
        title="Sin información"
        description="No encontramos detalle para esta reservación."
        onClose={onClose}
      />

      <div className="p-6">
        <div className="border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          No hay información disponible.
        </div>
      </div>
    </div>
  );
}

function ModalHeader({
  eyebrow,
  title,
  description,
  onClose,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
          {eyebrow}
        </p>

        <h3 className="mt-2 truncate text-xl font-bold text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Cerrar modal"
      >
        <X className="size-5" />
      </button>
    </header>
  );
}
