import { Flame, Network, UsersRound } from "lucide-react";
import type { Achievement } from "../../../../types/profile";

type AchievementIconProps = {
  icon: Achievement["icon"];
};

export function AchievementIcon({ icon }: AchievementIconProps) {
  const Icon =
    icon === "flame" ? Flame : icon === "network" ? Network : UsersRound;

  const iconClass =
    icon === "flame"
      ? "bg-red-50 text-red-500"
      : "bg-purple-50 text-purple-700";

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center ${iconClass}`}
    >
      <Icon size={22} />
    </div>
  );
}