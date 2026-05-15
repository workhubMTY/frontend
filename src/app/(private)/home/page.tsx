"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  CalendarDays,
  Users,
  MailOpen,
} from "lucide-react";
import AgendaRapida, {
  ExternalEvent,
} from "@/app/components/AgendaRapida/AgendaRapida";
import PageTransition from "@/app/components/PageTransition/PageTransition";
import { useFriends } from "@/app/modules/friendships/hooks";
import {
  useEvents,
  useFriendsReservations,
  useMyReservations,
} from "@/app/modules/office-slots/hooks";
import { getInitials, getUserColor } from "@/app/features/profile.utils";
import type {
  ReservationEvent,
  ReservationSummary,
} from "@/app/modules/office-slots/types";

type MobileTab = "agenda" | "red" | "invitaciones";

type Invitacion = {
  nombre: string;
  sala: string;
  hora: string;
  tipo: string;
  day: number;
  start: number;
  end: number;
  startAt: string;
  endAt: string;
};

type DiaInvitaciones = {
  dia: string;
  dayIndex: number;
  items: Invitacion[];
};

type Reserva = {
  id: number;
  titulo: string;
  hora: string;
  lugar: string;
  estado: "Confirmada" | "Pendiente";
  day: number;
  start: number;
  end: number;
  startAt: string;
  endAt: string;
};

type Persona = {
  initials: string;
  name: string;
  role: string;
  userId: string;
  reservas: Reserva[];
};

type EventoGeneral = {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: "Festivo" | "Corporativo" | "Social";
  icono: string;
  day: number;
  start: number;
  end: number;
  startAt?: string;
  endAt?: string;
};

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
    startAt: res.start_time,
    endAt: res.end_time,
  };
}

function EventoGeneralDetail({
  evento,
  onPrev,
  onNext,
  onViewInAgenda,
  dotCount,
  dotActive,
  onDot,
}: {
  evento: EventoGeneral;
  onPrev: () => void;
  onNext: () => void;
  onViewInAgenda: () => void;
  dotCount: number;
  dotActive: number;
  onDot: (i: number) => void;
}) {
  const c = TIPO_EVENTO_COLORS[evento.tipo];
  return (
    <div className="shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <h3 className="text-[0.85rem] font-semibold text-gray-900">
          Eventos & Festivos
        </h3>
        <div className="flex gap-1.5">
          <button type="button" onClick={onPrev}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 active:bg-gray-100 transition-colors cursor-pointer bg-white"
          >
            <ChevronLeft size={13} />
          </button>
          <button type="button" onClick={onNext}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 active:bg-gray-100 transition-colors cursor-pointer bg-white"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <div className="flex gap-3 px-4 py-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
        >
          {evento.icono}
        </div>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight">
              {evento.titulo}
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0"
              style={{ background: c.bg, color: c.text }}
            >
              {evento.tipo}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            {evento.descripcion}
          </p>
          <button
            type="button"
            onClick={onViewInAgenda}
            className="mt-1 self-start rounded-lg border border-violet-600 px-3 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-600 hover:text-white active:bg-violet-700 transition-colors cursor-pointer bg-transparent"
          >
            Ver en agenda
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {Array.from({ length: dotCount }).map((_, i) => (
          <button type="button" key={i}
            onClick={() => onDot(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all"
            style={{
              width: i === dotActive ? "16px" : "6px",
              background: i === dotActive ? "#7C3AED" : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PanelRed({
  selectedPerson,
  onPersonClick,
  personas,
}: {
  selectedPerson: number | null;
  onPersonClick: (i: number) => void;
  personas: Persona[];
}) {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <span className="text-[0.9rem] font-semibold text-gray-900">
          Red personal
        </span>
      </div>
      {selectedPerson !== null && personas[selectedPerson] && (
        <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">
          <span
            className="inline-block h-2 w-2 rounded-sm shrink-0"
            style={{ background: "#F97316" }}
          />
          <p className="text-[11px] text-orange-700 leading-tight">
            Mostrando horarios de{" "}
            <strong>{personas[selectedPerson].name.split(" ")[0]}</strong> en la
            agenda
          </p>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto min-h-0">
        {personas.map((p, i) => {
          const color = getUserColor(p.userId);
          return (
            <button type="button" key={p.userId}
              onClick={() => onPersonClick(i)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none px-3 py-3 text-left font-[inherit] transition-colors"
              style={{ background: selectedPerson === i ? "#FFF0E6" : "#F9FAFB" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                style={{
                  background: color.bg,
                  color: color.text,
                }}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-medium leading-tight truncate"
                  style={{ color: selectedPerson === i ? "#9A3412" : "#111827" }}
                >
                  {p.name}
                </p>
                <p
                  className="text-[11px] leading-tight mt-0.5"
                  style={{ color: selectedPerson === i ? "#C2663A" : "#9CA3AF" }}
                >
                  {p.role}
                </p>
              </div>
              {selectedPerson === i ? (
                <Star
                  size={12}
                  className="shrink-0"
                  style={{ color: "#F97316" }}
                />
              ) : (
                <span className="text-[10px] text-gray-300 shrink-0">ver ?</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="shrink-0 flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5">
        <Search size={13} className="shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar persona..."
          className="w-full bg-transparent text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function PanelInvitaciones({
  selInv,
  onInvClick,
  invitaciones,
}: {
  selInv: string | null;
  onInvClick: (dayIndex: number, ii: number) => void;
  invitaciones: DiaInvitaciones[];
}) {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <span className="text-[0.9rem] font-semibold text-gray-900">
          Invitaciones
        </span>
        <Calendar size={15} className="text-gray-400" />
      </div>
      {selInv !== null && (
        <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
          <span
            className="inline-block h-2 w-2 rounded-sm shrink-0"
            style={{ background: "#3B82F6" }}
          />
          <p className="text-[11px] text-blue-700 leading-tight">
            Invitación marcada en la agenda
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        {invitaciones.map((sec, si) => (
          <div key={si}>
            <p className="pt-1 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
              {sec.dia}
            </p>
            {sec.items.map((item, ii) => {
              const id = `inv_${sec.dayIndex}_${ii}`;
              const isSelected = selInv === id;
              return (
                <div
                  key={ii}
                  onClick={() => onInvClick(sec.dayIndex, ii)}
                  className="mb-2 cursor-pointer rounded-xl px-3 py-3 transition-colors border"
                  style={{
                    background: isSelected ? "#E6F4FF" : "#F9FAFB",
                    borderColor: isSelected ? "#93C5FD" : "transparent",
                  }}
                >
                  <p
                    className="text-[12px] font-semibold leading-tight mb-1.5"
                    style={{ color: isSelected ? "#1E3A8A" : "#111827" }}
                  >
                    {item.nombre}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
                    <MapPin size={9} className="shrink-0" /> {item.sala}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Clock size={9} className="shrink-0" /> {item.hora}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button type="button" className="shrink-0 w-full cursor-pointer rounded-xl border border-gray-200 py-2.5 text-[12px] font-medium text-gray-500 hover:border-violet-600 hover:text-violet-600 transition-colors bg-transparent">
        Mostrar todas
      </button>
    </div>
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
          startAt: res.start_time,
          endAt: res.end_time,
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
        startAt: r.startAt,
        endAt: r.endAt,
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
          startAt: r.startAt,
          endAt: r.endAt,
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
              startAt: item.startAt,
              endAt: item.endAt,
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
          startAt: target.startAt,
          endAt: target.endAt,
        });
      }
    }

    return evts;
  }, [acceptedMine, selectedPerson, personas, selInv, invitaciones, eventosGenerales, eventOnAgenda]);

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
        .home-safe-bottom { padding-bottom: env(safe-area-inset-bottom, 8px); }
        .home-outer {
          max-width: 1600px;
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
            grid-template-columns: minmax(180px, 17%) 1fr minmax(180px, 17%);
            gap: 0.75rem;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .desktop-grid {
            display: grid !important;
            grid-template-columns: 1fr minmax(200px, 26%);
            grid-template-rows: 1fr auto;
            grid-template-areas: "center right" "center left";
            gap: 0.75rem;
          }
          .col-left   { grid-area: left;   max-height: 210px; }
          .col-center { grid-area: center; }
          .col-right  { grid-area: right;  }
        }
      `}</style>
      <section className="flex h-[100svh] w-full flex-col bg-background-page overflow-hidden">
        <div className="home-outer px-3 sm:px-[3%] pt-3 sm:pt-[2%] pb-0 sm:pb-[2%]">
          <h1 className="shrink-0 mb-3 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Bienvenido, Croissant
          </h1>
          <div className="desktop-grid hidden sm:flex flex-1 min-h-0 flex-col">
            <div className="col-left flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 min-h-0">
              <PanelRed
                selectedPerson={selectedPerson}
                onPersonClick={handlePersonClick}
                personas={personas}
              />
            </div>
            <div className="col-center flex flex-col min-h-0 gap-3">
              <div className="flex-1 min-h-0 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white">
                <AgendaRapida externalEvents={externalEvents} />
              </div>
              <EventoGeneralDetail {...carouselProps} />
            </div>
            <div className="col-right flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 min-h-0">
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
              <button type="button" key={tab.key}
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



