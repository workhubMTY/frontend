import { ChevronLeft, X } from "lucide-react";

type TeamsCreateHeaderProps = {
  onBack: () => void;
  onClose: () => void;
};

export function TeamsCreateHeader({
  onBack,
  onClose,
}: TeamsCreateHeaderProps) {
  return (
    <header className="border-b border-neutral-100 px-8 py-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
          >
            <ChevronLeft size={17} />
            Volver a equipos
          </button>

          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            Crear nuevo equipo
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Crea un equipo y agrega a tus miembros.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Cerrar drawer"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}