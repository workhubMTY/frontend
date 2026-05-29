import { HomeDesktopLayout } from "@/app/features/home/components/Layouts/HomeDesktopLayout";
import { HomeMobileLayout } from "@/app/features/home/components/Layouts/HomeMobileLayout";
import { HomeMobileNavigation } from "@/app/features/home/components/HomeMovileNavigation";

import type { useHomePage } from "@/app/features/home/hooks/useHomePage";

type HomePageLayoutProps = ReturnType<typeof useHomePage> & {
  name?: string;
};

export function HomePageLayout({
  name,

  personas,
  invitaciones,
  externalEvents,
  carouselProps,

  selectedPerson,
  selectedInvitationId,

  mobileTab,
  setMobileTab,

  handlePersonClick,
  handleInvitationClick,
}: HomePageLayoutProps) {
  return (
    <>
      <style>{`
  .home-safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 8px);
  }

  .home-outer {
    max-width: 2000px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  @media (min-width: 1024px) {
    .desktop-grid {
      display: grid !important;
      grid-template-columns: 300px minmax(0, 1fr) 300px;
      align-items: stretch;
      gap: 1rem;
    }

    .col-center {
      min-width: 0;
    }
  }

  @media (min-width: 1280px) {
    .desktop-grid {
      grid-template-columns: 320px minmax(0, 1fr) 320px;
    }
  }

  @media (min-width: 1536px) {
    .desktop-grid {
      grid-template-columns: 340px minmax(0, 1fr) 340px;
    }
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    .desktop-grid {
      display: grid !important;
      grid-template-columns: 1fr minmax(240px, 32%);
      grid-template-rows: 1fr auto;
      grid-template-areas:
        "center right"
        "center left";
      gap: 1rem;
    }

    .col-left {
      grid-area: left;
      max-height: 240px;
    }

    .col-center {
      grid-area: center;
      min-width: 0;
    }

    .col-right {
      grid-area: right;
      max-height: 320px;
    }
  }
`}</style>

      <section className="flex h-full w-full flex-col overflow-hidden bg-background-page">
        <div className="home-outer px-6 pt-4 pb-0 sm:px-6 sm:pb-6 lg:px-12">
          <header className="space-y-1 py-4">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Hola{name ? `, ${name}` : ""}
            </h1>

            <p className="text-sm text-slate-500 md:text-base">
              Visualiza tus contactos, invitaciones y eventos
            </p>
          </header>

          <HomeDesktopLayout
            personas={personas}
            invitaciones={invitaciones}
            externalEvents={externalEvents}
            carouselProps={carouselProps}
            selectedPerson={selectedPerson}
            selectedInvitationId={selectedInvitationId}
            onPersonClick={handlePersonClick}
            onInvitationClick={handleInvitationClick}
          />

          <HomeMobileLayout
            mobileTab={mobileTab}
            personas={personas}
            invitaciones={invitaciones}
            externalEvents={externalEvents}
            carouselProps={carouselProps}
            selectedPerson={selectedPerson}
            selectedInvitationId={selectedInvitationId}
            onPersonClick={handlePersonClick}
            onInvitationClick={handleInvitationClick}
          />
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