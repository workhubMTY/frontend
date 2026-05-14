import { ChevronRight, UsersRound } from "lucide-react";
import type {
  ReservableSpace,
  SpaceStatus,
} from "../../types/reservableSpaces";

type SpacesResultsListProps = {
  spaces: ReservableSpace[];
  selectedSpaceId?: string;
  onSelectSpace: (spaceId: string) => void;
};

function getStatusColor(status: SpaceStatus) {
  if (status === "available") return "text-green-600";
  if (status === "occupied") return "text-red-600";
  if (status === "soon") return "text-orange-500";
  return "text-blue-600";
}

function getStatusDot(status: SpaceStatus) {
  if (status === "available") return "bg-green-500";
  if (status === "occupied") return "bg-red-500";
  if (status === "soon") return "bg-orange-500";
  return "bg-blue-500";
}

export function SpacesResultsList({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}: SpacesResultsListProps) {
  return (
    <section className="border border-slate-200 bg-container p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">
        Espacios encontrados
      </h2>

      <div className="mt-4 space-y-2">
        {spaces.map((space) => {
          const isSelected = selectedSpaceId === space.id;

          return (
            <button
              key={space.id}
              type="button"
              onClick={() => onSelectSpace(space.id)}
              className={[
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <div
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                  isSelected
                    ? "bg-purple-100 text-purple-700"
                    : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                <UsersRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "truncate text-sm font-semibold",
                    isSelected ? "text-purple-700" : "text-slate-950",
                  ].join(" ")}
                >
                  {space.displayName}
                </p>

                <p className="text-xs text-slate-500">
                  {space.capacity} personas
                </p>
              </div>

              <div
                className={[
                  "hidden items-center gap-2 text-xs font-semibold sm:flex",
                  getStatusColor(space.status),
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    getStatusDot(space.status),
                  ].join(" ")}
                />
                {space.statusLabel}
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" />
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Mostrando {spaces.length} de {spaces.length} espacios
      </p>
    </section>
  );
}
