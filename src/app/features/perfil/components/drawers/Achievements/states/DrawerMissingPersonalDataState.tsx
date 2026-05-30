import { Trophy, X } from "lucide-react";

type DrawerMissingPersonalDataStateProps = {
  onClose: () => void;
};

export function DrawerMissingPersonalDataState({
  onClose,
}: DrawerMissingPersonalDataStateProps) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-neutral-100 px-8 py-6">
      <div>
        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-neutral-700" />

          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            Logros
          </h2>
        </div>

        <p className="mt-2 text-sm text-neutral-500">
          No se pudieron cargar tus logros personales.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="grid h-9 w-9 shrink-0 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="Cerrar drawer"
      >
        <X size={20} />
      </button>
    </header>
  );
}