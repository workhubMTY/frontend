import { CalendarDays, MailOpen, Users } from "lucide-react";

import type { MobileTab } from "@/app/features/home/hooks/useHomePage";

type HomeMobileNavigationProps = {
  activeTab: MobileTab;
  selectedPerson: number | null;
  selectedInvitationId: string | null;
  onChangeTab: (tab: MobileTab) => void;
};

export function HomeMobileNavigation({
  activeTab,
  selectedPerson,
  selectedInvitationId,
  onChangeTab,
}: HomeMobileNavigationProps) {
  const tabs: {
    key: MobileTab;
    label: string;
    icon: React.ReactNode;
    badge?: boolean;
  }[] = [
    {
      key: "agenda",
      label: "Agenda",
      icon: <CalendarDays size={18} />,
    },
    {
      key: "red",
      label: "Red",
      icon: <Users size={18} />,
      badge: selectedPerson !== null,
    },
  ];

  return (
    <nav
      className="home-safe-bottom flex sm:hidden shrink-0 items-stretch bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]"
      style={{ zIndex: 30 }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 border-none bg-transparent cursor-pointer"
            style={{ color: isActive ? "#7C3AED" : "#9CA3AF" }}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-violet-600" />
            )}

            {tab.badge && !isActive && (
              <span className="absolute top-2.5 right-[calc(50%-10px)] h-2 w-2 rounded-full bg-orange-400 border-2 border-white" />
            )}

            <span style={{ opacity: isActive ? 1 : 0.55 }}>{tab.icon}</span>

            <span
              className="text-[10px]"
              style={{ fontWeight: isActive ? 600 : 400 }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}