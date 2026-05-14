import { useEffect, useMemo } from "react";
import type {
  ReservableSpace,
  SpaceStatus,
} from "../../types/reservableSpaces";
import { useSvgInteractionState } from "../../hooks/useSvgInteractionState";
import SvgViewer from "./InteractiveSvgViewer";

type FloorMapCardProps = {
  spaces: ReservableSpace[];
  selectedSpaceId?: string;
  onSelectSpace: (spaceId: string) => void;
};

function getReservedSpaceIds(spaces: ReservableSpace[]) {
  return spaces
    .filter((space) => space.status === "occupied")
    .map((space) => space.id);
}

function getHighlightedSpaceIds(spaces: ReservableSpace[]) {
  return spaces
    .filter((space) => space.status === "soon" || space.status === "partial")
    .map((space) => space.id);
}

function canSelectSpace(status: SpaceStatus) {
  return status !== "occupied";
}

export function FloorMapCard({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}: FloorMapCardProps) {
  const reservedIds = useMemo(() => getReservedSpaceIds(spaces), [spaces]);

  const highlightedIds = useMemo(
    () => getHighlightedSpaceIds(spaces),
    [spaces],
  );

  const disabledIds = useMemo(() => reservedIds, [reservedIds]);

  const {
    selectedId,
    hoveredId,
    highlightedIds: currentHighlightedIds,
    disabledIds: currentDisabledIds,
    reservedIds: currentReservedIds,
    setSelectedId,
    setHoveredId,
    setHighlightedIds,
    setDisabledIds,
    setReservedIds,
  } = useSvgInteractionState({
    defaultSelectedId: selectedSpaceId ?? null,
    defaultHighlightedIds: highlightedIds,
    defaultDisabledIds: disabledIds,
    defaultReservedIds: reservedIds,
  });

  useEffect(() => {
    setSelectedId(selectedSpaceId ?? null);
  }, [selectedSpaceId, setSelectedId]);

  useEffect(() => {
    setHighlightedIds(highlightedIds);
    setDisabledIds(disabledIds);
    setReservedIds(reservedIds);
  }, [
    highlightedIds,
    disabledIds,
    reservedIds,
    setHighlightedIds,
    setDisabledIds,
    setReservedIds,
  ]);

  const handleSelectSpace = (spaceId: string) => {
    const selectedSpace = spaces.find((space) => space.id === spaceId);

    if (!selectedSpace) {
      return;
    }

    if (!canSelectSpace(selectedSpace.status)) {
      return;
    }

    setSelectedId(spaceId);
    onSelectSpace(spaceId);
  };

  return (
    <section className="min-h-[560px] border border-slate-200 bg-container p-4 shadow-sm md:p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Mapa 2D</h2>

          <p className="mt-1 text-sm text-slate-500">
            Selecciona un espacio en el mapa para ver su disponibilidad.
          </p>
        </div>

        <div className="inline-grid w-fit grid-cols-3 overflow-hidden border border-slate-200 bg-container text-sm">
          <button className="border-r border-slate-200 bg-purple-50 px-5 py-2 font-semibold text-purple-700">
            Piso 1
          </button>

          <button className="border-r border-slate-200 px-5 py-2 text-slate-600 hover:bg-slate-50">
            Piso 2
          </button>

          <button className="px-5 py-2 text-slate-600 hover:bg-slate-50">
            Piso 3
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-200">
        <SvgViewer
          src="/final2_plain.svg"
          className="h-full w-full"
          selectedId={selectedId}
          hoveredId={hoveredId}
          highlightedIds={currentHighlightedIds}
          disabledIds={currentDisabledIds}
          reservedIds={currentReservedIds}
          onSelectId={handleSelectSpace}
          onHoveredIdChange={setHoveredId}
        />
      </div>
    </section>
  );
}
