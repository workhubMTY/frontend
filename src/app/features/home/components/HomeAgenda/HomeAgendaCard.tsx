"use client";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type {
  HomeAgendaDay,
  HomeAgendaViewMode,
} from "../../types/homeAgenda";

import { HomeAgendaList } from "./HomeAgendaList";
import { HomeAgendaTimeline } from "./HomeAgendaTimeline";
import { HomeAgendaToolbar } from "./HomeAgendaToolbar";

type HomeAgendaCardProps = {
  title: string;
  subtitle: string;
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
  title,
  subtitle,
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
    <section className="flex min-h-0 flex-col border border-grid-lines bg-container">
      <HomeAgendaToolbar
        rangeLabel={rangeLabel}
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={onPrevious}
        onNext={onNext}
      />

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
    </section>
  );
}