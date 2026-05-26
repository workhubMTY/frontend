"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/shared/auth/useAuth";
import { officeSlotsApi } from "@/app/features/cubiculos/data/api";

interface Reserva {
  titulo: string;
  hora: string;
  lugar: string;
  estado: "Confirmada" | "Pendiente";
}
interface Persona {
  initials: string;
  name: string;
  role: string;
  reservas: Reserva[];
}
interface Invitacion {
  nombre: string;
  sala: string;
  hora: string;
  tipo: string;
}
interface DiaInvitaciones {
  dia: string;
  items: Invitacion[];
}
interface Evento {
  titulo: string;
  hora: string;
  lugar: string;
  tipo: string;
}

interface ReservationDetail {
  id: number;
  reservableId: number;
  startTime: string;
  endTime: string;
  canOverlap: boolean;
  workGroups: Array<{ id: number; name: string; description: string | null }>;
  participants: Array<{
    id: number;
    reservationId: number;
    userId: string | null;
    guestId: number | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    user: { id: string; name: string; email: string; role: string } | null;
    guest: { id: number; name: string; email: string } | null;
  }>;
}

interface UseHomeReturn {
  personas: Persona[];
  invitaciones: DiaInvitaciones[];
  eventos: Evento[];
  loading: boolean;
  error: Error | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getSpanishDayOfWeek(date: string): string {
  const d = new Date(date);
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[d.getUTCDay()];
}

function transformToPersonas(
  friendsReservations: ReservationDetail[],
): Persona[] {
  const personaMap = new Map<string, Persona>();

  for (const res of friendsReservations) {
    for (const participant of res.participants) {
      if (participant.user && participant.status === "ACCEPTED") {
        const userId = participant.user.id;
        if (!personaMap.has(userId)) {
          personaMap.set(userId, {
            initials: getInitials(participant.user.name),
            name: participant.user.name,
            role: participant.user.role,
            reservas: [],
          });
        }

        const persona = personaMap.get(userId)!;
        persona.reservas.push({
          titulo: `Reservación ${res.id}`,
          hora: `${formatTime(res.startTime)}–${formatTime(res.endTime)}`,
          lugar: `Espacio ${res.reservableId}`,
          estado: res.canOverlap ? "Pendiente" : "Confirmada",
        });
      }
    }
  }

  return Array.from(personaMap.values());
}

function transformToInvitations(
  myReservations: ReservationDetail[],
  userId: string,
): DiaInvitaciones[] {
  const invitationsByDay = new Map<string, Invitacion[]>();

  for (const res of myReservations) {
    const myParticipant = res.participants.find(
      (p) => p.userId === userId && p.status === "PENDING",
    );
    if (!myParticipant) continue;

    const day = getSpanishDayOfWeek(res.startTime);
    const invitacion: Invitacion = {
      nombre: `Reservación ${res.id}`,
      sala: `Espacio ${res.reservableId}`,
      hora: `${formatTime(res.startTime)}–${formatTime(res.endTime)}`,
      tipo: res.canOverlap ? "Evento" : "Reservación",
    };

    if (!invitationsByDay.has(day)) {
      invitationsByDay.set(day, []);
    }
    invitationsByDay.get(day)!.push(invitacion);
  }

  const daysOrder = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  return daysOrder
    .filter((day) => invitationsByDay.has(day))
    .map((day) => ({
      dia: day,
      items: invitationsByDay.get(day) || [],
    }));
}

function transformToEventos(myReservations: ReservationDetail[]): Evento[] {
  return myReservations
    .filter((res) => res.canOverlap)
    .map((res) => ({
      titulo: `Evento ${res.id}`,
      hora: `${formatTime(res.startTime)}–${formatTime(res.endTime)}`,
      lugar: `Espacio ${res.reservableId}`,
      tipo: "Evento",
    }));
}

export function useHome(): UseHomeReturn {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [invitaciones, setInvitaciones] = useState<DiaInvitaciones[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [myResData, friendsResData] = await Promise.all([
          officeSlotsApi.getMyReservations(),
          officeSlotsApi.getFriendsReservations(),
        ]);

        const myReservations =
          (myResData as unknown as ReservationDetail[]) || [];
        const friendsReservations =
          (friendsResData as unknown as ReservationDetail[]) || [];

        setPersonas(transformToPersonas(friendsReservations));
        setInvitaciones(transformToInvitations(myReservations, user.eId));
        setEventos(transformToEventos(myReservations));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Error fetching home data"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { personas, invitaciones, eventos, loading, error };
}
