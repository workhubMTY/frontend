"use client";

import { useMemo } from "react";

import { CapacityBarsRow } from "./layout/CapacityBarsRow";
import { SelectedBlocksRow } from "./layout/SelectedBlocksRow";
import { TimelineHeader } from "./layout/TimelineHeader";
import { TimelineLegend } from "./layout/TimelineLegend";
import { createCapacityBars } from "./utils";
import type { ParkingCapacityTimelineCardProps } from "./types";

export function ParkingCapacityTimelineCard({
  capacity,
  blocks,
  buckets = [],
  highOccupationThreshold = 0.75,
  conflictRanges = [],
}: ParkingCapacityTimelineCardProps) {
  const capacityBars = useMemo(
    () =>
      createCapacityBars({
        buckets,
        capacity,
        highOccupationThreshold,
      }),
    [buckets, capacity, highOccupationThreshold],
  );

  return (
    <section className="border border-grid-lines bg-white p-5">
      <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Cajones ocupados a lo largo del día
          </h2>
        </div>

        <TimelineLegend />
      </header>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[920px]">
          <TimelineHeader />

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <CapacityBarsRow capacity={capacity} bars={capacityBars} />

            <SelectedBlocksRow
              blocks={blocks}
              conflictRanges={conflictRanges}
            />
          </div>
        </div>
      </div>
    </section>
  );
}