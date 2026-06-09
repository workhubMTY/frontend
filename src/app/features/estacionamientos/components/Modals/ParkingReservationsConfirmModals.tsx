"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Car,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { TimeBlock } from "@/app/features/reservaciones/crear/types/reservaciones";

type ParkingReservationConfirmModalProps = {
  open: boolean;
  selectedDateIds: string[];
  blocks: TimeBlock[];
  hasConflict?: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ParkingReservationConfirmModal({
  open,
  selectedDateIds,
  blocks,
  hasConflict = false,
  isSubmitting = false,
  onClose,
  onConfirm,
}: ParkingReservationConfirmModalProps) {
  if (!open) return null;

  const totalReservations = selectedDateIds.length * blocks.length;

  const canConfirm =
    !isSubmitting &&
    !hasConflict &&
    selectedDateIds.length > 0 &&
    blocks.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section className="grid min-h-[88vh] w-full max-w-5xl overflow-hidden bg-white shadow-2xl lg:grid-cols-[330px_minmax(0,1fr)]">
        <ParkingReservationSummaryAside
          selectedDateCount={selectedDateIds.length}
          blockCount={blocks.length}
          totalReservations={totalReservations}
          hasConflict={hasConflict}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Confirmar estacionamiento
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Revisa los días y horarios seleccionados antes de crear tus
                reservaciones.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {hasConflict ? (
              <div className="mb-5 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-semibold">
                    Hay un empalme con una reservación tuya.
                  </p>

                  <p className="mt-1 leading-5">
                    Ajusta tus días u horarios antes de continuar.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <DetailSection
                icon={<CalendarDays className="h-4 w-4" />}
                title="Días seleccionados"
                description={`${selectedDateIds.length} día${
                  selectedDateIds.length === 1 ? "" : "s"
                }`}
              >
                {selectedDateIds.length > 0 ? (
                  <SelectedDatesSummary selectedDateIds={selectedDateIds} />
                ) : (
                  <EmptyDetailMessage>
                    No hay días seleccionados.
                  </EmptyDetailMessage>
                )}
              </DetailSection>

              <DetailSection
                icon={<Clock className="h-4 w-4" />}
                title="Horarios por día"
                description={`${blocks.length} bloque${blocks.length === 1 ? "" : "s"}`}
              >
                {blocks.length > 0 ? (
                  <ScheduleBlocksSummary blocks={blocks} />
                ) : (
                  <EmptyDetailMessage>
                    No hay horarios agregados.
                  </EmptyDetailMessage>
                )}
              </DetailSection>
            </div>
          </main>

          <ParkingReservationFooter
            hasConflict={hasConflict}
            isSubmitting={isSubmitting}
            canConfirm={canConfirm}
            onCancel={onClose}
            onConfirm={onConfirm}
          />
        </div>
      </section>
    </div>
  );
}

type SelectedDatesSummaryProps = {
  selectedDateIds: string[];
};

function SelectedDatesSummary({ selectedDateIds }: SelectedDatesSummaryProps) {
  const ranges = getDateRanges(selectedDateIds);

  const firstDate = selectedDateIds[0];
  const lastDate = selectedDateIds[selectedDateIds.length - 1];

  return (
    <div className="space-y-4">


      <div className="border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Rango de días
          </p>

          <span className="text-xs font-semibold text-slate-500">
            {ranges.length} grupo{ranges.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-3 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
          {ranges.map((range) => (
            <span
              key={`${range.start}-${range.end}`}
              className="inline-flex items-center border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
            >
              {formatDateRange(range.start, range.end)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type CompactDateStatProps = {
  label: string;
  value: string;
};

function CompactDateStat({ label, value }: CompactDateStatProps) {
  return (
    <div className="border border-slate-200 bg-white px-3 py-2.5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

type ParkingReservationSummaryAsideProps = {
  selectedDateCount: number;
  blockCount: number;
  totalReservations: number;
  hasConflict: boolean;
};

function ParkingReservationSummaryAside({
  selectedDateCount,
  blockCount,
  totalReservations,
  hasConflict,
}: ParkingReservationSummaryAsideProps) {
  return (
    <aside className="hidden min-h-0 border-r border-slate-200 bg-slate-50/80 px-6 py-6 lg:flex lg:flex-col">
      <div className="flex h-12 w-12 items-center justify-center bg-violet-100 text-violet-700">
        <Car className="h-6 w-6" />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
          Estacionamiento
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Resumen de tu reserva
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Se crearán reservaciones con la combinación de días y horarios que
          seleccionaste.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <SummaryItem
          label="Días"
          value={`${selectedDateCount} seleccionado${
            selectedDateCount === 1 ? "" : "s"
          }`}
        />

        <SummaryItem
          label="Horarios"
          value={`${blockCount} bloque${blockCount === 1 ? "" : "s"}`}
        />

        <SummaryItem
          label="Total"
          value={`${totalReservations} reservación${
            totalReservations === 1 ? "" : "es"
          }`}
          highlight
        />
      </div>
    </aside>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function SummaryItem({ label, value, highlight = false }: SummaryItemProps) {
  return (
    <div
      className={cn(
        " border px-4 py-3",
        highlight
          ? "border-violet-200 bg-violet-50"
          : "border-slate-200 bg-white",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          highlight ? "text-violet-700" : "text-slate-950",
        )}
      >
        {value}
      </p>
    </div>
  );
}
type DetailSectionProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

function DetailSection({
  icon,
  title,
  description,
  children,
}: DetailSectionProps) {
  return (
    <section className="overflow-hidden border border-slate-200 bg-white">
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white text-slate-600 shadow-sm">
          {icon}
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-950">{title}</h4>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}
type ScheduleBlocksSummaryProps = {
  blocks: TimeBlock[];
};

function ScheduleBlocksSummary({ blocks }: ScheduleBlocksSummaryProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 px-3 py-2.5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Bloque {index + 1}
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-950">
              {block.start} - {block.end}
            </p>
          </div>

          <Clock className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      ))}
    </div>
  );
}
type EmptyDetailMessageProps = {
  children: ReactNode;
};

function EmptyDetailMessage({ children }: EmptyDetailMessageProps) {
  return (
    <div className="flex h-full min-h-[160px] items-center justify-center  border border-dashed border-slate-300 bg-white px-4 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

type ParkingReservationFooterProps = {
  hasConflict: boolean;
  isSubmitting: boolean;
  canConfirm: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function ParkingReservationFooter({
  hasConflict,
  isSubmitting,
  canConfirm,
  onCancel,
  onConfirm,
}: ParkingReservationFooterProps) {
  return (
    <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {hasConflict ? (
          <p className="text-sm font-semibold text-orange-700">
            No puedes confirmar mientras haya empalmes.
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Se crearán las reservaciones de estacionamiento seleccionadas.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          className="inline-flex items-center justify-center gap-2 bg-primary-2 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Reservando...
            </>
          ) : (
            "Confirmar"
          )}
        </button>
      </div>
    </footer>
  );
}

function formatDateId(dateId: string) {
  return new Date(`${dateId}T00:00:00`).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
type DateRange = {
  start: string;
  end: string;
};

function getDateRanges(dateIds: string[]): DateRange[] {
  const sortedDateIds = [...dateIds].sort();

  if (sortedDateIds.length === 0) return [];

  const ranges: DateRange[] = [];

  let rangeStart = sortedDateIds[0];
  let previousDate = sortedDateIds[0];

  for (let index = 1; index < sortedDateIds.length; index++) {
    const currentDate = sortedDateIds[index];

    if (isNextDay(previousDate, currentDate)) {
      previousDate = currentDate;
      continue;
    }

    ranges.push({
      start: rangeStart,
      end: previousDate,
    });

    rangeStart = currentDate;
    previousDate = currentDate;
  }

  ranges.push({
    start: rangeStart,
    end: previousDate,
  });

  return ranges;
}

function isNextDay(previousDateId: string, currentDateId: string) {
  const previousDate = new Date(`${previousDateId}T00:00:00`);
  const currentDate = new Date(`${currentDateId}T00:00:00`);

  const nextDate = new Date(previousDate);
  nextDate.setDate(previousDate.getDate() + 1);

  return dateToComparableId(nextDate) === dateToComparableId(currentDate);
}

function dateToComparableId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatShortDate(dateId: string) {
  return new Date(`${dateId}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
  });
}

function formatDateRange(startDateId: string, endDateId: string) {
  if (startDateId === endDateId) {
    return formatDateId(startDateId);
  }

  return `${formatShortDate(startDateId)} - ${formatShortDate(endDateId)}`;
}
