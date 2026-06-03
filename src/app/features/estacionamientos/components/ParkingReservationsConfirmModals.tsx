"use client";

import { AlertTriangle, CalendarDays, Car, Clock, Loader2, X } from "lucide-react";

import { cn } from "@/app/features/reservaciones/lib/cn";
import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xl overflow-hidden border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-1">
              Confirmar reservación
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Revisa tu estacionamiento
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Se crearán las reservaciones con los días y horarios seleccionados.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          {hasConflict ? (
            <div className="flex gap-3 border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Hay un empalme con una reservación tuya.</p>
                <p className="mt-1 leading-5">
                  Ajusta tus días u horarios antes de continuar.
                </p>
              </div>
            </div>
          ) : null}
{/* 
          <SummaryRow
            icon={<Car className="h-5 w-5" />}
            label="Estacionamiento"
            value={"Estacionamiento"}
          /> */}

          <SummaryRow
            icon={<CalendarDays className="h-5 w-5" />}
            label="Días seleccionados"
            value={`${selectedDateIds.length} día${selectedDateIds.length === 1 ? "" : "s"}`}
          />

          <SummaryRow
            icon={<Clock className="h-5 w-5" />}
            label="Horarios por día"
            value={`${blocks.length} bloque${blocks.length === 1 ? "" : "s"}`}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <section className="border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Días
              </h3>

              <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                {selectedDateIds.map((dateId) => (
                  <div
                    key={dateId}
                    className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {formatDateId(dateId)}
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Horarios
              </h3>

              <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {block.start} - {block.end}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="border border-primary-1  px-4 py-3">
            <p className="text-sm text-primary-900">
              Total:{" "}
              <span className="font-semibold">
                {totalReservations} reservación{totalReservations === 1 ? "" : "es"}
              </span>
            </p>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting || hasConflict || selectedDateIds.length === 0 || blocks.length === 0}
            className={cn(
              "inline-flex items-center justify-center gap-2 bg-primary-1 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700",
              "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reservando...
              </>
            ) : (
              "Confirmar reservación"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-950">
          {value}
        </p>
      </div>
    </div>
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