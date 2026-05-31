import type { FriendsListTab } from "./types";

type FriendsTabsProps = {
  activeTab: FriendsListTab;
  friendsCount: number;
  sentRequestsCount: number;
  onChange: (tab: FriendsListTab) => void;
};

export function FriendsTabs({
  activeTab,
  friendsCount,
  sentRequestsCount,
  onChange,
}: FriendsTabsProps) {
  const tabs: Array<{
    id: FriendsListTab;
    label: string;
    helper?: string;
  }> = [
    {
      id: "friends",
      label: "Amistades",
      helper: String(friendsCount),
    },
    {
      id: "sent-requests",
      label: "Solicitudes enviadas",
      helper: sentRequestsCount > 0 ? String(sentRequestsCount) : undefined,
    },
  ];

  return (
    <div className="mt-6 flex gap-2 border-b border-neutral-100">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative -mb-px inline-flex h-10 items-center gap-2 border-b-2 px-3 text-sm font-medium transition ${
              isActive
                ? "border-purple-700 text-purple-700"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {tab.label}

            {tab.helper && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.helper}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}