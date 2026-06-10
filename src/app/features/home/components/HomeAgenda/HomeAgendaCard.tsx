"use client";

import { useState } from "react";

import { cn } from "@/app/shared/lib/cn";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type {
  HomeAgendaDay,
  HomeAgendaViewMode,
} from "../../types/homeAgenda";

import { HomeAgendaList } from "./List/HomeAgendaList";
import { HomeAgendaTimeline } from "./Timeline/HomeAgendaTimeline";
import { HomeAgendaToolbar } from "./HomeAgendaToolbar";
import { HomeAgendaReservationDetailModal } from "./HomeAgendaReservationDetailModal";
import { getOfficeReservationDetailId } from "./HomeAgendaSelectionUtils";

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
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);

  function handleSelectItem(item: ScheduleItem) {
    const reservationId = getOfficeReservationDetailId(item);

    if (reservationId === null) {
      return;
    }

    setSelectedReservationId(reservationId);
  }

  function closeReservationDetail() {
    setSelectedReservationId(null);
  }

  return (
    <>
      <section
        className={cn(
          "flex min-h-0 overflow-hidden border border-grid-lines bg-container",
          viewMode === "list" ? "max-h-[640px]" : "h-full",
        )}
      >
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
                onSelectItem={handleSelectItem}
              />
            ) : (
              <HomeAgendaList
                days={days}
                itemsByDate={itemsByDate}
                disabledDateIds={disabledDateIds}
                isLoading={isLoading}
                onSelectItem={handleSelectItem}
              />
            )}
          </div>
        </div>
      </section>

      <HomeAgendaReservationDetailModal
        open={selectedReservationId !== null}
        reservationId={selectedReservationId}
        onClose={closeReservationDetail}
      />
    </>
  );
}