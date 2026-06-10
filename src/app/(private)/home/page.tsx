"use client";

import { HomeAgendaCard } from "@/app/features/home/components/HomeAgenda/HomeAgendaCard";
import { HomeAgendaFilters } from "@/app/features/home/components/HomeAgenda/HomeAgendaFilters";
import { HomeAgendaPeopleCard } from "@/app/features/home/components/PeopleCard/HomeAgendaPeopleCard";
import { useHomeAgendaViewModel } from "@/app/features/home/hooks/useHomeAgendaViewModel";

import { cn } from "@/app/shared/lib/cn";
import { formatAgendaRangeLabel } from "@/app/features/home/lib/homeAgenda";

export default function HomePage() {
  const { state, actions } = useHomeAgendaViewModel();

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-neutral-50 px-8 py-4">
      <div className="mb-6 flex shrink-0 items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">
            Hola, {state.user?.name ?? "usuario"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Visualiza tus contactos, reservaciones y eventos.
          </p>
        </div>

        <HomeAgendaFilters
          activeFilter={state.activeFilter}
          onChangeFilter={actions.setFilter}
        />
      </div>

      <section
        className={cn(
          "grid min-h-0 grid-cols-[260px_minmax(0,1fr)] gap-5",
          state.viewMode === "list"
            ? "h-[min(640px,calc(100vh-180px))]"
            : "flex-1",
        )}
      >
        <HomeAgendaPeopleCard
          owners={state.agendaOwners}
          selectedOwnerId={state.selectedUserId}
          isLoading={state.friendsIsLoading}
          onSelectOwner={actions.selectOwner}
        />
        <HomeAgendaCard
          rangeLabel={formatAgendaRangeLabel(state.visibleDays)}
          viewMode={state.viewMode}
          onChangeViewMode={actions.setViewMode}
          days={state.visibleDays}
          itemsByDate={state.visibleScheduleItemsByDate}
          disabledDateIds={state.disabledDateIds}
          canGoPrevious={state.canGoPrevious}
          canGoNext={state.canGoNext}
          isLoading={state.isLoading}
          onPrevious={actions.goPrevious}
          onNext={actions.goNext}
        />
      </section>
    </main>
  );
}
