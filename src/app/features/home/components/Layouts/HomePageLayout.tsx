import { HomeDesktopLayout } from "@/app/features/home/components/Layouts/HomeDesktopLayout";
import { HomeMobileLayout }  from "@/app/features/home/components/Layouts/HomeMobileLayout";
import { HomeMobileNavigation } from "@/app/features/home/components/HomeMovileNavigation";
import { AgendaFilterTabs } from "@/app/features/home/components/AgendaFilterTabs";

import type { useHomePage } from "@/app/features/home/hooks/useHomePage";

type HomePageLayoutProps = ReturnType<typeof useHomePage> & { name?: string };

export function HomePageLayout({
  name,
  personas,
  invitaciones,
  externalEvents,
  carouselProps,
  selectedPerson,
  selectedFriendId,
  selectedInvitationId,
  agendaFilter,
  mobileTab,
  setMobileTab,
  handlePersonClick,
  handleFriendClick,
  handleInvitationClick,
  handleAgendaFilterChange,
}: HomePageLayoutProps) {
  return (
    <>
      <style>{`
        .home-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 8px); }
        .desktop-grid { display: none; }

        @media (min-width: 640px) {
          .desktop-grid {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) 272px;
            grid-template-areas: "center left";
            gap: 1rem;
            align-items: stretch;
          }
          .col-left   { grid-area: left; }
          .col-center { grid-area: center; min-width: 0; }
        }
        @media (min-width: 1024px) {
          .desktop-grid {
            grid-template-columns: 300px minmax(0, 1fr);
            grid-template-areas: "left center";
          }
        }
        @media (min-width: 1280px) { .desktop-grid { grid-template-columns: 320px minmax(0, 1fr); } }
        @media (min-width: 1536px) { .desktop-grid { grid-template-columns: 360px minmax(0, 1fr); } }
      `}</style>

      <section className="flex h-full w-full flex-col overflow-hidden bg-background-page">
        <div className="mx-auto w-full flex flex-1 min-h-0 flex-col" style={{ maxWidth: "2000px" }}>
          <div className="flex flex-1 min-h-0 flex-col px-4 pt-4 pb-0 sm:px-6 sm:pb-6 lg:px-12">

            <header className="shrink-0 py-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-0.5">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Hola{name ? `, ${name}` : ""}
                </h1>
                <p className="text-xs text-slate-500 md:text-sm">
                  Visualiza tus contactos, invitaciones y eventos
                </p>
              </div>
              <div className="hidden sm:flex items-center">
                <AgendaFilterTabs active={agendaFilter} onChange={handleAgendaFilterChange} />
              </div>
            </header>

            <div className="flex sm:hidden shrink-0 pb-3 overflow-x-auto">
              <AgendaFilterTabs active={agendaFilter} onChange={handleAgendaFilterChange} />
            </div>

            <HomeDesktopLayout
              personas={personas}
              invitaciones={invitaciones}
              externalEvents={externalEvents}
              agendaFilter={agendaFilter}
              selectedPerson={selectedPerson}
              selectedFriendId={selectedFriendId}
              selectedInvitationId={selectedInvitationId}
              onPersonClick={handlePersonClick}
              onFriendClick={handleFriendClick}
              onInvitationClick={handleInvitationClick}
            />

            <HomeMobileLayout
              mobileTab={mobileTab}
              personas={personas}
              invitaciones={invitaciones}
              externalEvents={externalEvents}
              agendaFilter={agendaFilter}
              selectedPerson={selectedPerson}
              selectedFriendId={selectedFriendId}
              selectedInvitationId={selectedInvitationId}
              onPersonClick={handlePersonClick}
              onFriendClick={handleFriendClick}
              onInvitationClick={handleInvitationClick}
            />
          </div>
        </div>

        <HomeMobileNavigation
          activeTab={mobileTab}
          selectedPerson={selectedPerson}
          selectedInvitationId={selectedInvitationId}
          onChangeTab={setMobileTab}
        />
      </section>
    </>
  );
}