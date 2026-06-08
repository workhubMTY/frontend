"use client";

import { Info, Plus, Trash2 } from "lucide-react";

import type { TimeBlock } from "../../types/reservaciones";
import { blockHasConflict } from "../../lib/conflicts";
import { cn } from "../../../../../shared/lib/cn";
import { Card } from "@/app/shared/components/Card";
import {
  isValidTimeRange,
  normalizeTimeInput,
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
  const handleAddBlock = () => {
    if (!hasSelectedDates) return;
    onAddBlock();
  };

  return (
    <Card className="flex flex-col flex-1 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">Horarios</h2>

          <p className={`mt-0.5 text-xs text-${hasSelectedDates ? "slate": "red"}-500`}>
            {hasSelectedDates
              ? `${selectedDateCount} día${selectedDateCount === 1 ? "" : "s"} seleccionado${selectedDateCount === 1 ? "" : "s"}`
              : "Selecciona al menos un día"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddBlock}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 px-2.5 text-xs font-semibold shadow-sm transition",
            hasSelectedDates
              ? "bg-primary-2 text-white hover:bg-primary-1"
              : "cursor-not-allowed bg-slate-100 text-slate-400",
          )}
          title={
            hasSelectedDates
              ? "Agregar horario"
              : "Selecciona al menos un día primero"
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </button>
      </div>

      {/* {!hasSelectedDates && (
        <div className="mb-3 flex gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Info className=" h-3.5 w-3.5 shrink-0" />
          <p>Selecciona uno o más días en el calendario antes de agregar horarios.</p>
        </div>
      )} */}

      {proposedBlocks.length === 0 ? (
        <div className="rounded-lg flex-1 flex flex-col justify-center border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center">
          <p className="text-sm font-medium text-slate-700">
            No hay horarios agregados
          </p>

          <p className="text-xs leading-5 text-slate-500">
            Los horarios que agregues se aplicarán a los días seleccionados.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {proposedBlocks.map((block) => {
            const blockConflict = blockHasConflict(block, proposedBlocks);

            const hasInvalidRange =
              block.start.trim().length > 0 &&
              block.end.trim().length > 0 &&
              !isValidTimeRange(block.start, block.end);

            const hasError = blockConflict || hasInvalidRange;

            return (
              <div
                key={block.id}
                className={cn(
                  " border bg-white px-2.5 py-2 transition",
                  hasError
                    ? "border-red-200 bg-red-50/70"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_32px] items-end gap-2">
                  <label className="min-w-0">
                    <span className="mb-1 block text-[11px] font-medium text-slate-500">
                      Inicio
                    </span>

                    <input
                      value={block.start}
                      placeholder="7am"
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
                        "h-8 w-full rounded-md border bg-white px-2 text-xs font-medium outline-none transition focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/15",
                        hasError
                          ? "border-red-300 text-red-700"
                          : "border-slate-300 text-slate-800",
                      )}
                    />
                  </label>

                  <label className="min-w-0">
                    <span className="mb-1 block text-[11px] font-medium text-slate-500">
                      Fin
                    </span>

                    <input
                      value={block.end}
                      placeholder="7:25pm"
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
                        "h-8 w-full rounded-md border bg-white px-2 text-xs font-medium outline-none transition focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/15",
                        hasError
                          ? "border-red-300 text-red-700"
                          : "border-slate-300 text-slate-800",
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onDeleteBlock(block.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Eliminar horario"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {hasInvalidRange && (
                  <p className="mt-1.5 text-[11px] font-medium text-red-600">
                    La hora final debe ser mayor que la inicial.
                  </p>
                )}

                {blockConflict && (
                  <p className="mt-1.5 text-[11px] font-medium text-red-600">
                    Este horario se empalma con otro.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}