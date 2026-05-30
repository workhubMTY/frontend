import { UsersRound } from "lucide-react";

export function TeamsEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center bg-purple-50 text-purple-700">
        <UsersRound size={25} />
      </div>

      <h3 className="text-lg font-semibold text-neutral-950">
        No se encontraron equipos
      </h3>

      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        Intenta buscar con otro nombre.
      </p>
    </div>
  );
}