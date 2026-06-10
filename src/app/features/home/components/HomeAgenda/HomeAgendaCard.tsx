"use client";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type {
  HomeAgendaDay,
  HomeAgendaViewMode,
} from "../../types/homeAgenda";

import { HomeAgendaList } from "./List/HomeAgendaList";
import { HomeAgendaTimeline } from "./Timeline/HomeAgendaTimeline";
import { HomeAgendaToolbar } from "./HomeAgendaToolbar";

type HomeAgendaCardProps = {
  rangeLabel: string;

  viewMode: HomeAgendaViewMode;
  onChangeViewMode: (view: HomeAgendaViewMode) => void;

  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds: string[];

  canGoPrevious: boolean;
  canGoNext: boolean;

  isLoading?: boolean;

  onPrevious: () => void;
  onNext: () => void;
};

export function HomeAgendaCard({
  rangeLabel,

  viewMode,
  onChangeViewMode,

  days,
  itemsByDate,
  disabledDateIds,

  canGoPrevious,
  canGoNext,

  isLoading = false,

  onPrevious,
  onNext,
}: HomeAgendaCardProps) {
  return (
    <section className="flex min-h-0 max-h-[640px] overflow-hidden border border-grid-lines bg-container">
      <div className="flex min-w-0 flex-1 flex-col">
        <HomeAgendaToolbar
          rangeLabel={rangeLabel}
          viewMode={viewMode}
          onChangeViewMode={onChangeViewMode}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={onPrevious}
          onNext={onNext}
        />

        <div className="min-h-0 flex-1 overflow-hidden">
          {viewMode === "agenda" ? (
            <HomeAgendaTimeline
              days={days}
              itemsByDate={itemsByDate}
              disabledDateIds={disabledDateIds}
              isLoading={isLoading}
            />
          ) : (
            <HomeAgendaList
              days={days}
              itemsByDate={itemsByDate}
              disabledDateIds={disabledDateIds}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </section>
  );
}