"use client";

import { cn } from "@/app/shared/lib/cn";

import type { HomeAgendaOwner } from "@/app/features/home/types/homeAgenda";

import { HomeAgendaPersonAvatar } from "./HomeAgendaPersonAvatar";

type HomeAgendaPersonItemProps = {
  owner: HomeAgendaOwner;
  isSelected: boolean;
  onSelect: (ownerId: string) => void;
};

export function HomeAgendaPersonItem({
  owner,
  isSelected,
  onSelect,
}: HomeAgendaPersonItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(owner.eId)}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
        isSelected
          ? "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <HomeAgendaPersonAvatar
        name={owner.name}
        avatarUrl={owner.avatarUrl}
        isSelected={isSelected}
      />

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
}