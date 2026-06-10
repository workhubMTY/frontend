"use client"
import { HomeAgendaPeopleCard } from "@/app/features/home/components/FriendsCard";
import { HomeAgendaTimeline } from "@/app/features/home/components/HomeAgendaTimeline";
import { useHomeAgendaViewModel } from "@/app/features/home/hooks/useHomeAgendaViewModel";

export default function HomePage() {
  const { state, actions } = useHomeAgendaViewModel();

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-neutral-50 px-8 py-8">
      <div className="mb-6 flex shrink-0 items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">
            Hola, {state.user?.name ?? "usuario"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Visualiza tus contactos, reservaciones y eventos.
          </p>
        </div>

        {/* Aquí van tus filtros */}
      </div>

      <section className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)] gap-5">
        <HomeAgendaPeopleCard
          owners={state.agendaOwners}
          selectedOwnerId={state.selectedUserId}
          isLoading={state.friendsIsLoading}
          onSelectOwner={actions.selectOwner}
        />

        <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Agenda rápida
              </h2>

              <p className="text-xs text-slate-500">
                {state.selectedOwner?.kind === "friend"
                  ? `Mostrando agenda de ${state.selectedOwner.name}`
                  : "Mostrando tu agenda"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={actions.goPrevious}
                disabled={!state.canGoPrevious}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>

              <span className="text-xs font-medium text-slate-500">
                {state.visibleDays[0]?.id} -{" "}
                {state.visibleDays[state.visibleDays.length - 1]?.id}
              </span>

              <button
                type="button"
                onClick={actions.goNext}
                disabled={!state.canGoNext}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>

          <HomeAgendaTimeline
            days={state.visibleDays}
            itemsByDate={state.visibleScheduleItemsByDate}
            disabledDateIds={state.disabledDateIds}
            isLoading={state.isLoading}
          />
        </section>
      </section>
    </main>
  );
}