"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

type HomeAgendaEditModalProps = {
  open: boolean;
  item: ScheduleItem | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: {
    item: ScheduleItem;
    start: string;
    end: string;
  }) => void;
};

function canEditScheduleItem(item: ScheduleItem) {
  return (
    item.kind === "my_reservation" ||
    item.kind === "parking_reservation" ||
    item.kind === "space_reservation"
  );
}

export function HomeAgendaEditModal({
  open,
  item,
  isSubmitting = false,
  onClose,
  onSubmit,
}: HomeAgendaEditModalProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (!item) return;

    setStart(item.start);
    setEnd(item.end);
  }, [item]);

  if (!open || !item) return null;

  const isEditable = canEditScheduleItem(item);
  const hasChanges = start !== item.start || end !== item.end;
  const canSubmit = isEditable && hasChanges && start < end && !isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">
              Editar actividad
            </h2>

            <p className="mt-1 truncate text-sm text-slate-500">
              {item.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="grid size-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-4">
          {!isEditable ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Esta actividad no se puede editar desde aquí.
            </div>
          ) : null}

          <div>
            <label className="text-xs font-medium text-slate-500">
              Inicio
            </label>

            <input
              type="time"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              disabled={!isEditable || isSubmitting}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-primary-2 focus:ring-2 focus:ring-primary-2/10 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Fin</label>

            <input
              type="time"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              disabled={!isEditable || isSubmitting}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-primary-2 focus:ring-2 focus:ring-primary-2/10 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {start >= end ? (
            <p className="text-xs text-red-500">
              La hora de inicio debe ser menor que la hora final.
            </p>
          ) : null}
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit({ item, start, end })}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
              canSubmit
                ? "bg-primary-2 text-on-primary hover:bg-primary-2/90"
                : "cursor-not-allowed bg-slate-200 text-slate-400",
            )}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Guardar cambios
          </button>
        </footer>
      </div>
    </div>
  );
}