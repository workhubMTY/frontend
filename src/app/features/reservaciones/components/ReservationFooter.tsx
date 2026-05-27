import { cn } from "../lib/cn";

type ReservationFooterProps = {
  selectedCount: number;
  activeSavedBlocksCount: number;
  pendingBlocksCount: number;
  savedEditsCount?: number;
  hasBlockingSpaceConflict: boolean;
  canSaveChanges: boolean;
  canContinue: boolean;
  onCancel?: () => void;
  onSaveChanges: () => void;
  onContinue: () => void;
};

export function ReservationFooter({
  selectedCount,
  activeSavedBlocksCount,
  pendingBlocksCount,
  savedEditsCount = 0,
  hasBlockingSpaceConflict,
  canSaveChanges,
  canContinue,
  onCancel,
  onSaveChanges,
  onContinue,
}: ReservationFooterProps) {
  const statusMessage = hasBlockingSpaceConflict
    ? "No puedes continuar: un horario empalma con el espacio ocupado"
    : pendingBlocksCount > 0 || savedEditsCount > 0
      ? "Hay cambios listos para guardar"
      : selectedCount > 0
        ? "Sin empalmes bloqueantes con el espacio"
        : "Selecciona un día o agrega un horario nuevo para continuar";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Resumen de cambios
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span>
              <strong className="font-semibold text-slate-900">
                {selectedCount}
              </strong>{" "}
              días seleccionados
            </span>

            <span className="hidden text-slate-300 sm:inline">|</span>

            <span>
              <strong className="font-semibold text-slate-900">
                {activeSavedBlocksCount}
              </strong>{" "}
              horarios guardados del día activo
            </span>

            <span className="hidden text-slate-300 sm:inline">|</span>

            <span>
              <strong className="font-semibold text-slate-900">
                {pendingBlocksCount}
              </strong>{" "}
              horarios por aplicar
            </span>

            <span className="hidden text-slate-300 sm:inline">|</span>

            <span>
              <strong className="font-semibold text-slate-900">
                {savedEditsCount}
              </strong>{" "}
              días editados
            </span>
          </div>

          <p
            className={cn(
              "mt-2 text-xs",
              hasBlockingSpaceConflict || !canContinue
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
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSaveChanges}
            disabled={!canSaveChanges}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            {hasBlockingSpaceConflict ? "Ajusta empalmes" : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            title={
              hasBlockingSpaceConflict
                ? "Hay empalmes con el espacio ocupado. Ajusta los horarios antes de continuar."
                : !canContinue
                  ? "Selecciona un día o agrega un horario nuevo para continuar."
                  : "Continuar a la siguiente página"
            }
            className="rounded-xl bg-violet-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Continuar
          </button>
        </div>
      </div>
    </section>
  );
}
