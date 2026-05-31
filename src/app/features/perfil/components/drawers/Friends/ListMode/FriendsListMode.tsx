"use client";

import { Search, SlidersHorizontal, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { Friend } from "@/app/features/perfil/types/profile";

import {
  useCancelFriendRequest,
  useRemoveFriend,
  useSentFriendRequests,
} from "../../../../data/hooks/useFriends";

import { FriendsTabs } from "./tabs/FriendsTabs";
import { FriendsListTab } from "./tabs/FriendsListTab";
import { SentRequestsTab } from "./tabs/SentRequestsTab";

import type { FriendsListTabId } from "../types";

type SortOption = "name-asc" | "name-desc";

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
  const [activeTab, setActiveTab] = useState<FriendsListTabId>("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const {
    data: sentRequests = [],
    isLoading: isLoadingSentRequests,
    isError: hasSentRequestsError,
  } = useSentFriendRequests();

  const cancelFriendRequestMutation = useCancelFriendRequest();
  const removeFriendMutation = useRemoveFriend();

  async function handleRemoveFriend(friendId: string) {
    await removeFriendMutation.mutateAsync(friendId);

    if (selectedFriendId === friendId) {
      onClearComparison();
    }
  }
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

  async function handleCancelFriendRequest(userId: string) {
    await cancelFriendRequestMutation.mutateAsync(userId);
  }

  const isFriendsTab = activeTab === "friends";

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
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
            className="grid size-9 shrink-0 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
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
          <FriendsListTab
            friends={filteredFriends}
            selectedFriendId={selectedFriendId}
            removingFriendId={removeFriendMutation.variables ?? null}
            isRemovingFriend={removeFriendMutation.isPending}
            onCompareFriend={onCompareFriend}
            onClearComparison={onClearComparison}
            onRemoveFriend={handleRemoveFriend}
          />
        )}

        {activeTab === "sent-requests" && (
          <SentRequestsTab
            requests={filteredSentRequests}
            isLoading={isLoadingSentRequests}
            isError={hasSentRequestsError}
            cancellingRequestId={cancelFriendRequestMutation.variables ?? null}
            isCancellingRequest={cancelFriendRequestMutation.isPending}
            onCancelRequest={handleCancelFriendRequest}
          />
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
