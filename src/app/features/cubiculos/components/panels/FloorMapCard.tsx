import type { OfficeSlotSummary } from "../../data/types";
import InteractiveSvgViewer from "./InteractiveSvgViewer";
import type { FloorOption } from "@/app/features/cubiculos/constants/floors";

type FloorMapCardProps = {
  spaces: OfficeSlotSummary[];
  isLoading?: boolean;

  floors: FloorOption[];
  selectedFloorCode: string;
  onChangeFloorCode: (floorCode: string) => void;

  selectedMapId: string | null;
  availableMapIds?: string[];
  reservedMapIds?: string[];
  disabledMapIds?: string[];
  onSelectMapId: (mapId: string) => void;
};

export function FloorMapCard({
  isLoading = false,
  floors,
  selectedFloorCode,
  onChangeFloorCode,
  selectedMapId,
  disabledMapIds = [],
  onSelectMapId,
}: FloorMapCardProps) {
  const selectedFloor =
    floors.find((floor) => floor.code === selectedFloorCode) ?? floors[0];

  return (
    <section className="overflow-hidden border border-slate-200 bg-container">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Mapa de espacios
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Selecciona un piso y después un espacio desde el mapa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-xs font-medium text-slate-500">
              Buscando...
            </span>
          ) : null}

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            Piso

            <select
              value={selectedFloorCode}
              onChange={(event) => onChangeFloorCode(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-primary-2 focus:ring-2 focus:ring-purple-100"
            >
              {floors.map((floor) => (
                <option key={floor.code} value={floor.code}>
                  {floor.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="min-h-[520px] p-4">
        <InteractiveSvgViewer
          src={selectedFloor.mapSrc}
          selectedId={selectedMapId}
          disabledIds={disabledMapIds}
          onSelectId={onSelectMapId}
          className="h-full min-h-[520px] bg-white"
        />
      </div>
    </section>
  );
}