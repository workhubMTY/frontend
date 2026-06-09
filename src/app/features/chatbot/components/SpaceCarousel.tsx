"use client";

import { useRef, useState, useCallback } from "react";
import { Users, MapPin, X, Check } from "lucide-react";
import { ShowSpaceCarouselArgs, ShowSpaceCarouselResult, SpaceCarouselItem } from "../types/chat-tools.types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: "Disponible", color: "text-emerald-600 bg-emerald-50" },
  occupied:  { label: "Ocupado",    color: "text-red-500 bg-red-50" },
  soon:      { label: "Próximo",    color: "text-amber-600 bg-amber-50" },
  blocked:   { label: "Bloqueado",  color: "text-gray-500 bg-gray-100" },
};

const CARD_WIDTH = 200; // px — kept in sync with CSS

interface Props {
  args: ShowSpaceCarouselArgs;
  onSelect: (result: ShowSpaceCarouselResult) => void;
}

interface SpaceCardProps {
  space: SpaceCarouselItem;
  onSelect: (id: number) => void;
  onCancel: () => void;
}

function SpaceCard({ space, onSelect, onCancel }: SpaceCardProps) {
  const statusInfo = STATUS_LABELS[space.status] ?? { label: space.status, color: "text-gray-500 bg-gray-100" };
  return (
    <div
      className="flex-none bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      style={{ width: CARD_WIDTH }}
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{space.name}</p>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={10} /> {space.floor}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={10} /> cap. {space.capacity}
          </span>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center py-2.5 hover:bg-red-50 transition-colors"
          title="Cancelar"
        >
          <X size={14} className="text-red-400" />
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => onSelect(space.id)}
          className="flex-1 flex items-center justify-center py-2.5 hover:bg-emerald-50 transition-colors"
          title="Seleccionar"
        >
          <Check size={14} className="text-emerald-500" />
        </button>
      </div>
    </div>
  );
}

export default function SpaceCarousel({ args, onSelect }: Props) {
  const { context } = args;
  const [resolved, setResolved] = useState(false);

  // Sort spaces by name (code) ascending
  const spaces = [...args.spaces].sort((a, b) =>
    a.name.localeCompare(b.name, "es", { numeric: true }),
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  // Mouse drag-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft ?? 0);
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }, []);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  if (resolved) return null;

  const handleSelect = (id: number) => {
    setResolved(true);
    onSelect({ selected_id: id });
  };

  const handleCancel = () => {
    setResolved(true);
    onSelect({ selected_id: null });
  };

  return (
    <div className="mt-1 w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 font-medium">
          <span className="text-violet-600">{context}</span>
          {" · "}{spaces.length} espacio{spaces.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={handleCancel}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-1"
        >
          Cancelar
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onSelect={handleSelect}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {spaces.length > 2 && (
        <p className="text-[10px] text-gray-400 text-center mt-0.5">
          Desliza para ver más · {spaces.length} en total
        </p>
      )}
    </div>
  );
}
