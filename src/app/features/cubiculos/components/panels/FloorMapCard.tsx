"use client";

import { ReservableSpace } from "../../types/reservableSpaces";
import InteractiveSvgViewer from "./InteractiveSvgViewer";

type FloorMapCardProps = {
  spaces: ReservableSpace[];
  isLoading?: boolean;
  selectedMapId: string | null;
  availableMapIds: string[];
  reservedMapIds: string[];
  disabledMapIds: string[];
  onSelectMapId: (mapId: string) => void;
};

export function FloorMapCard({
  isLoading = false,
  selectedMapId,
  availableMapIds,
  reservedMapIds,
  disabledMapIds,
  onSelectMapId,
}: FloorMapCardProps) {
  return (
    <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-950">
            Mapa de espacios
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Selecciona un espacio disponible desde el mapa.
          </p>
        </div>

        {isLoading ? (
          <span className="text-xs font-medium text-neutral-500">
            Buscando...
          </span>
        ) : null}
      </header>

      <div className="min-h-[520px] p-4">
        <InteractiveSvgViewer
          src="/planta-baja-original-with-selection-boxes.svg"
          selectedId={selectedMapId}
          highlightedIds={availableMapIds}
          reservedIds={reservedMapIds}
          disabledIds={disabledMapIds}
          onSelectId={onSelectMapId}
          className="h-full min-h-[520px] bg-white"
        />
      </div>
    </section>
  );
}
