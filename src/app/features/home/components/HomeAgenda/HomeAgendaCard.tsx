"use client";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "../../types/homeAgenda";

import { HomeAgendaTimeline } from "./HomeAgendaTimeline";
import { HomeAgendaToolbar } from "./HomeAgendaToolbar";

type HomeAgendaCardProps = {
  title: string;
  subtitle: string;
  rangeLabel: string;

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
        title={title}
        subtitle={subtitle}
        rangeLabel={rangeLabel}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <HomeAgendaTimeline
        days={days}
        itemsByDate={itemsByDate}
        disabledDateIds={disabledDateIds}
        isLoading={isLoading}
      />
    </section>
  );
}