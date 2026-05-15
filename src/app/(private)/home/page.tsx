"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
  MailOpen,
} from "lucide-react";

import PageTransition from "@/app/components/PageTransition/PageTransition";

import { useFriends } from "@/app/modules/friendships/hooks";
import {
  useEvents,
  useFriendsReservations,
  useMyReservations,
} from "@/app/modules/office-slots/hooks";
import { getInitials } from "@/app/features/home/utils/utils";
import type {
  ReservationEvent,
  ReservationSummary,
} from "@/app/modules/office-slots/types";
import {
  DiaInvitaciones,
  EventoGeneral,
  Invitacion,
  Persona,
  Reserva,
} from "@/app/features/home/types/types";
import { PanelRed } from "@/app/features/home/components/PanelRed";
import AgendaRapida, {
  ExternalEvent,
} from "@/app/features/home/components/AgendaRapida";
import { PanelInvitaciones } from "@/app/features/home/components/PanelInvitaciones";

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

function toDate(value: string) {
  return new Date(value);
}

function toAgendaDay(date: Date) {
  return (date.getDay() + 6) % 7;
}

function toDecimalHour(date: Date) {
  return date.getHours() + date.getMinutes() / 60;
}

function formatHourRange(startIso: string, endIso: string) {
  const start = toDate(startIso);
  const end = toDate(endIso);
  const fmt = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return `${fmt(start)}-${fmt(end)}`;
}

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

type EventoGeneralDetailProps = {
  evento: EventoGeneral | null;
  currentIndex?: number;
  totalEvents?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onOpenAgenda?: () => void;
};

const eventTypeStyles: Record<EventoGeneral["tipo"], string> = {
  Festivo: "border-amber-200 bg-amber-50 text-amber-700",
  Corporativo: "border-purple-200 bg-purple-50 text-purple-700",
  Social: "border-blue-200 bg-blue-50 text-blue-700",
};

function formatEventTime(start: number, end: number) {
  const formatHour = (hour: number) => {
    const normalizedHour = Math.floor(hour);
    const minutes = Math.round((hour - normalizedHour) * 60);

    return `${String(normalizedHour).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}`;
  };

  return `${formatHour(start)} - ${formatHour(end)}`;
}

function getDayLabel(day: number) {
  const days = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  return days[day] ?? `Día ${day + 1}`;
}

export function EventoGeneralDetail({
  evento,
  currentIndex = 0,
  totalEvents = 0,
  onPrevious,
  onNext,
  onOpenAgenda,
}: EventoGeneralDetailProps) {
  const hasEvent = Boolean(evento);

  return (
    <section className="shrink-0 overflow-hidden border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-neutral-700" />

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Eventos & Festivos
            </h2>

            {totalEvents > 0 && (
              <p className="mt-0.5 text-sm text-neutral-500">
                {currentIndex + 1} de {totalEvents}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!onPrevious || totalEvents <= 1}
            aria-label="Evento anterior"
            className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!onNext || totalEvents <= 1}
            aria-label="Siguiente evento"
            className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {!hasEvent || !evento ? (
        <div className="px-7 py-6">
          <article className="grid grid-cols-[auto_1fr] gap-4 border-l-4 border-purple-700 bg-purple-50/70 px-5 py-4">
            <div className="flex h-14 w-14 items-center justify-center bg-purple-100 text-xl font-semibold text-purple-700">
              —
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-neutral-950">Sin eventos</h3>

                <span className="inline-flex items-center border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                  Agenda general
                </span>
              </div>

              <p className="mt-1 text-sm text-neutral-500">
                No hay eventos cargados para este periodo.
              </p>

              <button
                type="button"
                disabled
                className="mt-4 inline-flex h-9 cursor-not-allowed items-center justify-center border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-400"
              >
                Ver en agenda
              </button>
            </div>
          </article>
        </div>
      ) : (
        <article className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-l-4 border-purple-700 bg-purple-50/70 px-7 py-5 pl-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-purple-100 text-2xl font-semibold text-purple-700">
            {evento.icono}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-neutral-950">
                {evento.titulo}
              </h3>

              <span
                className={[
                  "inline-flex items-center border px-2.5 py-1 text-xs font-medium",
                  eventTypeStyles[evento.tipo],
                ].join(" ")}
              >
                {evento.tipo}
              </span>
            </div>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
              {evento.descripcion}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} className="text-neutral-400" />
                {getDayLabel(evento.day)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-neutral-400" />
                {formatEventTime(evento.start, evento.end)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-neutral-400" />
                Agenda general
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onOpenAgenda}
              className="inline-flex h-10 items-center border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Ver en agenda
            </button>
          </div>
        </article>
      )}
    </section>
  );
}

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selInv, setSelInv] = useState<string | null>(null);
  const [curEv, setCurEv] = useState(0);
  const [eventOnAgenda, setEventOnAgenda] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("agenda");

  const { data: friends = [] } = useFriends();
  const { data: friendsReservations = [] } = useFriendsReservations();
  const { data: myReservationsData } = useMyReservations();
  const { data: eventsData = [] } = useEvents();

  const personas = useMemo<Persona[]>(() => {
    return friends.map((friend) => {
      const fr = friendsReservations.find((x) => x.user_id === friend.eId);
      const reservas = (fr?.reservations ?? [])
        .filter((r) => r.status === "ACCEPTED")
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
      .filter((r) => r.status === "PENDING")
      .forEach((res) => {
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

    return eventsData.map((evt) => {
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
      .filter((r) => r.status === "ACCEPTED")
      .map(mapReservation);
  }, [myReservationsData]);

  const externalEvents = useMemo<ExternalEvent[]>(() => {
    const evts: ExternalEvent[] = [];

    acceptedMine.forEach((r) => {
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
        <div className="home-outer px-4 pt-4 pb-0 sm:px-6 sm:pb-6 lg:px-8">
          <header className="space-y-1 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Bienvenido, Croissant
            </h1>

            <p className="text-sm text-slate-500 md:text-base">
              Busca un espacio, revisa su disponibilidad y continúa con la
              reserva.
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
