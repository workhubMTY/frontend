import { Clock3, GripVertical, Plus, Settings, Trash2 } from "lucide-react";

import type { TimeBlock } from "../types/reservaciones";
import { blockHasConflict } from "../lib/conflicts";
import { cn } from "../lib/cn";
import { Card } from "./Card";

type ProposedSchedulesCardProps = {
  activeDayId: string;
  activeBlocks: TimeBlock[];
  pendingBlocks: TimeBlock[];
  onAddPendingBlock: () => void;
  onDeletePendingBlock: (blockId: string) => void;
  onDeleteSavedBlock: (dateId: string, blockId: string) => void;
  onTogglePendingBlockScope: (blockId: string) => void;
  onUpdatePendingBlock: (
    blockId: string,
    field: "start" | "end",
    value: string,
  ) => void;
  onUpdateSavedBlock: (
    dateId: string,
    blockId: string,
    field: "start" | "end",
    value: string,
  ) => void;
};

export function ProposedSchedulesCard({
  activeDayId,
  activeBlocks,
  pendingBlocks,
  onAddPendingBlock,
  onDeletePendingBlock,
  onDeleteSavedBlock,
  onTogglePendingBlockScope,
  onUpdatePendingBlock,
  onUpdateSavedBlock,
}: ProposedSchedulesCardProps) {
  const allBlocks = [...activeBlocks, ...pendingBlocks];

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
            Los guardados ya existen en el día activo; también puedes editarlos
            y guardar esos cambios.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        {activeBlocks.length === 0 && pendingBlocks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Este día todavía no tiene horarios guardados.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Agrega un horario para crear bloques en los días seleccionados.
            </p>
          </div>
        )}

        {activeBlocks.map((block) => {
          const blockConflict =
            block.conflict || blockHasConflict(block, allBlocks);

          return (
            <div
              key={`saved-${block.id}`}
              className={cn(
                "grid grid-cols-[32px_36px_minmax(90px,1fr)_minmax(120px,160px)_24px_minmax(120px,160px)_40px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 last:border-b-0",
                blockConflict && "bg-red-50/70",
              )}
            >
              <GripVertical className="h-5 w-5 text-slate-300" />
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  blockConflict ? "bg-red-500" : "bg-slate-400",
                )}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  {block.label}
                </span>

                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    blockConflict
                      ? "border-red-200 bg-red-100 text-red-700"
                      : "border-slate-200 bg-white text-slate-500",
                  )}
                >
                  {blockConflict ? "Empalme" : "Guardado"}
                </span>

                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  Editable
                </span>
              </div>
              <label className="relative">
                <input
                  value={block.start}
                  onChange={(event) =>
                    onUpdateSavedBlock(
                      activeDayId,
                      block.id,
                      "start",
                      event.target.value,
                    )
                  }
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
                  onChange={(event) =>
                    onUpdateSavedBlock(
                      activeDayId,
                      block.id,
                      "end",
                      event.target.value,
                    )
                  }
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
                onClick={() => onDeleteSavedBlock(activeDayId, block.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                title="Eliminar horario guardado"
              >
                <Trash2 className="h-4 w-4" />
              </button>{" "}
            </div>
          );
        })}

        {pendingBlocks.map((block) => {
          const blockConflict = blockHasConflict(block, allBlocks);

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
                  {blockConflict ? "Empalme" : "Por aplicar"}
                </span>

                <button
                  type="button"
                  onClick={() => onTogglePendingBlockScope(block.id)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition",
                    block.applyToAllSelected
                      ? "border-violet-300 bg-violet-100 text-violet-700 hover:bg-violet-200"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                  )}
                  title={
                    block.applyToAllSelected
                      ? "Se aplicará a todos los días seleccionados"
                      : "Se aplicará solo al día activo"
                  }
                >
                  {block.applyToAllSelected
                    ? "Todos los días"
                    : "Solo este día"}
                </button>
              </div>

              <label className="relative">
                <input
                  value={block.start}
                  onChange={(event) =>
                    onUpdatePendingBlock(block.id, "start", event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </label>

              <span className="text-center text-slate-400">-</span>

              <label className="relative">
                <input
                  value={block.end}
                  onChange={(event) =>
                    onUpdatePendingBlock(block.id, "end", event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </label>

              <button
                type="button"
                onClick={() => onDeletePendingBlock(block.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAddPendingBlock}
          className="flex items-center gap-2 rounded-xl border border-dashed border-violet-400 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          <Plus className="h-5 w-5" />
          Agregar horario
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-dashed border-violet-400 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          <Settings className="h-5 w-5" />
          Preconfiguración
        </button>
      </div>
    </Card>
  );
}
