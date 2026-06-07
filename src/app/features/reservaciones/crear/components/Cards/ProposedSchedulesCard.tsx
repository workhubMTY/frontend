"use client";

import { Clock3, GripVertical, Plus, Trash2 } from "lucide-react";

import type { TimeBlock } from "../../types/reservaciones";
import { blockHasConflict } from "../../lib/conflicts";
import { cn } from "../../../../../shared/lib/cn";
import { Card } from "@/app/shared/components/Card";
import {
  isValidTimeRange,
  normalizeTimeInput,
  parseTimeToMinutes,
} from "@/app/features/reservaciones/crear/lib/time";

type ProposedSchedulesCardProps = {
  proposedBlocks: TimeBlock[];
  selectedDateCount: number;
  hasSelectedDates: boolean;
  onAddBlock: () => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock: (
    blockId: string,
    field: "start" | "end",
    value: string,
  ) => void;
};

export function ProposedSchedulesCard({
  proposedBlocks,
  selectedDateCount,
  hasSelectedDates,
  onAddBlock,
  onDeleteBlock,
  onUpdateBlock,
}: ProposedSchedulesCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-950">
              Horarios propuestos
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Estos horarios se aplicarán a los días seleccionados cuando
            continúes con la reservación.
          </p>

          <p className="mt-2 text-xs font-semibold text-slate-500">
            {hasSelectedDates
              ? `${selectedDateCount} día${
                  selectedDateCount === 1 ? "" : "s"
                } seleccionado${selectedDateCount === 1 ? "" : "s"}`
              : "Selecciona al menos un día para continuar"}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddBlock}
          className="inline-flex items-center gap-2 bg-violet-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-800"
        >
          <Plus className="h-4 w-4" />
          Agregar horario
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        {proposedBlocks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Todavía no has agregado horarios
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Agrega un horario para crear bloques en los días seleccionados.
            </p>
          </div>
        )}

        {proposedBlocks.map((block) => {
          const blockConflict = blockHasConflict(block, proposedBlocks);

          return (
            <div
              key={block.id}
              className={cn(
                "grid grid-cols-[32px_36px_minmax(90px,1fr)_minmax(120px,160px)_24px_minmax(120px,160px)_40px] items-center gap-3 border-b border-violet-100 bg-violet-50/40 px-4 py-3 last:border-b-0",
                blockConflict && "border-red-200 bg-red-50/80",
              )}
            >
              <GripVertical className="h-5 w-5 text-slate-400" />

              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  blockConflict ? "bg-red-500" : "bg-violet-600",
                )}
              />

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-violet-700">
                  {block.label}
                </span>

                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    blockConflict
                      ? "border-red-200 bg-red-100 text-red-700"
                      : "border-violet-200 bg-white text-violet-700",
                  )}
                >
                  {blockConflict ? "Empalme" : "Propuesto"}
                </span>
              </div>

              <label className="relative">
                <input
                  value={block.start}
                  placeholder="7am / 7:00"
                  inputMode="text"
                  onChange={(event) =>
                    onUpdateBlock(block.id, "start", event.target.value)
                  }
                  onBlur={(event) => {
                    const normalizedTime = normalizeTimeInput(
                      event.target.value,
                    );

                    if (normalizedTime) {
                      onUpdateBlock(block.id, "start", normalizedTime);
                    }
                  }}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-white px-3 pr-9 text-sm font-medium outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
                    blockConflict
                      ? "border-red-200 text-red-700"
                      : "border-slate-200 text-slate-700",
                  )}
                />
                <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </label>

              <span className="text-center text-slate-400">-</span>

              <label className="relative">
                <input
                  value={block.end}
                  placeholder="7:25pm / 17:00"
                  inputMode="text"
                  onChange={(event) =>
                    onUpdateBlock(block.id, "end", event.target.value)
                  }
                  onBlur={(event) => {
                    const normalizedTime = normalizeTimeInput(
                      event.target.value,
                    );

                    if (normalizedTime) {
                      onUpdateBlock(block.id, "end", normalizedTime);
                    }
                  }}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-white px-3 pr-9 text-sm font-medium outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
                    blockConflict
                      ? "border-red-200 text-red-700"
                      : "border-slate-200 text-slate-700",
                  )}
                />
                <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </label>

              <button
                type="button"
                onClick={() => onDeleteBlock(block.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                title="Eliminar horario"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
