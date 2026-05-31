import { Check, Trophy, UsersRound, UserPlus } from "lucide-react";
import type { Friend } from "../../types/profile";
import React from "react";
import { getInitials } from "../../lib/formatting";

type FriendsCardProps = {
  friends: Friend[];
  selectedFriendId: string | null;
  isLoading?: boolean;
  error?: Error | null;
  onCompareFriend: (friendId: string) => void;
  onClearComparison: () => void;
  onDisplayAll: () => void;
  onInviteFriendsShortcut: () => void;
};

const FriendRow = React.memo(
  ({
    friend,
    isSelected,
    onCompareFriend,
    onClearComparison,
  }: {
    friend: Friend;
    isSelected: boolean;
    onCompareFriend: (friendId: string) => void;
    onClearComparison: () => void;
  }) => {
    return (
      <article
        className={[
          "grid items-center gap-4 px-7 py-4 transition",
          "md:grid-cols-[1fr_auto]",
          isSelected
            ? "border-l-4 border-purple-700 bg-purple-50/70 pl-6"
            : "border-l-4 border-transparent hover:bg-neutral-50",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-4">
          {friend.avatarUrl ? (
            <img
              src={friend.avatarUrl}
              alt={friend.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold uppercase text-purple-700">
              {getInitials(friend.name)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-neutral-950">
              {friend.name}
            </h3>
            <p className="text-sm text-neutral-500">{friend.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              isSelected ? onClearComparison() : onCompareFriend(friend.eId)
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
  },
);

FriendRow.displayName = "FriendRow";

export function FriendsCard({
  friends,
  selectedFriendId,
  isLoading = false,
  error = null,
  onCompareFriend,
  onDisplayAll,
  onClearComparison,
  onInviteFriendsShortcut,
}: FriendsCardProps) {
  const hasFriends = friends.length > 0;

  return (
    <section className="flex h-full flex-col border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
        <div className="flex items-center gap-3">
          <UsersRound size={22} className="text-neutral-700" />
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Amistades
          </h2>
        </div>

        <button
          type="button"
          onClick={onDisplayAll}
          disabled={isLoading || Boolean(error) }
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          Ver más
        </button>
      </header>

      <div className="flex-1 divide-y divide-neutral-100">
        {isLoading ? (
          <FriendsCardSkeleton />
        ) : error ? (
          <FriendsCardError />
        ) : !hasFriends ? (
          <FriendsCardEmpty onInviteFriendsShortcut={onInviteFriendsShortcut} />
        ) : (
          friends.slice(0, 3).map((friend) => {
            const isSelected = selectedFriendId === friend.eId;

            return (
              <FriendRow
                key={friend.eId ?? friend.name} //CAMBIAR ESTO CUANDO YA SE PASEN BIEN LOS ID, NO COMO E_ID
                friend={friend}
                isSelected={isSelected}
                onCompareFriend={onCompareFriend}
                onClearComparison={onClearComparison}
              />
            );
          })
        )}
      </div>

      <footer className="mt-auto border-t border-neutral-100 px-7 py-5">
        <button
          type="button"
          onClick={onInviteFriendsShortcut}
          disabled={isLoading}
          className="inline-flex items-center gap-3 text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          <UsersRound size={20} />
          Invitar a más amigos
        </button>
      </footer>
    </section>
  );
}

function FriendsCardSkeleton() {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="grid items-center gap-4 px-7 py-4 md:grid-cols-[1fr_auto]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-neutral-100" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <div className="h-10 w-28 animate-pulse rounded bg-neutral-100 md:justify-self-end" />
        </article>
      ))}
    </div>
  );
}

function FriendsCardError() {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-red-900">
          No se pudieron cargar tus amistades
        </h3>
        <p className="mt-1 text-sm text-red-700">
          Intenta nuevamente más tarde o revisa tu conexión.
        </p>
      </div>
    </div>
  );
}

function FriendsCardEmpty({
  onInviteFriendsShortcut,
}: {
  onInviteFriendsShortcut: () => void;
}) {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <UserPlus size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-950">
              Todavía no tienes amistades
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Invita amigos para comparar logros y seguir su progreso.
            </p>

            <button
              type="button"
              onClick={onInviteFriendsShortcut}
              className="mt-4 text-sm font-medium text-purple-700 transition hover:text-purple-900"
            >
              Invitar primer amigo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
