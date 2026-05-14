"use client";
import { useState } from "react";

export function Avatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);

  if (avatarUrl && !hasImageError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setHasImageError(true)}
        className="size-12 shrink-0 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-purple-100 text-sm font-semibold text-purple-800">
      {initials}
    </div>
  );
}
