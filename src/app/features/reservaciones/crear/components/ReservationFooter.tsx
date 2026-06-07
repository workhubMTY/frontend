import { cn } from "../../../../shared/lib/cn";

type ReservationFooterProps = {
  selectedCount: number;
  proposedBlocksCount: number;
  hasBlockingConflict: boolean;
  canContinue: boolean;
  onCancel?: () => void;
  onContinue: () => void;
};

export function ReservationFooter({
  selectedCount,
  proposedBlocksCount,
  hasBlockingConflict,
  canContinue,
  onCancel,
  onContinue,
}: ReservationFooterProps) {
  const hasSelectedDates = selectedCount > 0;
  const hasProposedBlocks = proposedBlocksCount > 0;

  const statusMessage = hasBlockingConflict
    ? "No puedes continuar: un horario empalma con una reservación existente."
    : !hasSelectedDates
      ? "Selecciona al menos un día para continuar."
      : !hasProposedBlocks
        ? "Agrega al menos un horario para continuar."
        : "Tu reservación está lista para revisar.";

  return (
    <section className="flex-1 border border-grid-lines bg-white p-4 flex-1">
      <div className="flex flex-col h-full gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col h-full justify-between">
          <p className="text-md font-semibold text-slate-900">
            Resumen de reservación
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span>
              <strong className="font-semibold text-slate-900">
                {selectedCount}
              </strong>{" "}
              día{selectedCount === 1 ? "" : "s"} seleccionado
              {selectedCount === 1 ? "" : "s"}
            </span>

            <span className="hidden text-slate-300 sm:inline">|</span>

            <span>
              <strong className="font-semibold text-slate-900">
                {proposedBlocksCount}
              </strong>{" "}
              horario{proposedBlocksCount === 1 ? "" : "s"} propuesto
              {proposedBlocksCount === 1 ? "" : "s"}
            </span>
          </div>

          <p
            className={cn(
              "mt-2 text-xs",
              hasBlockingConflict || !canContinue
                ? "font-semibold text-red-600"
                : "text-slate-500",
            )}
          >
            {statusMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-grid-lines bg-white px-5 py-2.5 text-sm font-semibold text-on-container hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            title={
              hasBlockingConflict
                ? "Hay empalmes con una reservación existente. Ajusta los horarios antes de continuar."
                : !hasSelectedDates
                  ? "Selecciona al menos un día para continuar."
                  : !hasProposedBlocks
                    ? "Agrega al menos un horario para continuar."
                    : "Continuar a la confirmación"
            }
            className="bg-violet-700 px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Continuar
          </button>
        </div>
      </div>
    </section>
  );
}