import type { ManageTeamTab } from "../hooks/useManageTeam";

type ManageTeamTabsProps = {
  activeTab: ManageTeamTab;
  pendingMemberChangesCount: number;
  onChange: (tab: ManageTeamTab) => void;
};

export function ManageTeamTabs({
  activeTab,
  pendingMemberChangesCount,
  onChange,
}: ManageTeamTabsProps) {
  const tabs: Array<{
    id: ManageTeamTab;
    label: string;
    helper?: string;
  }> = [
    {
      id: "details",
      label: "Detalles",
    },
    {
      id: "members",
      label: "Miembros",
      helper:
        pendingMemberChangesCount > 0
          ? String(pendingMemberChangesCount)
          : undefined,
    },
    {
      id: "danger",
      label: "Zona de peligro",
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