// src/app/features/home/components/HomeAgendaToolbar.tsx

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type HomeAgendaToolbarProps = {
  title: string;
  subtitle: string;
  rangeLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function HomeAgendaToolbar({
  title,
  subtitle,
  rangeLabel,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: HomeAgendaToolbarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
          className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}