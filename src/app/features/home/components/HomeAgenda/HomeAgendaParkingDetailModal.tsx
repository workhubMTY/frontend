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
import { AttendanceStatus, LifecycleStatus, ReservationDetailResponse } from "@/app/features/estacionamientos/data/types";


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
  const detailQuery = useParkingReservationDetail(open ? reservationId ?? 0 : 0);

  const detail = detailQuery.data as ReservationDetailResponse | undefined;
  const reservation = detail?.reservation;
  const parkingLot = detail?.projection?.parking_lot;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[1px]">
      <section className="flex max-h-[min(720px,calc(100vh-48px))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Detalle de estacionamiento
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-slate-950">
              {detailQuery.isLoading
                ? "Cargando reservación..."
                : `Reservación de parking #${reservation?.id ?? reservationId}`}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {parkingLot
                ? `Lote ${parkingLot.name}`
                : "Información del lote no disponible"}
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
          ) : !detail || !reservation ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-4">
                <section className="grid gap-3 md:grid-cols-3">
                  <DetailTile
                    icon={<Car className="size-4" />}
                    label="Lote"
                    value={parkingLot?.name ? `Lote ${parkingLot.name}` : "—"}
                    description={
                      parkingLot
                        ? `Capacidad ${parkingLot.capacity}`
                        : "Sin lote asignado"
                    }
                  />

                  <DetailTile
                    icon={<Clock className="size-4" />}
                    label="Horario"
                    value={`${formatTime(reservation.start_time)} - ${formatTime(
                      reservation.end_time,
                    )}`}
                    description={formatDate(reservation.start_time)}
                  />

                  <DetailTile
                    icon={<MapPin className="size-4" />}
                    label="Asignación"
                    value={
                      detail.projection?.slot_index !== null &&
                      detail.projection?.slot_index !== undefined
                        ? `Slot ${detail.projection.slot_index + 1}`
                        : "Sin slot"
                    }
                    description={`Posición FIFO ${
                      detail.projection?.fifo_position ?? "—"
                    }`}
                  />
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Estado de la reservación
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Consulta el estado actual de asistencia y ciclo de vida.
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
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
                  <h3 className="text-sm font-semibold text-slate-900">
                    Detalles técnicos
                  </h3>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <InfoRow label="Usuario" value={reservation.user_id} />
                    <InfoRow
                      label="Asignación"
                      value={reservation.allocation_state}
                    />
                    <InfoRow
                      label="Creada"
                      value={formatDate(reservation.created_at)}
                    />
                    <InfoRow
                      label="Actualizada"
                      value={formatDate(reservation.updated_at)}
                    />
                  </div>
                </section>
              </div>

              <aside className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <QrCode className="size-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Código QR
                    </h3>

                    <p className="text-xs text-slate-400">
                      Para check-in de parking
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <ParkingReservationQr reservationId={reservation.id} size={180} />
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-500" />

                    <p className="text-xs leading-5 text-slate-500">
                      Escanea este código para abrir el flujo de check-in de la
                      reservación de estacionamiento.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
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

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
        {value ?? "—"}
      </p>
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
      No se pudo cargar el detalle de la reservación de parking.
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