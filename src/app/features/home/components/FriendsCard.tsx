"use client";

import { UserRound } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { HomeAgendaOwner } from "../types/homeAgenda";

type HomeAgendaPeopleCardProps = {
  owners: HomeAgendaOwner[];
  selectedOwnerId: string | null;
  isLoading?: boolean;
  onSelectOwner: (ownerId: string) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function HomeAgendaPeopleCard({
  owners,
  selectedOwnerId,
  isLoading = false,
  onSelectOwner,
}: HomeAgendaPeopleCardProps) {
  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Agenda</h2>
        <p className="mt-1 text-xs text-slate-500">
          Selecciona tu agenda o la de un amigo.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-1 p-3">
        {isLoading ? (
          <div className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">
            Cargando amigos...
          </div>
        ) : owners.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">
            No hay agendas disponibles.
          </div>
        ) : (
          owners.map((owner) => {
            const isSelected = selectedOwnerId === owner.eId;

            return (
              <button
                key={`${owner.kind}-${owner.eId}`}
                type="button"
                onClick={() => onSelectOwner(owner.eId)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                  isSelected
                    ? "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {owner.avatarUrl ? (
                  <img
                    src={owner.avatarUrl}
                    alt={owner.name}
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "grid size-9 place-items-center rounded-full text-xs font-semibold",
                      isSelected
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {owner.name ? (
                      getInitials(owner.name)
                    ) : (
                      <UserRound className="size-4" />
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{owner.name}</p>
                  <p
                    className={cn(
                      "text-xs",
                      isSelected ? "text-violet-500" : "text-slate-400",
                    )}
                  >
                    {owner.kind === "me" ? "Mi agenda" : "Amigo"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}