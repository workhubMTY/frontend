"use client";
import {
  Check,
  Search,
  SlidersHorizontal,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Friend } from "../../../types/profile";
import { useMemo, useState } from "react";
import { SortOption } from "./types";
import { Avatar } from "../../utils/Avatar";

type FriendsListModeProps = {
  friends: Friend[];
  selectedFriendId?: string | null;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onInviteMode: () => void;
};

export function FriendsListMode({
  friends,
  selectedFriendId,
  onClose,
  onCompareFriend,
  onClearComparison,
  onInviteMode,
}: FriendsListModeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const filteredFriends = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingFriends = friends.filter((friend) => {
      if (!normalizedSearch) return true;

      return (
        friend.name.toLowerCase().includes(normalizedSearch) ||
        friend.email.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...matchingFriends].sort((a, b) => {
      if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [friends, searchTerm, sortOption]);

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Todas las amistades
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Consulta tus amistades y elige con quién comparar logros.
            </p>
          </div>

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
              const isSelected = friend.eId === selectedFriendId;

              return (
                <article
                  key={friend.eId}
                  className={[
                    "grid items-center gap-4 px-7 py-4 transition",
                    "md:grid-cols-[1fr_auto]",
                    isSelected
                      ? "border-l-4 border-purple-700 bg-purple-50/70 pl-6"
                      : "border-l-4 border-transparent hover:bg-neutral-50",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <Avatar name={friend.name} avatarUrl={friend.avatarUrl} />

                    <div className="min-w-0">
                      <h3 className="truncate text-md font-semibold text-neutral-950">
                        {friend.name}
                      </h3>
                      <h4 className="truncate text-sm font-light text-neutral-500">
                        {friend.email}
                      </h4>

                      <p className="text-sm text-neutral-500">{friend.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        isSelected
                          ? onClearComparison()
                          : onCompareFriend(friend.eId)
                      }
                      className={[
                        "inline-flex h-10 items-center gap-2 border px-4 text-sm font-medium transition",
                        isSelected
                          ? "border-purple-700 bg-purple-700 text-white hover:bg-purple-800"
                          : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      {isSelected ? <Check size={17} /> : <Trophy size={17} />}
                      {isSelected ? "Comparando" : "Comparar"}
                    </button>
                  </div>
                </article>
              );
            })}
          </ul>
        ) : (
          <EmptyFriendsState />
        )}
      </div>

      <footer className="border-t border-neutral-100 bg-white px-8 py-5">
        <button
          type="button"
          onClick={onInviteMode}
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          <UserPlus size={18} />
          Invitar a más amigos
        </button>
      </footer>
    </>
  );
}

function EmptyFriendsState() {
  return (
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
  );
}
