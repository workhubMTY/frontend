import { Check, Trophy, UserPlus, UsersRound } from "lucide-react";
import type { Friend } from "../types/profile";

type FriendsCardProps = {
  friends: Friend[];
  selectedFriendId: string | null;
  onCompareFriend: (friendId: string) => void;
  onClearComparison: () => void;
  onInviteFriend: (friend: Friend) => void;
};

export function FriendsCard({
  friends,
  selectedFriendId,
  onCompareFriend,
  onClearComparison,
}: FriendsCardProps) {
  return (
    <section className="border border-neutral-200 bg-white shadow-sm h-full flex flex-col">
      <header className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
        <div className="flex items-center gap-3">
          <UsersRound size={22} className="text-neutral-700" />
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Amistades
          </h2>
        </div>

        <button
          type="button"
          onClick={() => alert("Ver todas las amistades")}
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          Ver todos
        </button>
      </header>

      <div className="divide-y divide-neutral-100">
        {friends.map((friend) => {
          const isSelected = selectedFriendId === friend.id;

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
                  <p className="text-sm text-neutral-500">{friend.role}</p>
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
                  {isSelected ? <Check size={17} /> : <Trophy size={17} />}
                  {isSelected ? "Comparando" : "Comparar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="border-t border-neutral-100 px-7 py-5 mt-auto">
        <button
          type="button"
          onClick={() => alert("Invitar a más amigos")}
          className="inline-flex items-center gap-3 text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          <UsersRound size={20} />
          Invitar a más amigos
        </button>
      </footer>
    </section>
  );
}
