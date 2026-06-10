"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { HomeAgendaViewMode } from "../../types/homeAgenda";

import { HomeAgendaViewToggle } from "./HomeAgendaViewToggle";

type HomeAgendaToolbarProps = {
  rangeLabel: string;

  viewMode: HomeAgendaViewMode;
  onChangeViewMode: (view: HomeAgendaViewMode) => void;

  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function HomeAgendaToolbar({
  rangeLabel,

  viewMode,
  onChangeViewMode,

  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: HomeAgendaToolbarProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5">
      <HomeAgendaViewToggle
        activeView={viewMode}
        onChangeView={onChangeViewMode}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Ver rango anterior"
          className="grid size-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="min-w-[150px] text-center text-xs font-medium text-slate-500">
          {rangeLabel}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Ver rango siguiente"
          className="grid size-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}