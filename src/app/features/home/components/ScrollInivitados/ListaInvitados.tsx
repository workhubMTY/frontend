"use client";

import { X, Check } from "lucide-react";

interface Invitado {
  id: string;
  nombre: string;
  email: string;
  tipo: "colaborador" | "invitado";
}

const Avatar = ({
  nombre,
  variant = "colaborador",
}: {
  nombre: string;
  variant?: "colaborador" | "invitado";
}) => {
  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colorClasses =
    variant === "colaborador"
      ? "bg-violet-100 text-violet-700"
      : "bg-sky-100 text-sky-700";

  return (
    <div
      className={`w-10 h-10 text-sm ${colorClasses} rounded-full flex items-center justify-center font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
};

interface ListaInvitadosProps {
  invitados: Invitado[];
  crearEquipo: boolean;
  onEliminar: (id: string) => void;
  onToggleCrearEquipo: () => void;
}

export default function ListaInvitados({
  invitados,
  crearEquipo,
  onEliminar,
  onToggleCrearEquipo,
}: ListaInvitadosProps) {
  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-5 pb-3 flex flex-col gap-2.5">
        {invitados.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center gap-3.5 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100 shrink-0"
          >
            <Avatar nombre={inv.nombre} variant={inv.tipo} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-gray-900 mb-0.5">
                {inv.nombre}
              </div>
              <div className="text-sm text-gray-500 truncate">{inv.email}</div>
            </div>
            {inv.tipo === "invitado" && (
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 rounded-md px-2 py-0.5 shrink-0">
                Invitado
              </span>
            )}
            <button
              onClick={() => onEliminar(inv.id)}
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
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 shrink-0">
        <span className="text-sm text-gray-500">
          Crear equipo a partir de la selección
        </span>
        <button
          onClick={onToggleCrearEquipo}
          className={`w-11 h-11 rounded-xl border-none cursor-pointer flex items-center justify-center transition-colors shrink-0 ${
            crearEquipo ? "bg-violet-700" : "bg-gray-200"
          }`}
          aria-label="Toggle crear equipo"
        >
          {crearEquipo && (
            <Check size={18} className="text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </>
  );
}