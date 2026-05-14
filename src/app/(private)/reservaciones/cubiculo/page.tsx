"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Calendar, Clock, Users, LogOut, X, Check } from "lucide-react";
import ListaInvitados from "@/app/components/ScrollInivitados/ListaInvitados";
import PageTransition from "@/app/components/PageTransition/PageTransition";
import { label } from "framer-motion/client";
import { reservacionesApi } from "@/app/modules/reservaciones/api";

interface Invitado {
  id: string;
  nombre: string;
  email: string;
  tipo: "colaborador" | "invitado" | "equipo";
}

interface BackendOfficeSlot {
  id: number;
  name: string;
  capacity: number;
  floor_id: number;
  is_blocked: boolean;
  floor_name: string;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface BackendGuest {
  id: number;
  name: string;
  email: string;
}

interface BackendWorkGroup {
  id: number;
  name: string;
  description: string | null;
  memberCount?: number;
}

interface Sesion {
  fecha: string;
  inicio: string;
  fin: string;
}

interface Equipo {
  id: string;
  nombre: string;
  miembros: number;
  color: string;
}

interface Persona {
  id: string;
  nombre: string;
  email: string;
}

const SESIONES: Sesion[] = [
  { fecha: "04/13", inicio: "07:00 AM", fin: "12:00 PM" },
  { fecha: "04/13", inicio: "02:00 PM", fin: "04:00 PM" },
];

const Avatar = ({
  nombre,
  variant = "colaborador",
  size = "md",
}: {
  nombre: string;
  variant?: "colaborador" | "invitado" | "equipo";
  size?: "sm" | "md";
}) => {
  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-sm";
  const colorClasses =
    variant === "colaborador"
      ? "bg-violet-100 text-violet-700"
      : "bg-sky-100 text-sky-700";

  return (
    <div
      className={`${sizeClasses} ${colorClasses} rounded-full flex items-center justify-center font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
};

export default function Cubiculo() {
    const [invitados, setInvitados] = useState<Invitado[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [nombreEquipo, setNombreEquipo] = useState("");
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const [crearEquipo, setCrearEquipo] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<BackendUser[]>([]);
    const [availableGuests, setAvailableGuests] = useState<BackendGuest[]>([]);
    const [availableWorkGroups, setAvailableWorkGroups] = useState<BackendWorkGroup[]>([]);
    const [officeSlots, setOfficeSlots] = useState<BackendOfficeSlot[]>([]);
    const [selectedOfficeSlotId, setSelectedOfficeSlotId] = useState<number | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const availablePeople = useMemo(() => {
        return [
            ...availableUsers.map((user) => ({
                id: user.id,
                nombre: user.name,
                email: user.email,
                tipo: "colaborador" as const,
            })),
            ...availableGuests.map((guest) => ({
                id: String(guest.id),
                nombre: guest.name,
                email: guest.email,
                tipo: "invitado" as const,
            })),
        ];
    }, [availableUsers, availableGuests]);

    const availableTeams = useMemo(() => {
        return availableWorkGroups.map((group) => ({
            id: `equipo-${group.id}`,
            nombre: group.name,
            miembros: group.memberCount ?? 0,
            color: "bg-violet-100",
        }));
    }, [availableWorkGroups]);

    const personasFiltradas =
        busqueda.length > 1
            ? availablePeople.filter(
                  (p) =>
                      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      p.email.toLowerCase().includes(busqueda.toLowerCase()),
              )
            : availablePeople;

    const equiposFiltrados =
        busqueda.length > 1
            ? availableTeams.filter((e) =>
                  e.nombre.toLowerCase().includes(busqueda.toLowerCase()),
              )
            : availableTeams;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setDropdownAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        async function loadReservationData() {
            try {
                const [slots, users, guests, groups] = await Promise.all([
                    reservacionesApi.getOfficeSlots(),
                    reservacionesApi.getUsers(),
                    reservacionesApi.getGuests(),
                    reservacionesApi.getWorkGroups(),
                ]);

                setOfficeSlots(slots);
                setAvailableUsers(users);
                setAvailableGuests(guests);
                setAvailableWorkGroups(groups);
                setSelectedOfficeSlotId(slots[0]?.id ?? null);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar los datos de reservación";
                setApiError(message);
            } finally {
                setIsLoadingData(false);
            }
        }

        loadReservationData();
    }, []);

    const eliminarInvitado = (id: string) => setInvitados((prev) => prev.filter((i) => i.id !== id));

    const agregarPersona = (persona: Persona) => {
        if (invitados.find((i) => i.email === persona.email)) return;
        setInvitados((prev) => [
            ...prev,
            {
                id: persona.id,
                nombre: persona.nombre,
                email: persona.email,
                tipo: "colaborador",
            },
        ]);
        setBusqueda("");
        setDropdownAbierto(false);
    };

    const agregarEquipo = (equipo: Equipo) => {
        if (invitados.find((i) => i.id === `equipo-${equipo.id}`)) return;
        setInvitados((prev) => [
            ...prev,
            {
                id: `equipo-${equipo.id}`,
                nombre: equipo.nombre,
                email: `${equipo.miembros} miembros`,
                tipo: "equipo",
            },
        ]);
        setBusqueda("");
        setNombreEquipo("");
        setDropdownAbierto(false);
    };

    const formatTimeTo24 = (time: string): string => {
        const [value, period] = time.split(" ");
        const [hours, minutes] = value.split(":").map(Number);
        let hour24 = hours % 12;
        if (period === "PM") hour24 += 12;
        return `${String(hour24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    };

    const handleFinalizar = async () => {
        if (crearEquipo && nombreEquipo.trim() === "") {
            setMensajeError("El nombre del equipo no puede estar vacio");
            return;
        }

        if (!selectedOfficeSlotId) {
            setMensajeError("No se encontró ningún cubículo para reservar");
            return;
        }

        if (invitados.length === 0) {
            setMensajeError("Agrega al menos un invitado o colaborador");
            return;
        }

        setMensajeError("");
        setApiError(null);
        setIsSubmitting(true);

        const userIds = invitados
            .filter((inv) => inv.tipo === "colaborador")
            .map((inv) => inv.id);

        const guestIds = invitados
            .filter((inv) => inv.tipo === "invitado")
            .map((inv) => Number(inv.id));

        const workGroupIds = invitados
            .filter((inv) => inv.tipo === "equipo")
            .map((inv) => Number(inv.id.replace("equipo-", "")));

        const today = new Date();
        const isoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
            today.getDate(),
        ).padStart(2, "0")}`;

        const schedules = SESIONES.map((sesion) => ({
            start_time: `${isoDate}T${formatTimeTo24(sesion.inicio)}`,
            end_time: `${isoDate}T${formatTimeTo24(sesion.fin)}`,
        }));

        try {
            await reservacionesApi.createReservationBatch({
                reservableId: selectedOfficeSlotId,
                schedules,
                workGroupIds: workGroupIds.length > 0 ? workGroupIds : undefined,
                userIds: userIds.length > 0 ? userIds : undefined,
                guestIds: guestIds.length > 0 ? guestIds : undefined,
                canOverlap: false,
            });
            setModalAbierto(true);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Error al crear la reservación";
            setApiError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOfficeSlot = officeSlots.find((slot) => slot.id === selectedOfficeSlotId) ?? null;

    const selectedRoomName = selectedOfficeSlot?.name ?? "Selecciona un cubículo";
    const selectedFloorName = selectedOfficeSlot?.floor_name ?? "-";
    const selectedCapacity = selectedOfficeSlot?.capacity ?? 0;
    const selectedBlocked = selectedOfficeSlot?.is_blocked ?? false;

    const handleRegresar = () => setModalAbierto(false);

    return (
        <PageTransition>
            <section className="flex h-screen w-full overflow-hidden bg-background-page">
                {modalAbierto && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setModalAbierto(false); }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-6 px-10 py-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 text-center">
                                Reserva finalizada
                            </h2>
                            <p className="text-gray-500 text-center text-base leading-relaxed">
                                Se ha enviado correo de invitación a los contactos seleccionados
                            </p>
                            <button
                                onClick={handleRegresar}
                                className="bg-violet-700 hover:bg-violet-800 text-white font-semibold text-base px-8 py-3 rounded-xl cursor-pointer border-none transition-colors w-full max-w-xs"
                            >
                                Regresar a reservas
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex-1 px-20 py-8  flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight m-0">
                            Reserva completa
                        </h3>
                    </div>

                    <div className="flex gap-6 flex-1 min-h-0">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 w-72 shrink-0 flex flex-col shadow-sm">
                            <div className="flex items-baseline justify-between mb-3">
                                <span className="font-bold text-lg text-gray-900">
                                    {isLoadingData ? "Cargando cubículo..." : selectedRoomName}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {selectedFloorName}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Selecciona cubículo
                                </label>
                                <select
                                    value={selectedOfficeSlotId ?? ""}
                                    onChange={(e) => setSelectedOfficeSlotId(Number(e.target.value))}
                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-400"
                                >
                                    <option value="" disabled>
                                        {isLoadingData ? "Cargando cubículos..." : "Elige un cubículo"}
                                    </option>
                                    {officeSlots.map((slot) => (
                                        <option key={slot.id} value={slot.id}>
                                            {slot.name} • {slot.floor_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-1.5 mb-3 text-gray-500">
                                <Users size={16} />
                                <span className="text-sm font-medium">{selectedCapacity}</span>
                            </div>
                            <div className="rounded-xl overflow-hidden w-full h-40 mb-5 bg-gradient-to-br from-slate-300 to-slate-400 flex flex-col items-center justify-center text-slate-500 text-sm text-center px-4">
                                {selectedOfficeSlot
                                    ? `Cubículo disponible en ${selectedFloorName}`
                                    : "Selecciona un cubículo para ver sus detalles"}
                            </div>
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                        <Calendar size={15} />
                                        <span>Horario de reserva</span>
                                    </div>
                                    <span className={`text-xs font-semibold ${selectedBlocked ? "text-red-600" : "text-slate-600"}`}>
                                        {selectedBlocked ? "Cubículo bloqueado" : "Disponible"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5 px-2 mb-1">
                                    <div className="flex justify-center">
                                        <Calendar size={15} className="text-gray-400" />
                                    </div>
                                    <div className="flex justify-center">
                                        <Clock size={15} className="text-gray-400" />
                                    </div>
                                    <div className="flex justify-center">
                                        <LogOut size={15} className="text-gray-400" />
                                    </div>
                                </div>

                                {SESIONES.map((s, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-3 gap-1.5 bg-gray-50 rounded-xl px-2 py-2.5 border border-gray-100"
                                    >
                                        <span className="text-xs font-semibold text-gray-700 text-center">
                                            {s.fecha}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-700 text-center">
                                            {s.inicio}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-700 text-center">
                                            {s.fin}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 gap-4 min-h-0">
                            <div
                                ref={searchRef}
                                className="bg-white rounded-2xl border border-gray-200 px-6 py-5 shadow-sm shrink-0 relative"
                            >
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex">
                                        <Search size={17} />
                                    </span>
                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        onFocus={() => setDropdownAbierto(true)}
                                        placeholder="Buscar un correo, nombre o equipo para invitar"
                                        className={`w-full py-3 pl-10 pr-3.5 border border-gray-200 text-sm text-gray-700 outline-none bg-white box-border font-[inherit] transition-colors focus:border-violet-400 ${
                                            dropdownAbierto ? "rounded-t-xl" : "rounded-xl"
                                        }`}
                                    />
                                    {dropdownAbierto && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-violet-400 border-t-0 rounded-b-xl shadow-xl z-50">
                                            <div className="px-4 pt-2.5 pb-1">
                                                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                                    Personas
                                                </span>
                                            </div>
                                            {personasFiltradas.length === 0 && !isLoadingData ? (
                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                    No se encontraron colaboradores o invitados.
                                                </div>
                                            ) : (
                                                personasFiltradas.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => agregarPersona(p)}
                                                        className="flex items-center gap-3 w-full px-4 py-2.5 bg-transparent border-none cursor-pointer text-left font-[inherit] hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Avatar
                                                            nombre={p.nombre}
                                                            variant="colaborador"
                                                            size="sm"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {p.nombre}
                                                            </div>
                                                            <div className="text-xs text-gray-400">{p.email}</div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                            <div className="px-4 pt-2.5 pb-1 border-t border-gray-100 mt-1">
                                                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                                    Equipos
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 px-4 pb-3.5 pt-2">
                                                {equiposFiltrados.length === 0 && !isLoadingData ? (
                                                    <div className="text-sm text-gray-500 px-2 py-2">
                                                        No hay equipos disponibles.
                                                    </div>
                                                ) : (
                                                    equiposFiltrados.map((eq) => (
                                                        <button
                                                            key={eq.id}
                                                            onClick={() => agregarEquipo(eq)}
                                                            className={`flex items-center gap-1.5 ${eq.color} border-none rounded-full px-3.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-700 font-[inherit] hover:opacity-75 transition-opacity`}
                                                        >
                                                            <Users size={13} />
                                                            {eq.nombre}
                                                            <span className="text-[11px] text-gray-500">
                                                                ({eq.miembros})
                                                            </span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col">
                                <div className="flex-1 overflow-y-auto px-6 pt-5 pb-3 flex flex-col gap-2.5">
                                    {invitados.map((inv) => (
                                    <div
                                        key={inv.id}
                                        className="flex items-center gap-3.5 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100 shrink-0 overflow-auto"
                                    >
                                        <Avatar nombre={inv.nombre} variant={inv.tipo} />
                                        <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-[15px] text-gray-900 mb-0.5">
                                            {inv.nombre}
                                        </div>
                                        <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {inv.email}
                                        </div>
                                        </div>
                                        {inv.tipo === "invitado" && (
                                        <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 rounded-md px-2 py-0.5 shrink-0">
                                            Invitado
                                        </span>
                                        )}
                                        <button
                                        onClick={() => eliminarInvitado(inv.id)}
                                        className="bg-transparent border-none cursor-pointer text-gray-400 flex items-center p-1 rounded-md shrink-0 hover:text-gray-700 transition-colors"
                                        aria-label="Eliminar invitado"
                                        >
                                        <X size={18} />
                                        </button>
                                    </div>
                                    ))}
                                    {invitados.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-8">
                                        No hay invitados agregados aún.
                                    </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4 shrink-0">
                                    <span className="text-sm text-gray-500">
                                        Crear equipo a partir de la selección
                                    </span>
                                    <button
                                        onClick={() => setCrearEquipo(!crearEquipo)}
                                        className={`w-11 h-11 rounded-xl border-none cursor-pointer flex items-center justify-center transition-colors shrink-0 ${
                                        crearEquipo ? "bg-violet-700" : "bg-gray-200"
                                        }`}
                                        aria-label="Toggle crear equipo"
                                    >
                                        {crearEquipo && <Check size={18} className="text-white" />}
                                    </button>
                                    {crearEquipo && (
                                        <div className="flex flex-col flex-1 gap-1">
                                            <input
                                                type="text"
                                                value={nombreEquipo}
                                                onChange={(e) => {setNombreEquipo(e.target.value); setMensajeError(""); }}
                                                placeholder="Ingresa el nombre del equipo"
                                                className={`flex-1 py-2.5 px-3.5 border rounded-xl text-sm text-gray-700 outline-none bg-white font-[inherit] transition-colors
                                                    ${nombreEquipo.trim() === "" 
                                                    ? "border-red-300 focus:border-red-400" 
                                                    : "border-gray-200 focus:border-violet-400"
                                                }`}
                                            />
                                                {mensajeError && (
                                                    <span className="text-xs text-red-500 pl-1">{mensajeError}</span>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {apiError && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {apiError}
                        </div>
                    )}
                    <button
                        onClick={handleFinalizar}
                        disabled={isLoadingData || isSubmitting}
                        className={`shrink-0 mt-3 w-full p-3 text-white border-none rounded-lg text-lg font-bold cursor-pointer tracking-wide transition-all font-[inherit] no-select ${
                            isLoadingData || isSubmitting
                                ? "bg-violet-300 cursor-not-allowed"
                                : "bg-violet-700 hover:bg-violet-800 active:scale-99"
                        }`}
                    >
                        {isSubmitting ? "Enviando..." : isLoadingData ? "Cargando..." : "Finalizar"}
                    </button>
                </div>
            </section>
        </PageTransition>
    );
}
