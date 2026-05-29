"use client";

import { useEffect, useState } from "react";
import type { Friend, FriendSuggestion } from "../../../types/profile";
import { DrawerMode, SendFriendRequestsPayload } from "./types";
import { FriendsListMode } from "./FriendsListMode";
import { InviteFriendsMode } from "./FriendsCreateMode";

type FriendsDrawerProps = {
  isOpen: boolean;
  friends: Friend[];
  selectedFriendId?: string | null;
  initialMode?: DrawerMode;
  onSearchSuggestions: (query: string) => Promise<FriendSuggestion[]>;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onSendFriendRequests?: (
    payload: SendFriendRequestsPayload,
  ) => Promise<void> | void;
};

export function FriendsDrawer({
  isOpen,
  friends,
  selectedFriendId,
  initialMode = "list",
  onSearchSuggestions,
  onClose,
  onCompareFriend,
  onClearComparison,
  onSendFriendRequests,
}: FriendsDrawerProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(initialMode);

  useEffect(() => {
    if (!isOpen) return;

    setDrawerMode(initialMode);
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  function handleClose() {
    setDrawerMode("list");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        {drawerMode === "list" ? (
          <FriendsListMode
            friends={friends}
            selectedFriendId={selectedFriendId}
            onClose={handleClose}
            onCompareFriend={onCompareFriend}
            onClearComparison={onClearComparison}
            onInviteMode={() => setDrawerMode("invite")}
          />
        ) : (
          <InviteFriendsMode
            onBack={() => setDrawerMode("list")}
            onClose={handleClose}
            onSearchSuggestions={onSearchSuggestions}
            onSendFriendRequests={async (payload) => {
              await onSendFriendRequests?.(payload);
              setDrawerMode("list");
            }}
          />
        )}
      </aside>
    </div>
  );
}
