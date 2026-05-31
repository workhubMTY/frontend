import { Check, Trophy } from "lucide-react";

import type { Friend } from "@/app/features/perfil/types/profile";

import { Avatar } from "../../../../utils/Avatar";
import { EmptyState } from "../EmptyState";
import { CancelButton } from "../../utils/CancelButton";

type FriendsListTabProps = {
  friends: Friend[];
  selectedFriendId?: string | null;
  removingFriendId?: string | null;
  isRemovingFriend?: boolean;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onRemoveFriend: (friendId: string) => void | Promise<void>;
};

export function FriendsListTab({
  friends,
  selectedFriendId,
  removingFriendId,
  isRemovingFriend = false,
  onCompareFriend,
  onClearComparison,
  onRemoveFriend,
}: FriendsListTabProps) {
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
        const isRemoving = isRemovingFriend && removingFriendId === friend.eId;

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

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <button
                type="button"
                disabled={isRemoving}
                onClick={() =>
                  isSelected
                    ? onClearComparison()
                    : onCompareFriend(friend.eId)
                }
                className={[
                  "inline-flex h-10 items-center gap-2 border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                  isSelected
                    ? "border-purple-700 bg-purple-700 text-white hover:bg-purple-800"
                    : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                {isSelected ? <Check size={17} /> : <Trophy size={17} />}
                {isSelected ? "Comparando" : "Comparar"}
              </button>

              <CancelButton
                itemId={friend.eId}
                isLoading={isRemoving}
                onAction={(id) => onRemoveFriend(id)}
              />
            </div>
          </article>
        );
      })}
    </ul>
  );
}