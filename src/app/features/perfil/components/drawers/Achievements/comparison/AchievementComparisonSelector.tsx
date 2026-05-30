import { Search } from "lucide-react";
import type { Friend } from "../../../../types/profile";

type AchievementComparisonSelectorProps = {
  friends: Friend[];
  selectedFriendId: string | null;
  isComparing: boolean;
  onSelectFriend: (friendId: string | null) => void;
  onClearComparison: () => void;
};

export function AchievementComparisonSelector({
  friends,
  selectedFriendId,
  isComparing,
  onSelectFriend,
  onClearComparison,
}: AchievementComparisonSelectorProps) {
  return (
    <div className="border-t border-neutral-100 px-8 py-5">
      <label className="text-sm font-medium text-neutral-600">
        Comparar con amistad
      </label>

      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <select
            value={selectedFriendId ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              onSelectFriend(value || null);
            }}
            className="h-11 w-full appearance-none border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="">Sin comparación</option>

            {friends.map((friend) => (
              <option key={friend.eId} value={friend.eId}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>

        {isComparing && (
          <button
            type="button"
            onClick={onClearComparison}
            className="inline-flex h-11 items-center justify-center border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Quitar comparación
          </button>
        )}
      </div>
    </div>
  );
}