
import { OfficeSlot } from "../../data/types";
import InteractiveSvgViewer from "./InteractiveSvgViewer";

type FloorMapCardProps = {
  spaces: OfficeSlot[];
  isLoading?: boolean;
  selectedMapId: string | null;
  availableMapIds?: string[];
  reservedMapIds?: string[];
  disabledMapIds?: string[];
  onSelectMapId: (mapId: string) => void;
};

export function FloorMapCard({
  isLoading = false,
  selectedMapId,
  disabledMapIds = [],
  onSelectMapId,
}: FloorMapCardProps) {
  return (
    <section className="overflow-hidden border border-slate-200 bg-container ">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Mapa de espacios
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecciona un espacio desde el mapa.
          </p>
        </div>

        {isLoading ? (
          <span className="text-xs font-medium text-slate-500">
            Buscando...
          </span>
        ) : null}
      </header>

      <div className="min-h-[520px] p-4">
        <InteractiveSvgViewer
          src="/maps/planta-baja.svg"
          selectedId={selectedMapId}
          disabledIds={disabledMapIds}
          onSelectId={onSelectMapId}
          className="h-full min-h-[520px] bg-white"
        />
      </div>
    </section>
  );
}
