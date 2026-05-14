"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Search, UserPlus, Clock, MapPin,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import AgendaRapida from "@/app/components/AgendaRapida/AgendaRapida";
import PageTransition from "@/app/components/PageTransition/PageTransition";
import { CalEvent, EventColorKey, EVENT_COLORS, CAL_EVENTS } from "@/app/types/Agenda";
import { useHome } from "@/app/modules/home/useHome";
import {
  useFriends,
  useSentFriendRequests,
  useReceivedFriendRequests,
} from "@/app/modules/friendships/hooks";

interface Invitacion { nombre: string; sala: string; hora: string; tipo: string; }
interface DiaInvitaciones { dia: string; items: Invitacion[]; }
interface Evento { titulo: string; hora: string; lugar: string; tipo: string; }
interface Reserva { titulo: string; hora: string; lugar: string; estado: "Confirmada" | "Pendiente"; }
interface Persona { initials: string; name: string; role: string; reservas: Reserva[]; }
interface SelectedEvent { titulo: string; hora: string; lugar: string; tipo: string; color?: EventColorKey; }

// Helper to extract initials from a name
function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const PERSON_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#DDEEFE", text: "#185FA5" },
  { bg: "#D6F5E6", text: "#0F6E56" },
];

function EventDetail({
  event, onPrev, onNext, showDots, dotCount, dotActive, onDot,
}: {
  event: SelectedEvent;
  onPrev?: () => void; onNext?: () => void;
  showDots: boolean; dotCount: number; dotActive: number;
  onDot: (i: number) => void;
}) {
  const c = event.color ? EVENT_COLORS[event.color as EventColorKey] : null;

  return (
    <div className="shrink-0 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <h3 className="text-[0.85rem] font-semibold text-gray-900">Juntas y Eventos</h3>
        {(onPrev || onNext) && (
          <div className="flex gap-1.5">
            <button onClick={onPrev}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-colors cursor-pointer bg-white">
              <ChevronLeft size={12} />
            </button>
            <button onClick={onNext}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:border-violet-500 hover:text-violet-500 transition-colors cursor-pointer bg-white">
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3 px-4 py-3">
        <div
          className="flex h-16 w-[22%] shrink-0 items-center justify-center rounded-lg"
          style={{ background: c?.bg ?? "#EEEDFE", borderLeft: `3px solid ${c?.border ?? "#7F77DD"}` }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={c?.border ?? "#7F77DD"} strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-gray-900">{event.titulo}</p>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: c?.bg ?? "#EEEDFE", color: c?.text ?? "#534AB7" }}>
              {event.tipo}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Clock size={10} /> {event.hora}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <MapPin size={10} /> {event.lugar}
          </div>
          <button className="mt-1 self-start rounded-md border border-violet-600 px-3 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-600 hover:text-white transition-colors cursor-pointer bg-transparent">
            Mostrar en agenda
          </button>
        </div>
      </div>

      {showDots && (
        <div className="flex justify-center gap-1.5 pb-3">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button key={i} onClick={() => onDot(i)}
              className="h-1.5 rounded-full border-none cursor-pointer transition-all"
              style={{ width: i === dotActive ? "14px" : "6px", background: i === dotActive ? "#7F77DD" : "#D1D5DB" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReservacionesModal({ persona, idx, onClose }: { persona: Persona; idx: number; onClose: () => void }) {
  const pc = PERSON_COLORS[idx] ?? PERSON_COLORS[0];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex w-80 max-h-[70vh] flex-col rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
              style={{ background: pc.bg, color: pc.text }}>
              {persona.initials}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">{persona.name}</p>
              <p className="text-[11px] text-gray-400">{persona.role}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Reservaciones esta semana
          </p>
          <div className="flex flex-col gap-2">
            {persona.reservas.map((r, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-gray-900">{r.titulo}</p>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={r.estado === "Confirmada"
                      ? { background: "#D6F5E6", color: "#0F6E56" }
                      : { background: "#FAEEDA", color: "#854F0B" }}>
                    {r.estado}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock size={9} /> {r.hora}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                  <MapPin size={9} /> {r.lugar}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { invitaciones, eventos, loading, error } = useHome();

  const friends = useFriends();
  const { data: sentRequests, createFriendRequest, cancelFriendRequest } = useSentFriendRequests();
  const { data: receivedRequests, acceptFriendRequest, rejectFriendRequest } = useReceivedFriendRequests();

  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [curEv, setCurEv] = useState(0);
  const [selInv, setSelInv] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<SelectedEvent | null>(null);
  const [eventSource, setEventSource] = useState<"carousel" | "cal" | "inv">("carousel");

  const shownEvent: SelectedEvent = activeEvent ?? (eventos.length > 0 ? { ...eventos[curEv] } : { titulo: "Sin eventos", hora: "N/A", lugar: "N/A", tipo: "N/A" });
  const showDots = eventSource === "carousel" && !activeEvent;
  const showNavBtns = eventSource === "carousel";

  const handleCalEvent = useCallback((ev: CalEvent) => {
    setActiveEvent({ titulo: ev.title, hora: ev.hora, lugar: ev.lugar, tipo: ev.tipo, color: ev.color });
    setEventSource("cal");
    setSelInv(null);
  }, []);

  const handleInvClick = useCallback((inv: Invitacion, id: string) => {
    setSelInv(id);
    setActiveEvent({ titulo: inv.nombre, hora: inv.hora, lugar: inv.sala, tipo: inv.tipo });
    setEventSource("inv");
  }, []);

  const handleCarousel = useCallback((idx: number) => {
    setCurEv(idx);
    setActiveEvent(null);
    setEventSource("carousel");
    setSelInv(null);
  }, []);

  const handlePersonClick = useCallback((i: number) => {
    setSelectedPerson(i);
    setModalIdx(i);
  }, []);

  return (
    <PageTransition>
      <section className="flex h-[100svh] w-full flex-col bg-background-page overflow-hidden">
        <div className="flex h-full w-full flex-col px-[3%] py-[2%]">
          <h1 className="shrink-0 mb-3 text-2xl font-bold tracking-tight text-gray-900">
            Bienvenido, Croissant
          </h1>
          <div
            className="flex-1 min-h-0 grid gap-3"
            style={{ gridTemplateColumns: "minmax(180px, 18%) 1fr minmax(180px, 18%)" }}
          >
            <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 gap-3">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-[0.85rem] font-semibold text-gray-900">Red personal</span>
                <button className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-violet-600 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                  <UserPlus size={12} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto min-h-0">
                {friends.isLoading ? (
                  <p className="text-[12px] text-gray-500 text-center py-4">Cargando...</p>
                ) : friends.isError ? (
                  <p className="text-[12px] text-red-500 text-center py-4">Error al cargar datos</p>
                ) : !friends.data || friends.data.length === 0 ? (
                  <p className="text-[12px] text-gray-500 text-center py-4">Sin amigos</p>
                ) : (
                  friends.data.map((friend, i) => (
                    <button key={i} onClick={() => handlePersonClick(i)}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-2 py-2 text-left font-[inherit] transition-colors"
                      style={{ background: selectedPerson === i ? "#EEEDFE" : "transparent" }}>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                        style={{ background: PERSON_COLORS[i % PERSON_COLORS.length].bg, color: PERSON_COLORS[i % PERSON_COLORS.length].text }}>
                        {getInitials(friend.name)}
                      </div>
                      <div>
                        <p className="text-[12px] font-medium leading-tight"
                          style={{ color: selectedPerson === i ? "#534AB7" : "#111827" }}>
                          {friend.name}
                        </p>
                        <p className="text-[10px] leading-tight"
                          style={{ color: selectedPerson === i ? "#8B7FCC" : "#9CA3AF" }}>
                          {friend.roleName}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Search size={11} className="shrink-0 text-gray-400" />
                <input type="text" placeholder="Buscar"
                  className="w-full bg-transparent text-[11px] text-gray-700 outline-none placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col min-h-0 gap-3">
              <div className="flex-1 min-h-0">
                <AgendaRapida onEventClick={handleCalEvent} />
              </div>

              <EventDetail
                event={shownEvent}
                onPrev={showNavBtns ? () => handleCarousel((curEv - 1 + eventos.length) % eventos.length) : undefined}
                onNext={showNavBtns ? () => handleCarousel((curEv + 1) % eventos.length) : undefined}
                showDots={showDots}
                dotCount={eventos.length}
                dotActive={curEv}
                onDot={handleCarousel}
              />
            </div>

            <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-4 gap-3">
              <span className="shrink-0 text-[0.85rem] font-semibold text-gray-900">Invitaciones</span>
              <div className="flex-1 overflow-y-auto min-h-0">
                {loading ? (
                  <p className="text-[12px] text-gray-500 text-center py-4">Cargando...</p>
                ) : error ? (
                  <p className="text-[12px] text-red-500 text-center py-4">Error al cargar</p>
                ) : invitaciones.length === 0 ? (
                  <p className="text-[12px] text-gray-500 text-center py-4">Sin invitaciones</p>
                ) : (
                  invitaciones.map((sec, si) => (
                    <div key={si}>
                      <p className="py-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        {sec.dia}
                      </p>
                      {sec.items.map((item, ii) => {
                        const id = `inv_${si}_${ii}`;
                        const isSelected = selInv === id;
                        return (
                          <div key={ii}
                            onClick={() => handleInvClick(item, id)}
                            className="mb-1 cursor-pointer rounded-lg px-2 py-2 transition-colors"
                            style={{ background: isSelected ? "#EEEDFE" : "transparent" }}
                            onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB"; }}
                            onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                          >
                            <p className="text-[11px] font-semibold leading-tight mb-1"
                              style={{ color: isSelected ? "#534AB7" : "#111827" }}>
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
                  ))
                )}
              </div>
              <button className="shrink-0 w-full cursor-pointer rounded-lg border border-gray-200 py-1.5 text-[11px] text-gray-500 hover:border-violet-600 hover:text-violet-600 transition-colors bg-transparent">
                Mostrar todas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de reservaciones deshabilitado - se activará cuando se integren datos de reservaciones con amigos */}
    </PageTransition>
  );
}