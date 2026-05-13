"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
} from "lucide-react";
import AgendaRapida, {
  ExternalEvent,
} from "@/app/components/AgendaRapida/AgendaRapida";
import PageTransition from "@/app/components/PageTransition/PageTransition";

interface Invitacion {
  nombre: string;
  sala: string;
  hora: string;
  tipo: string;
  day: number;
  start: number;
  end: number;
}
interface DiaInvitaciones {
  dia: string;
  dayIndex: number;
  items: Invitacion[];
}
interface Reserva {
  titulo: string;
  hora: string;
  lugar: string;
  estado: "Confirmada" | "Pendiente";
  day: number;
  start: number;
  end: number;
}
interface Persona {
  initials: string;
  name: string;
  role: string;
  reservas: Reserva[];
}
interface EventoGeneral {
  titulo: string;
  descripcion: string;
  tipo: "Festivo" | "Corporativo" | "Social";
  icono: string;
  day: number;
  start: number;
  end: number;
}

const EVENTOS_GENERALES: EventoGeneral[] = [
  {
    titulo: "Día del Trabajo",
    descripcion: "Día festivo nacional — oficinas cerradas",
    tipo: "Festivo",
    icono: "🎉",
    day: 3,
    start: 0,
    end: 24,
  },
  {
    titulo: "All-Hands Accenture MX",
    descripcion: "Sesión global transmitida en vivo",
    tipo: "Corporativo",
    icono: "📡",
    day: 0,
    start: 10,
    end: 11.5,
  },
  {
    titulo: "Happy Hour Workhub",
    descripcion: "Terraza · Todos bienvenidos",
    tipo: "Social",
    icono: "🍹",
    day: 4,
    start: 17,
    end: 19,
  },
];

const INVITACIONES: DiaInvitaciones[] = [
  {
    dia: "Lunes",
    dayIndex: 0,
    items: [
      {
        nombre: "Junta de seguimiento",
        sala: "ISJ03 · Sierra Madre",
        hora: "7:00–13:00",
        tipo: "Reunión",
        day: 0,
        start: 7,
        end: 13,
      },
      {
        nombre: "Refinamiento de req.",
        sala: "ABC02 · Sala 2",
        hora: "8:00–17:00",
        tipo: "Planning",
        day: 0,
        start: 8,
        end: 17,
      },
    ],
  },
  {
    dia: "Martes",
    dayIndex: 1,
    items: [
      {
        nombre: "Junta con Stakeholders",
        sala: "DS340 · Sala 4",
        hora: "7:00–13:00",
        tipo: "Reunión",
        day: 1,
        start: 7,
        end: 13,
      },
    ],
  },
  {
    dia: "Miércoles",
    dayIndex: 2,
    items: [
      {
        nombre: "Junta de seguimiento",
        sala: "ISJ03 · Sierra Madre",
        hora: "7:00–13:00",
        tipo: "Reunión",
        day: 2,
        start: 7,
        end: 13,
      },
    ],
  },
];

const PERSONAS: Persona[] = [
  {
    initials: "CG",
    name: "Cristina González",
    role: "Senior Developer",
    reservas: [
      {
        titulo: "Sprint Planning",
        hora: "9:00–11:00",
        lugar: "Sala Magna",
        estado: "Confirmada",
        day: 0,
        start: 9,
        end: 11,
      },
      {
        titulo: "Design Review",
        hora: "11:00–12:30",
        lugar: "ISJ03",
        estado: "Confirmada",
        day: 0,
        start: 11,
        end: 12.5,
      },
      {
        titulo: "Retrospectiva",
        hora: "11:00–13:00",
        lugar: "Sala 2",
        estado: "Pendiente",
        day: 2,
        start: 11,
        end: 13,
      },
    ],
  },
  {
    initials: "MJ",
    name: "María Jesús",
    role: "Tester",
    reservas: [
      {
        titulo: "Standup",
        hora: "8:00–9:00",
        lugar: "Sala Virtual",
        estado: "Confirmada",
        day: 1,
        start: 8,
        end: 9,
      },
      {
        titulo: "Revisión QA",
        hora: "13:00–14:00",
        lugar: "ISJ04",
        estado: "Confirmada",
        day: 1,
        start: 13,
        end: 14,
      },
    ],
  },
  {
    initials: "MC",
    name: "Mia Clements",
    role: "Junior Developer",
    reservas: [
      {
        titulo: "Standup",
        hora: "8:00–9:00",
        lugar: "Sala Virtual",
        estado: "Confirmada",
        day: 0,
        start: 8,
        end: 9,
      },
      {
        titulo: "Workshop UX",
        hora: "10:00–12:00",
        lugar: "Sala UX",
        estado: "Confirmada",
        day: 2,
        start: 10,
        end: 12,
      },
      {
        titulo: "1:1 con manager",
        hora: "14:00–15:00",
        lugar: "Oficina Dir.",
        estado: "Pendiente",
        day: 3,
        start: 14,
        end: 15,
      },
    ],
  },
];

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

function EventoGeneralDetail({
  evento,
  onPrev,
  onNext,
  dotCount,
  dotActive,
  onDot,
}: {
  evento: EventoGeneral;
  onPrev: () => void;
  onNext: () => void;
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
          <button
            onClick={onPrev}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-colors cursor-pointer bg-white"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={onNext}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-colors cursor-pointer bg-white"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <div className="flex gap-3 px-4 py-3">
        <div
          className="flex h-16 w-[22%] shrink-0 items-center justify-center rounded-lg text-2xl"
          style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
        >
          {evento.icono}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-gray-900">
              {evento.titulo}
            </p>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: c.bg, color: c.text }}
            >
              {evento.tipo}
            </span>
          </div>
          <p className="text-[11px] text-gray-400">{evento.descripcion}</p>
          <button className="mt-1 self-start rounded-md border border-violet-600 px-3 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-600 hover:text-white transition-colors cursor-pointer bg-transparent">
            Ver en agenda
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {Array.from({ length: dotCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            className="h-1.5 rounded-full border-none cursor-pointer transition-all"
            style={{
              width: i === dotActive ? "14px" : "6px",
              background: i === dotActive ? "#7F77DD" : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selInv, setSelInv] = useState<string | null>(null);
  const [curEv, setCurEv] = useState(0);

  const externalEvents = useMemo<ExternalEvent[]>(() => {
    const evts: ExternalEvent[] = [];

    if (selectedPerson !== null) {
      PERSONAS[selectedPerson].reservas.forEach((r) => {
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
      INVITACIONES.forEach((sec) => {
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
        });
      });
    }

    EVENTOS_GENERALES.forEach((eg) => {
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

    return evts;
  }, [selectedPerson, selInv]);

  const handlePersonClick = (i: number) =>
    setSelectedPerson(selectedPerson === i ? null : i);
  const handleInvClick = (dayIndex: number, ii: number) => {
    const id = `inv_${dayIndex}_${ii}`;
    setSelInv(selInv === id ? null : id);
  };

  return (
    <PageTransition>
      <section className="flex h-[100svh] w-full flex-col bg-background-page overflow-hidden">
        <div className="flex h-full w-full flex-col px-[3%] py-[2%]">
          <h1 className="shrink-0 mb-3 text-2xl font-bold tracking-tight text-gray-900">
            Bienvenido, Croissant
          </h1>

          <div
            className="flex-1 min-h-0 grid gap-3"
            style={{
              gridTemplateColumns: "minmax(180px, 18%) 1fr minmax(180px, 18%)",
            }}
          >
            <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 gap-3">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-[0.85rem] font-semibold text-gray-900">
                  Red personal
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-violet-600 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                  <UserPlus size={12} />
                </button>
              </div>

              {selectedPerson !== null && (
                <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-100 px-2 py-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-sm shrink-0"
                    style={{ background: "#F97316" }}
                  />
                  <p className="text-[10px] text-orange-700 leading-tight">
                    Mostrando horarios de{" "}
                    <strong>
                      {PERSONAS[selectedPerson].name.split(" ")[0]}
                    </strong>{" "}
                    en la agenda
                  </p>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto min-h-0">
                {PERSONAS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePersonClick(i)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-2 py-2 text-left font-[inherit] transition-colors"
                    style={{
                      background:
                        selectedPerson === i ? "#FFF0E6" : "transparent",
                    }}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{
                        background: PERSON_COLORS[i].bg,
                        color: PERSON_COLORS[i].text,
                      }}
                    >
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-medium leading-tight truncate"
                        style={{
                          color: selectedPerson === i ? "#9A3412" : "#111827",
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        className="text-[10px] leading-tight"
                        style={{
                          color: selectedPerson === i ? "#C2663A" : "#9CA3AF",
                        }}
                      >
                        {p.role}
                      </p>
                    </div>
                    {selectedPerson === i && (
                      <Star
                        size={10}
                        className="shrink-0"
                        style={{ color: "#F97316" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="shrink-0 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Search size={11} className="shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-full bg-transparent text-[11px] text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col min-h-0 gap-3">
              <div className="flex-1 min-h-0">
                <AgendaRapida externalEvents={externalEvents} />
              </div>
              <EventoGeneralDetail
                evento={EVENTOS_GENERALES[curEv]}
                onPrev={() =>
                  setCurEv(
                    (c) =>
                      (c - 1 + EVENTOS_GENERALES.length) %
                      EVENTOS_GENERALES.length,
                  )
                }
                onNext={() =>
                  setCurEv((c) => (c + 1) % EVENTOS_GENERALES.length)
                }
                dotCount={EVENTOS_GENERALES.length}
                dotActive={curEv}
                onDot={(i) => setCurEv(i)}
              />
            </div>

            <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 gap-3">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-[0.85rem] font-semibold text-gray-900">
                  Invitaciones
                </span>
                <Calendar size={13} className="text-gray-400" />
              </div>

              {selInv !== null && (
                <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-2 py-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-sm shrink-0"
                    style={{ background: "#3B82F6" }}
                  />
                  <p className="text-[10px] text-blue-700 leading-tight">
                    Invitación marcada en la agenda
                  </p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto min-h-0">
                {INVITACIONES.map((sec, si) => (
                  <div key={si}>
                    <p className="py-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {sec.dia}
                    </p>
                    {sec.items.map((item, ii) => {
                      const id = `inv_${sec.dayIndex}_${ii}`;
                      const isSelected = selInv === id;
                      return (
                        <div
                          key={ii}
                          onClick={() => handleInvClick(sec.dayIndex, ii)}
                          className="mb-1 cursor-pointer rounded-lg px-2 py-2 transition-colors border"
                          style={{
                            background: isSelected ? "#E6F4FF" : "transparent",
                            borderColor: isSelected ? "#93C5FD" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              (
                                e.currentTarget as HTMLDivElement
                              ).style.background = "#F9FAFB";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              (
                                e.currentTarget as HTMLDivElement
                              ).style.background = "transparent";
                          }}
                        >
                          <p
                            className="text-[11px] font-semibold leading-tight mb-1"
                            style={{
                              color: isSelected ? "#1E3A8A" : "#111827",
                            }}
                          >
                            {item.nombre}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                            <MapPin size={8} /> {item.sala}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock size={8} /> {item.hora}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button className="shrink-0 w-full cursor-pointer rounded-lg border border-gray-200 py-1.5 text-[11px] text-gray-500 hover:border-violet-600 hover:text-violet-600 transition-colors bg-transparent">
                Mostrar todas
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
