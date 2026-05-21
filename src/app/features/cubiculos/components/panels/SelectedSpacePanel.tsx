import { UsersRound } from "lucide-react";
import type {
  ReservableSpace,
  SpaceStatus,
  TimelineBlock,
} from "../../types/reservableSpaces";

import { useRouter } from "next/navigation";

type SelectedSpacePanelProps = {
  selectedSpace?: ReservableSpace;
  onContinue: () => void;
};

const timelineHours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function getStatusClass(status: SpaceStatus) {
  if (status === "available")
    return "bg-green-50 text-green-700 border-green-200";
  if (status === "occupied") return "bg-red-50 text-red-700 border-red-200";
  if (status === "soon")
    return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

function getStatusDotClass(status: SpaceStatus) {
  if (status === "available") return "bg-green-500";
  if (status === "occupied") return "bg-red-500";
  if (status === "soon") return "bg-orange-500";
  return "bg-blue-500";
}

function getTimelineBlockClass(status: TimelineBlock["status"]) {
  if (status === "occupied") return "bg-slate-600";
  if (status === "search") return "border-2 border-purple-600 bg-purple-50";
  return "border border-slate-200 bg-white";
}

export function SelectedSpacePanel({
  selectedSpace,
  onContinue,
}: SelectedSpacePanelProps) {
  if (!selectedSpace) {
    return (
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Espacio seleccionado
        </h2>

        <div className="mt-6 border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-700">
            Selecciona un espacio en el mapa
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Aquí aparecerá su disponibilidad y el timeline del día.
          </p>
        </div>
      </section>
    );
  }

  const router = useRouter();

  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Espacio seleccionado
          </h2>

          <p className="mt-4 text-lg font-semibold text-purple-700">
            {`${selectedSpace.code} ${selectedSpace.name}`}
          </p>

          <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <UsersRound className="h-4 w-4" />
            {selectedSpace.capacity} personas
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold",
            getStatusClass(selectedSpace.status),
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              getStatusDotClass(selectedSpace.status),
            ].join(" ")}
          />
          {selectedSpace.statusLabel}
        </span>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="text-sm font-semibold text-slate-800">
          Ocupación del día · mié 29 de abr
        </p>

        <div className="mt-4">
          <div className="mb-2 grid grid-cols-6 text-xs text-slate-500">
            {timelineHours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>

          <div className="flex h-10 overflow-hidden rounded-md border border-slate-200">
            {selectedSpace.timeline.map((block) => (
              <div
                key={block.id}
                className={getTimelineBlockClass(block.status)}
                title={`${block.start} - ${block.end}`}
                style={{
                  flex:
                    block.status === "occupied"
                      ? 1.5
                      : block.status === "search"
                        ? 1
                        : 2,
                }}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border border-slate-300 bg-white" />
              Disponible
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-600" />
              Ocupado
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm border-2 border-purple-600 bg-purple-50" />
              Tu búsqueda
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 h-11 w-full bg-primary-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-1"
      >
        Continuar con este espacio
      </button>
    </section>
  );
}
