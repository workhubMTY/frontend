"use client";

import {
  Check,
  Clock,
  Search,
  SlidersHorizontal,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Friend } from "../../../types/profile";
import type { FriendsListTab, SentFriendRequest, SortOption } from "./types";

import { Avatar } from "../../utils/Avatar";
import { FriendsTabs } from "./FriendsTabs";

type FriendsListModeProps = {
  friends: Friend[];
  sentRequests: SentFriendRequest[];
  selectedFriendId?: string | null;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onInviteMode: () => void;
};

export function FriendsListMode({
  friends,
  sentRequests,
  selectedFriendId,
  onClose,
  onCompareFriend,
  onClearComparison,
  onInviteMode,
}: FriendsListModeProps) {
  const [activeTab, setActiveTab] = useState<FriendsListTab>("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredFriends = useMemo(() => {
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
  }, [friends, normalizedSearch, sortOption]);

  const filteredSentRequests = useMemo(() => {
    const matchingRequests = sentRequests.filter((request) => {
      if (!normalizedSearch) return true;

      return (
        request.name.toLowerCase().includes(normalizedSearch) ||
        request.email.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...matchingRequests].sort((a, b) => {
      if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [sentRequests, normalizedSearch, sortOption]);

  const isFriendsTab = activeTab === "friends";

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Amistades
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Consulta tus amistades y revisa las solicitudes que ya enviaste.
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

        <FriendsTabs
          activeTab={activeTab}
          friendsCount={friends.length}
          sentRequestsCount={sentRequests.length}
          onChange={setActiveTab}
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={
                isFriendsTab
                  ? "Buscar amistades"
                  : "Buscar solicitudes enviadas"
              }
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
        {activeTab === "friends" && (
          <FriendsTab
            friends={filteredFriends}
            selectedFriendId={selectedFriendId}
            onCompareFriend={onCompareFriend}
            onClearComparison={onClearComparison}
          />
        )}

        {activeTab === "sent-requests" && (
          <SentRequestsTab requests={filteredSentRequests} />
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

type FriendsTabProps = {
  friends: Friend[];
  selectedFriendId?: string | null;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
};

function FriendsTab({
  friends,
  selectedFriendId,
  onCompareFriend,
  onClearComparison,
}: FriendsTabProps) {
  if (friends.length === 0) {
    return (
      <EmptyState
        title="No se encontraron amistades"
        description="Intenta buscar con otro nombre o invita a más amigos."
      />
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {friends.map((friend) => {
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
  );
}

type SentRequestsTabProps = {
  requests: SentFriendRequest[];
};

function SentRequestsTab({ requests }: SentRequestsTabProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No hay solicitudes enviadas"
        description="Cuando invites a alguien, aparecerá aquí mientras espera respuesta."
      />
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {requests.map((request) => (
        <article
          key={request.id}
          className="grid items-center gap-4 border-l-4 border-transparent px-7 py-4 transition hover:bg-neutral-50 md:grid-cols-[1fr_auto]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={request.name} avatarUrl={request.avatarUrl} />

            <div className="min-w-0">
              <h3 className="truncate text-md font-semibold text-neutral-950">
                {request.name}
              </h3>

              <h4 className="truncate text-sm font-light text-neutral-500">
                {request.email}
              </h4>

              {request.createdAt && (
                <p className="text-xs text-neutral-400">
                  Enviada el {request.createdAt}
                </p>
              )}
            </div>
          </div>

          <span className="inline-flex h-9 w-fit items-center gap-2 border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-700">
            <Clock size={16} />
            Pendiente
          </span>
        </article>
      ))}
    </ul>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Users size={22} />
      </div>

      <h3 className="text-base font-semibold text-neutral-950">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
    </div>
  );
}