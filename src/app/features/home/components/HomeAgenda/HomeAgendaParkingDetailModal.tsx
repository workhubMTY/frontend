"use client";

import {
  Car,
  Clock,
  Loader2,
  MapPin,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import { useParkingReservationDetail } from "@/app/features/estacionamientos/data/hooks";
import { ParkingReservationQr } from "@/app/features/guard-checkin/components/ParkingReservationQr";
import {
  AttendanceStatus,
  LifecycleStatus,
  ReservationDetailResponse,
} from "@/app/features/estacionamientos/data/types";

type HomeAgendaParkingDetailModalProps = {
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

function getAttendanceLabel(status?: AttendanceStatus | string | null) {
  switch (status) {
    case "NOT_ARRIVED":
      return "No ha llegado";
    case "CHECKED_IN":
      return "Check-in";
    case "CHECKED_OUT":
      return "Check-out";
    case "NO_SHOW":
      return "No asistió";
    default:
      return status ?? "Sin estado";
  }
}

function getAttendanceClassName(status?: AttendanceStatus | string | null) {
  switch (status) {
    case "CHECKED_IN":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CHECKED_OUT":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "NO_SHOW":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "NOT_ARRIVED":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getLifecycleLabel(status?: LifecycleStatus | string | null) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "CANCELED":
      return "Cancelada";
    default:
      return status ?? "Sin estado";
  }
}

function getLifecycleClassName(status?: LifecycleStatus | string | null) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function HomeAgendaParkingDetailModal({
  reservationId,
  open,
  onClose,
}: HomeAgendaParkingDetailModalProps) {
  const detailQuery = useParkingReservationDetail(
    open ? (reservationId ?? 0) : 0,
  );

  if (!open) return null;

  const detail = detailQuery.data as ReservationDetailResponse | undefined;
  const reservation = detail?.reservation;
  const parkingLot = detail?.projection?.parking_lot ?? null;
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
        ) : !detail || !reservation ? (
          <EmptyModal onClose={onClose} />
        ) : (
          <>
            <ParkingSummaryAside
              reservation={reservation}
              detail={detail}
              parkingLot={parkingLot}
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                    Estacionamiento
                  </p>

                  <h3 className="mt-2 truncate text-xl font-bold text-slate-950">
                    Reservación #{reservation.id}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Consulta el detalle de tu reservación y usa el QR para
                    check-in.
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
                  <MobileQrSummary
                    reservationId={reservation.id}
                    lotName={parkingLot?.name ?? null}
                  />
                </div>

                <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <section className="space-y-4">
                    <section className="border border-slate-200 bg-white p-5">
                      <h4 className="text-sm font-bold text-slate-950">
                        Información de acceso
                      </h4>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <InfoBlock
                          label="Usuario"
                          value={reservation.user_id}
                        />

                        <InfoBlock
                          label="Asignación"
                          value={reservation.allocation_state}
                        />

                        <InfoBlock
                          label="Inicio"
                          value={`${formatDate(
                            reservation.start_time,
                          )} · ${formatTime(reservation.start_time)}`}
                        />

                        <InfoBlock
                          label="Fin"
                          value={`${formatDate(
                            reservation.end_time,
                          )} · ${formatTime(reservation.end_time)}`}
                        />
                      </div>
                    </section>

                    <section className="border border-slate-200 bg-white p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-950">
                            Estado de la reservación
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            El estado se actualiza en tiempo real cuando se hace
                            check-in, check-out o se cancela la reservación.
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                          <StatusBadge
                            className={getLifecycleClassName(
                              reservation.lifecycle_status,
                            )}
                          >
                            {getLifecycleLabel(reservation.lifecycle_status)}
                          </StatusBadge>

                          <StatusBadge
                            className={getAttendanceClassName(
                              reservation.attendance_status,
                            )}
                          >
                            {getAttendanceLabel(reservation.attendance_status)}
                          </StatusBadge>
                        </div>
                      </div>
                    </section>
                  </section>

                  <aside className="hidden border border-slate-200 bg-slate-50 p-5 lg:block">
                    <QrPanel reservationId={reservation.id} />
                  </aside>
                </div>
              </main>

              <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-500">
                  Presenta este QR al llegar al estacionamiento.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cerrar
                </button>
              </footer>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ParkingSummaryAside({
  reservation,
  detail,
  parkingLot,
}: {
  reservation: ReservationDetailResponse["reservation"];
  detail: ReservationDetailResponse;
  parkingLot: ReservationDetailResponse["projection"] extends infer Projection
    ? Projection extends { parking_lot: infer Lot }
      ? Lot | null
      : null
    : null;
}) {
  return (
    <aside className="hidden w-[340px] shrink-0 border-r border-slate-200 bg-slate-50 lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
          Check-in
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
          Parking QR
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Escanea este código para validar la reservación.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
        <section className="border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Car size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Lote asignado
              </p>

              <p className="mt-1 truncate text-lg font-bold text-slate-950">
                {parkingLot?.name ? `Lote ${parkingLot.name}` : "Sin lote"}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-400">
                Reservación #{reservation.id}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            icon={<MapPin size={16} />}
            label="Slot"
            value={
              detail.projection?.slot_index !== null &&
              detail.projection?.slot_index !== undefined
                ? String(detail.projection.slot_index + 1)
                : "—"
            }
            helper="asignado"
          />

          <MetricCard
            icon={<QrCode size={16} />}
            label="FIFO"
            value={String(detail.projection?.fifo_position ?? "—")}
            helper="posición"
          />
        </section>

        <section className="mt-4 border border-slate-200 bg-white p-5">
          <SummaryBlock
            icon={<Clock size={17} />}
            label="Horario"
            value={`${formatTime(reservation.start_time)} – ${formatTime(
              reservation.end_time,
            )}`}
            helper={formatDate(reservation.start_time)}
          />
        </section>
      </div>
    </aside>
  );
}

function MobileQrSummary({
  reservationId,
  lotName,
}: {
  reservationId: number;
  lotName: string | null;
}) {
  return (
    <section className="border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Car size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              Check-in
            </p>

            <h4 className="mt-1 truncate text-base font-bold text-slate-950">
              {lotName ? `Lote ${lotName}` : "Estacionamiento"}
            </h4>

            <p className="text-sm text-slate-500">
              Reservación #{reservationId}
            </p>
          </div>
        </div>

        <div className="flex justify-center sm:shrink-0">
          <ParkingReservationQr reservationId={reservationId} size={132} />
        </div>
      </div>
    </section>
  );
}

function QrPanel({ reservationId }: { reservationId: number }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
          <QrCode className="size-4" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-950">Código QR</h3>

          <p className="text-xs text-slate-400">Para check-in</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center bg-white">
        <ParkingReservationQr reservationId={reservationId} size={190} />
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Escanea para abrir el flujo de validación.
      </p>
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

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">{helper}</p>
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
        eyebrow="Estacionamiento"
        title="Cargando reservación..."
        description="Estamos preparando el detalle de tu reservación."
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
        eyebrow="Estacionamiento"
        title="No se pudo cargar"
        description="Ocurrió un problema al consultar la reservación."
        onClose={onClose}
      />

      <div className="p-6">
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          No se pudo cargar el detalle de la reservación de parking.
        </div>
      </div>
    </div>
  );
}

function EmptyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ModalHeader
        eyebrow="Estacionamiento"
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
