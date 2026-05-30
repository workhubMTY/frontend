import { Search, X } from "lucide-react";

type TeamsListHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
};

export function TeamsListHeader({
  search,
  onSearchChange,
  onClose,
}: TeamsListHeaderProps) {
  return (
    <header className="border-b border-neutral-100 px-8 py-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            Todos los equipos
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Consulta tus equipos y abre solo el que quieras revisar.
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

      <div className="relative mt-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar equipo"
          className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
      </div>
    </header>
  );
}