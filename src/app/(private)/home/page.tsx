"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Users, MailOpen } from "lucide-react";
import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { useFriends } from "@/app/shared/data/friendships/hooks";
import { useEvents, useFriendsReservations, useMyReservations } from "@/app/features/cubiculos/data/hooks";
import { formatHourRange, getInitials, toAgendaDay, toDate, toDecimalHour } from "@/app/features/home/utils/utils";
import type { ReservationEvent, ReservationSummary } from "@/app/features/cubiculos/data/types";
import { DiaInvitaciones, EventoGeneral, Invitacion, Persona, Reserva } from "@/app/features/home/types/types";
import { PanelRed } from "@/app/features/home/components/PanelRed";
import AgendaRapida, { ExternalEvent } from "@/app/features/home/components/AgendaRapida/AgendaRapida";
import { PanelInvitaciones } from "@/app/features/home/components/PanelInvitaciones";
import { EventoGeneralDetail } from "@/app/features/home/components/EventoGeneralDetail";
import { useAuth } from "@/app/shared/auth/useAuth";

type MobileTab = "agenda" | "red" | "invitaciones";

const PERSON_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#DDEEFE", text: "#185FA5" },
  { bg: "#D6F5E6", text: "#0F6E56" },
];

const TIPO_EVENTO_COLORS: Record<
  EventoGeneral["tipo"],
  { bg: string; text: string; border: string }
> = {
  Festivo: { bg: "#FEF9C3", text: "#713F12", border: "#EAB308" },
  Corporativo: { bg: "#EDE9FE", text: "#4C1D95", border: "#7C3AED" },
  Social: { bg: "#D6F5E6", text: "#065F46", border: "#10B981" },
};

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function eventType(evt: ReservationEvent): EventoGeneral["tipo"] {
  const text = `${evt.title} ${evt.description}`.toLowerCase();
  if (text.includes("holiday") || text.includes("festivo")) return "Festivo";
  if (text.includes("social") || text.includes("happy")) return "Social";
  return "Corporativo";
}

function eventIcon(tipo: EventoGeneral["tipo"]) {
  if (tipo === "Festivo") return "??";
  if (tipo === "Social") return "??";
  return "??";
}

function mapReservation(res: ReservationSummary): Reserva {
  const start = toDate(res.start_time);
  const end = toDate(res.end_time);
  return {
    id: res.id,
    titulo: "Reservación",
    hora: formatHourRange(res.start_time, res.end_time),
    lugar: `${res.reservable_name} · ${res.floor_name}`,
    estado: res.status === "ACCEPTED" ? "Confirmada" : "Pendiente",
    day: toAgendaDay(start),
    start: toDecimalHour(start),
    end: toDecimalHour(end),
  };
}

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selInv, setSelInv] = useState<string | null>(null);
  const [curEv, setCurEv] = useState(0);
  const [eventOnAgenda, setEventOnAgenda] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("agenda");
  const { user } = useAuth();
  const name = user?.name;

  const { data: friends = [] } = useFriends();
  const { data: friendsReservations = [] } = useFriendsReservations();
  const { data: myReservationsData } = useMyReservations();
  const { data: eventsData = [] } = useEvents();

  const personas = useMemo<Persona[]>(() => {
    return friends.map((friend: any) => {
      const fr = friendsReservations.find((x: any) => x.user_id === friend.eId);
      const reservas = (fr?.reservations ?? [])
        .filter((r: any) => r.status === "ACCEPTED")
        .map(mapReservation);

      return {
        id: friend.eId,
        initials: getInitials(friend.name),
        name: friend.name,
        role: friend.roleName,
        userId: friend.eId,
        reservas,
      };
    });
  }, [friends, friendsReservations]);

  const invitaciones = useMemo<DiaInvitaciones[]>(() => {
    const grouped = new Map<number, Invitacion[]>();

    (myReservationsData?.reservations ?? [])
      .filter((r: any) => r.status === "PENDING")
      .forEach((res: any) => {
        const start = toDate(res.start_time);
        const end = toDate(res.end_time);
        const dayIndex = toAgendaDay(start);
        const item: Invitacion = {
          nombre: "Invitación de reservación",
          sala: `${res.reservable_name} · ${res.floor_name}`,
          hora: formatHourRange(res.start_time, res.end_time),
          tipo: "PENDING",
          day: dayIndex,
          start: toDecimalHour(start),
          end: toDecimalHour(end),
        };
        const arr = grouped.get(dayIndex) ?? [];
        arr.push(item);
        grouped.set(dayIndex, arr);
      });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([dayIndex, items]) => ({
        dia: DIAS[dayIndex],
        dayIndex,
        items,
      }));
  }, [myReservationsData]);

  const eventosGenerales = useMemo<EventoGeneral[]>(() => {
    if (!eventsData.length) {
      return [
        {
          id: -1,
          titulo: "Sin eventos",
          descripcion: "No hay eventos cargados",
          tipo: "Corporativo",
          icono: "??",
          day: 0,
          start: 0,
          end: 0,
          startAt: undefined,
          endAt: undefined,
        },
      ];
    }

    return eventsData.map((evt: any) => {
      const start = toDate(evt.start_time);
      const end = toDate(evt.end_time);
      const tipo = eventType(evt);
      return {
        id: evt.id,
        titulo: evt.title,
        descripcion: evt.description || "Sin descripción",
        tipo,
        icono: eventIcon(tipo),
        day: toAgendaDay(start),
        start: toDecimalHour(start),
        end: toDecimalHour(end),
        startAt: evt.start_time,
        endAt: evt.end_time,
      };
    });
  }, [eventsData]);

  const acceptedMine = useMemo(() => {
    return (myReservationsData?.reservations ?? [])
      .filter((r: any) => r.status === "ACCEPTED")
      .map(mapReservation);
  }, [myReservationsData]);

  const externalEvents = useMemo<ExternalEvent[]>(() => {
    const evts: ExternalEvent[] = [];

    acceptedMine.forEach((r: any) => {
      evts.push({
        day: r.day,
        start: r.start,
        end: r.end,
        label: r.titulo,
        sublabel: r.lugar,
        kind: "friend",
      });
    });

    if (selectedPerson !== null && personas[selectedPerson]) {
      personas[selectedPerson].reservas.forEach((r) => {
        evts.push({
          day: r.day,
          start: r.start,
          end: r.end,
          label: r.titulo,
          sublabel: r.lugar,
          kind: "friend",
        });
      });
    }

    if (selInv !== null) {
      invitaciones.forEach((sec) =>
        sec.items.forEach((item, ii) => {
          if (selInv === `inv_${sec.dayIndex}_${ii}`) {
            evts.push({
              day: item.day,
              start: item.start,
              end: item.end,
              label: item.nombre,
              sublabel: item.sala,
              kind: "invitation",
            });
          }
        }),
      );
    }

    eventosGenerales.forEach((eg) => {
      if (eg.tipo === "Festivo") {
        evts.push({
          day: eg.day,
          start: 6,
          end: 18,
          label: eg.titulo,
          kind: "holiday",
        });
      }
    });

    if (eventOnAgenda) {
      const target = eventosGenerales.find((ev) => ev.titulo === eventOnAgenda);
      if (target) {
        evts.push({
          day: target.day,
          start: target.start,
          end: target.end,
          label: target.titulo,
          sublabel: target.descripcion,
          kind: "holiday",
        });
      }
    }

    return evts;
  }, [
    acceptedMine,
    selectedPerson,
    personas,
    selInv,
    invitaciones,
    eventosGenerales,
    eventOnAgenda,
  ]);

  const handlePersonClick = (i: number) => {
    const next = selectedPerson === i ? null : i;
    setSelectedPerson(next);
    if (next !== null) setMobileTab("agenda");
  };

  const handleInvClick = (dayIndex: number, ii: number) => {
    const id = `inv_${dayIndex}_${ii}`;
    const next = selInv === id ? null : id;
    setSelInv(next);
    if (next !== null) setMobileTab("agenda");
  };

  const carouselProps = {
    evento: eventosGenerales[curEv] ?? eventosGenerales[0],
    onPrev: () =>
      setCurEv(
        (c) => (c - 1 + eventosGenerales.length) % eventosGenerales.length,
      ),
    onNext: () => setCurEv((c) => (c + 1) % eventosGenerales.length),
    dotCount: eventosGenerales.length,
    dotActive: curEv,
    onDot: (i: number) => setCurEv(i),
    onViewInAgenda: () => {
      const target = eventosGenerales[curEv] ?? eventosGenerales[0];
      if (!target) return;
      setEventOnAgenda(target.titulo);
      setMobileTab("agenda");
    },
  };

  const TABS: {
    key: MobileTab;
    label: string;
    icon: React.ReactNode;
    badge?: boolean;
  }[] = [
    { key: "agenda", label: "Agenda", icon: <CalendarDays size={18} /> },
    {
      key: "red",
      label: "Red",
      icon: <Users size={18} />,
      badge: selectedPerson !== null,
    },
    {
      key: "invitaciones",
      label: "Invitaciones",
      icon: <MailOpen size={18} />,
      badge: selInv !== null,
    },
  ];

  const AgendaPanel = (
    <div className="flex flex-col min-h-0 gap-3 flex-1">
      <div className="flex-1 min-h-0 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white">
        <AgendaRapida externalEvents={externalEvents} />
      </div>
      <EventoGeneralDetail {...carouselProps} />
    </div>
  );

  return (
    <PageTransition>
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
              Hola{`, ${name}`}
            </h1>

            <p className="text-sm text-slate-500 md:text-base">
              Visualiza tus contactos, invitaciones y eventos
            </p>
          </header>
          <div className="desktop-grid hidden sm:flex flex-1 min-h-0 flex-col">
            <div className="col-left flex flex-col bg-container shadow-sm border border-neutral-1 overflow-hidden p-4 min-h-0">
              <PanelRed
                selectedPerson={selectedPerson}
                onPersonClick={handlePersonClick}
                personas={personas}
              />
            </div>
            <div className="col-center flex flex-col min-h-0 gap-3">
              <div className="flex-1 min-h-0 overflow-hidden shadow-sm border border-neutral-1 bg-container">
                <AgendaRapida externalEvents={externalEvents} />
              </div>
              <EventoGeneralDetail {...carouselProps} />
            </div>
            <div className="col-right flex flex-col bg-white shadow-sm border border-gray-100 overflow-hidden p-4 min-h-0">
              <PanelInvitaciones
                selInv={selInv}
                onInvClick={handleInvClick}
                invitaciones={invitaciones}
              />
            </div>
          </div>
          <div className="flex sm:hidden flex-1 min-h-0 flex-col">
            {mobileTab === "agenda" && AgendaPanel}
            {mobileTab === "red" && (
              <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 p-4 overflow-hidden">
                <PanelRed
                  selectedPerson={selectedPerson}
                  onPersonClick={handlePersonClick}
                  personas={personas}
                />
              </div>
            )}
            {mobileTab === "invitaciones" && (
              <div className="flex flex-1 min-h-0 flex-col rounded-xl bg-white shadow-sm border border-gray-100 p-4 overflow-hidden">
                <PanelInvitaciones
                  selInv={selInv}
                  onInvClick={handleInvClick}
                  invitaciones={invitaciones}
                />
              </div>
            )}
          </div>
        </div>
        <nav
          className="home-safe-bottom flex sm:hidden shrink-0 items-stretch bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]"
          style={{ zIndex: 30 }}
        >
          {TABS.map((tab) => {
            const isActive = mobileTab === tab.key;
            return (
              <button
                type="button"
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 border-none bg-transparent cursor-pointer"
                style={{ color: isActive ? "#7C3AED" : "#9CA3AF" }}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-violet-600" />
                )}
                {tab.badge && !isActive && (
                  <span className="absolute top-2.5 right-[calc(50%-10px)] h-2 w-2 rounded-full bg-orange-400 border-2 border-white" />
                )}
                <span style={{ opacity: isActive ? 1 : 0.55 }}>{tab.icon}</span>
                <span
                  className="text-[10px]"
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </section>
    </PageTransition>
  );
}
