"use client";

import { Search, Users, WifiOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFriends } from "@/app/features/home/hooks/unused/useFriends";

const AVATAR_PALETTE = [
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#DBEAFE", text: "#1D4ED8" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#E0F2FE", text: "#0369A1" },
  { bg: "#FFEDD5", text: "#9A3412" },
];

function getColor(eId: string) {
  let hash = 0;
  for (let i = 0; i < eId.length; i++) hash = eId.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type PanelRedProps = {
  selectedFriendId: string | null;
  onFriendClick: (eId: string) => void;
};

export function PanelRed({ selectedFriendId, onFriendClick }: PanelRedProps) {
  const { friends, status, error } = useFriends();
  const [query, setQuery] = useState("");

  const filtered = friends.filter((f) =>
    (f.name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const activeFriend = friends.find(
    (f) => (f.eId ?? (f as any).e_id) === selectedFriendId
  );

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-violet-600" />
          <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
            Red personal
          </h2>
        </div>

        {status === "success" && (
          <span className="flex items-center gap-1 text-[0.6rem] text-emerald-600 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {friends.length} contacto{friends.length !== 1 ? "s" : ""}
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-[0.6rem] text-red-500">
            <WifiOff size={10} /> Sin conexión
          </span>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        {/* Banner selección activa */}
        {selectedFriendId && activeFriend && (
          <div className="shrink-0 flex items-center gap-2 rounded-md border-l-4 border-violet-600 bg-violet-50/80 px-3 py-2">
            <span className="text-xs text-violet-900">
              Viendo agenda de{" "}
              <strong>{activeFriend.name?.split(" ")[0]}</strong>
            </span>
            <button
              type="button"
              onClick={() => onFriendClick(selectedFriendId)}
              className="ml-auto text-[0.6rem] text-violet-400 hover:text-violet-700 transition-colors"
            >
              Quitar
            </button>
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col divide-y divide-neutral-100 overflow-y-auto">
          {status === "loading" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-neutral-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs">Cargando contactos...</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-neutral-400">
              <WifiOff size={16} />
              <span className="text-xs text-center px-4">
                {error ?? "No se pudieron cargar los contactos"}
              </span>
            </div>
          )}

          {status === "success" && filtered.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-neutral-400">
              <Users size={16} />
              <span className="text-xs">
                {query ? "Sin resultados" : "Aún no tienes contactos"}
              </span>
            </div>
          )}

          {status === "success" &&
            filtered.map((friend) => {
              const eId = friend.eId ?? (friend as any).e_id ?? "";
              const color = getColor(eId);
              const initials = getInitials(friend.name ?? "");
              const isSelected = selectedFriendId === eId;

              return (
                <button
                  type="button"
                  key={eId}
                  onClick={() => onFriendClick(eId)}
                  className={[
                    "grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 text-left transition-all",
                    isSelected
                      ? "border-l-4 border-violet-600 bg-violet-50/60 pl-2"
                      : "border-l-4 border-transparent hover:bg-neutral-50",
                  ].join(" ")}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {friend.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {(friend as any).email ?? eId}
                    </p>
                  </div>
                  <span className={[
                    "text-xs font-medium transition-colors",
                    isSelected ? "text-violet-600" : "text-neutral-300",
                  ].join(" ")}>
                    {isSelected ? "Activo" : "Ver"}
                  </span>
                </button>
              );
            })}
        </div>
        <div className="shrink-0 border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 focus-within:border-violet-300 focus-within:ring-1 focus-within:ring-violet-100 transition-all">
            <Search size={13} className="shrink-0 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar contacto..."
              className="w-full bg-transparent text-xs text-neutral-700 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}