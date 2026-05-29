"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Calendar, Clock, Users, LogOut, X, Check } from "lucide-react";
import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { useRouter } from "next/navigation";
import { officeSlotsApi } from "@/app/features/cubiculos/data/api";

interface Invitado {
  id: string;
  nombre: string;
  email: string;
  tipo: "colaborador" | "invitado";
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
  tipo: "colaborador" | "invitado";
}

const teamColors = [
  "bg-violet-100",
  "bg-pink-100",
  "bg-sky-100",
  "bg-green-100",
];

const Avatar = ({
  nombre,
  variant = "colaborador",
  size = "md",
}: {
  nombre: string;
  variant?: "colaborador" | "invitado";
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

export default function CubiculoConfirmarPage() {
  const router = useRouter();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [reservationDraft, setReservationDraft] = useState<{
    reservableId: number;
    reservableName: string;
    schedules: { start_time: string; end_time: string }[];
  } | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [crearEquipo, setCrearEquipo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const personasFiltradas =
    busqueda.length > 1
      ? personas.filter(
          (p) =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.email.toLowerCase().includes(busqueda.toLowerCase()),
        )
      : personas;

  const equiposFiltrados =
    busqueda.length > 1
      ? equipos.filter((e) =>
          e.nombre.toLowerCase().includes(busqueda.toLowerCase()),
        )
      : equipos;

  useEffect(() => {
    const load = async () => {
      const draftRaw = window.sessionStorage.getItem(
        "cubiculos:reservationDraft",
      );
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        setReservationDraft(draft);
        setSesiones(
          (draft.schedules ?? []).map(
            (schedule: { start_time: string; end_time: string }) => {
              const start = new Date(schedule.start_time);
              const end = new Date(schedule.end_time);
              return {
                fecha: `${String(start.getMonth() + 1).padStart(2, "0")}/${String(start.getDate()).padStart(2, "0")}`,
                inicio: start.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                fin: end.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
            },
          ),
        );
      }

      const [users, guests, workGroups] = await Promise.all([
        officeSlotsApi.getUsers(),
        officeSlotsApi.getGuests(),
        officeSlotsApi.getWorkGroups(),
      ]);

      setPersonas([
        ...users.map((u) => ({
          id: u.id,
          nombre: u.name,
          email: u.email,
          tipo: "colaborador" as const,
        })),
        ...guests.map((g) => ({
          id: `guest-${g.id}`,
          nombre: g.name,
          email: g.email,
          tipo: "invitado" as const,
        })),
      ]);

      setEquipos(
        workGroups.map((group, index) => ({
          id: String(group.id),
          nombre: group.name,
          miembros: group.memberCount ?? 0,
          color: teamColors[index % teamColors.length] ?? "bg-violet-100",
        })),
      );
    };

    void load();

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eliminarInvitado = (id: string) =>
    setInvitados((prev) => prev.filter((i) => i.id !== id));

  const agregarPersona = (persona: Persona) => {
    if (invitados.find((i) => i.id === persona.id || i.email === persona.email))
      return;
    setInvitados((prev) => [
      ...prev,
      {
        id: persona.id,
        nombre: persona.nombre,
        email: persona.email,
        tipo: persona.tipo,
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
        tipo: "colaborador",
      },
    ]);
    setBusqueda("");
    setNombreEquipo("");
    setDropdownAbierto(false);
  };

  const handleFinalizar = async () => {
    if (crearEquipo && nombreEquipo.trim() === "") {
      setMensajeError("El nombre del equipo no puede estar vacio");
      return;
    }

    if (reservationDraft?.reservableId && reservationDraft.schedules?.length) {
      const userIds = invitados
        .filter(
          (item) =>
            !item.id.startsWith("guest-") && !item.id.startsWith("equipo-"),
        )
        .map((item) => item.id);

      const guestIds = invitados
        .filter((item) => item.id.startsWith("guest-"))
        .map((item) => Number(item.id.replace("guest-", "")));

      const workGroupIds = invitados
        .filter((item) => item.id.startsWith("equipo-"))
        .map((item) => Number(item.id.replace("equipo-", "")));

      await officeSlotsApi.createReservationBatch({
        reservableId: reservationDraft.reservableId,
        description: "",
        schedules: reservationDraft.schedules,
        workGroupIds,
        userIds,
        guestIds,
        canOverlap: false,
      });
    }
    setModalAbierto(true);
  };

  const handleRegresar = () => {
    setModalAbierto(false);
    router.push("/cubiculos");
  };

  return (
    <PageTransition>
      <section className="flex h-screen w-full overflow-hidden bg-background-page">
        {modalAbierto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalAbierto(false);
            }}
          >
            <div className="bg-white shadow-2xl w-full max-w-md mx-6 px-10 py-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Reserva finalizada
              </h2>
              <p className="text-gray-500 text-center text-base leading-relaxed">
                Se ha enviado correo de invitacion a los contactos seleccionados
              </p>
              <button
                onClick={handleRegresar}
                className="bg-violet-700 hover:bg-violet-800 text-white font-semibold text-base px-8 py-3 cursor-pointer border-none transition-colors w-full max-w-xs"
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
            <div className="bg-white border border-gray-200 p-6 w-72 shrink-0 flex flex-col shadow-sm">
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-bold text-lg text-gray-900">
                  {reservationDraft?.reservableName ?? "Espacio"}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {reservationDraft?.reservableId ?? "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-3 text-gray-500">
                <Users size={16} />
                <span className="text-sm font-medium">--</span>
              </div>
              <div className="overflow-hidden w-full h-40 mb-5 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 text-sm">
                No me jalo la imagen
              </div>
              <div className="flex flex-col gap-5">
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

                {sesiones.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 gap-1.5 bg-gray-50 px-2 py-2.5 border border-gray-100"
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
                className="bg-white border border-gray-200 px-6 py-5 shadow-sm shrink-0 relative"
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
                    className={`w-full py-3 pl-10 pr-3.5 border border-gray-200 text-sm text-gray-700 outline-none bg-white box-border font-[inherit] transition-colors focus:border-violet-400 `}
                  />
                  {dropdownAbierto && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-violet-400 border-t-0 rounded-b-xl shadow-xl z-50">
                      <div className="px-4 pt-2.5 pb-1">
                        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                          Recientes
                        </span>
                      </div>
                      {personasFiltradas.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => agregarPersona(p)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 bg-transparent border-none cursor-pointer text-left font-[inherit] hover:bg-gray-50 transition-colors"
                        >
                          <Avatar
                            nombre={p.nombre}
                            variant={p.tipo}
                            size="sm"
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {p.nombre}
                            </div>
                            <div className="text-xs text-gray-400">
                              {p.email}
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="px-4 pt-2.5 pb-1 border-t border-gray-100 mt-1">
                        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                          Equipos
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 px-4 pb-3.5 pt-2">
                        {equiposFiltrados.map((eq) => (
                          <button
                            key={eq.id}
                            onClick={() => agregarEquipo(eq)}
                            className={`flex items-center gap-1.5 ${eq.color} border-none px-3.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-700 font-[inherit] hover:opacity-75 transition-opacity`}
                          >
                            <Users size={13} />
                            {eq.nombre}
                            <span className="text-[11px] text-gray-500">
                              ({eq.miembros})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 pt-5 pb-3 flex flex-col gap-2.5">
                  {invitados.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center gap-3.5 bg-gray-50 px-3.5 py-3 border border-gray-100 shrink-0 overflow-auto"
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
                      No hay invitados agregados aun.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4 shrink-0">
                  <span className="text-sm text-gray-500">
                    Crear equipo a partir de la seleccion
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
                        onChange={(e) => {
                          setNombreEquipo(e.target.value);
                          setMensajeError("");
                        }}
                        placeholder="Ingresa el nombre del equipo"
                        className={`flex-1 py-2.5 px-3.5 border rounded-xl text-sm text-gray-700 outline-none bg-white font-[inherit] transition-colors ${
                          nombreEquipo.trim() === ""
                            ? "border-red-300 focus:border-red-400"
                            : "border-gray-200 focus:border-violet-400"
                        }`}
                      />
                      {mensajeError && (
                        <span className="text-xs text-red-500 pl-1">
                          {mensajeError}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleFinalizar}
            className="shrink-0 mt-4 w-full p-3 bg-violet-700 text-white border-none text-lg font-bold cursor-pointer tracking-wide transition-all hover:bg-violet-800 active:scale-99 font-[inherit] no-select"
          >
            Finalizar
          </button>
        </div>
      </section>
    </PageTransition>
  );
}
