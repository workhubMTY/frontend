"use client";

import {
  Check,
  Search,
  SlidersHorizontal,
  Trophy,
  Users,
  X,
} from "lucide-react";
import type { Friend } from "../../types/profile";
import { useEffect, useMemo, useState } from "react";

type FriendsDrawerProps = {
  isOpen: boolean;
  friends: Friend[];
  selectedFriendId?: string | null;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onInviteFriends?: () => void;
};

type SortOption = "name-asc" | "name-desc";

export function FriendsDrawer({
  isOpen,
  friends,
  selectedFriendId,
  onClose,
  onCompareFriend,
  onClearComparison,
  onInviteFriends,
}: FriendsDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  useEffect(() => console.log(selectedFriendId), [selectedFriendId]);

  const filteredFriends = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = friends.filter((friend) => {
      const name = friend.name.toLowerCase();
      const role = friend.role.toLowerCase();

      return name.includes(normalizedSearch) || role.includes(normalizedSearch);
    });

    return filtered.sort((a, b) => {
      if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [friends, searchTerm, sortOption]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        <header className="border-b border-neutral-100 px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Todas las amistades
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar amistades"
                className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
              />

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
                className="h-11 appearance-none border border-neutral-200 bg-white pl-11 pr-10 text-sm text-neutral-700 outline-none transition focus:border-purple-700"
              >
                <option value="name-asc">Ordenar A-Z</option>
                <option value="name-desc">Ordenar Z-A</option>
              </select>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredFriends.length > 0 ? (
            <ul className="divide-y divide-neutral-100">
              {filteredFriends.map((friend) => {
                const isSelected = friend.id === selectedFriendId;
                // console.log(friend.id, selectedFriendId);
                return (
                  <article
                    key={friend.id}
                    className={[
                      "grid items-center gap-4 px-7 py-4 transition",
                      "md:grid-cols-[1fr_auto]",
                      isSelected
                        ? "border-l-4 border-purple-700 bg-purple-50/70 pl-6"
                        : "border-l-4 border-transparent hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-neutral-950">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {friend.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          isSelected
                            ? onClearComparison()
                            : onCompareFriend(friend.id)
                        }
                        className={[
                          "inline-flex h-10 items-center gap-2 border px-4 text-sm font-medium transition",
                          isSelected
                            ? "border-purple-700 bg-purple-700 text-white hover:bg-purple-800"
                            : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
                        ].join(" ")}
                      >
                        {isSelected ? (
                          <Check size={17} />
                        ) : (
                          <Trophy size={17} />
                        )}
                        {isSelected ? "Comparando" : "Comparar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="mb-4 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
                <Users size={22} />
              </div>

              <h3 className="text-base font-semibold text-neutral-950">
                No se encontraron amistades
              </h3>

              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Intenta buscar con otro nombre o invita a más amigos.
              </p>
            </div>
          )}
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <button
            type="button"
            onClick={onInviteFriends}
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
          >
            <Users size={18} />
            Invitar a más amigos
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
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
