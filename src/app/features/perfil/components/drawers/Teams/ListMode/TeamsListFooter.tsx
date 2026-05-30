import { UsersRound } from "lucide-react";

type TeamsListFooterProps = {
  onCreateMode: () => void;
};

export function TeamsListFooter({ onCreateMode }: TeamsListFooterProps) {
  return (
    <footer className="border-t border-neutral-100 px-8 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <UsersRound size={21} className="text-purple-700" />

          <div>
            <p className="text-sm font-semibold text-neutral-950">
              Crear o unirse a un equipo
            </p>

            <p className="text-sm text-neutral-500">
              Busca equipos disponibles o crea uno nuevo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateMode}
          className="inline-flex h-10 items-center justify-center bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800"
        >
          Crear / Unirse
        </button>
      </div>
    </footer>
  );
}