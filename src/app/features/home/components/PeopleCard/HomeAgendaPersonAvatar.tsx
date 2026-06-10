"use client";

import { UserRound } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";

type HomeAgendaPersonAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  isSelected?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function HomeAgendaPersonAvatar({
  name,
  avatarUrl,
  isSelected = false,
}: HomeAgendaPersonAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="size-9 rounded-full object-cover"
      />
    );
  }

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "grid size-9 place-items-center rounded-full text-xs font-semibold",
        isSelected
          ? "bg-violet-100 text-violet-700"
          : "bg-slate-100 text-slate-500",
      )}
    >
      {initials || <UserRound className="size-4" />}
    </div>
  );
}