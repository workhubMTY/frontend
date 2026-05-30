import type { AchievementUserData } from "../../../../types/profile";
import { getFirstName } from "../utils/achievementComparison";
import { AchievementComparisonRow } from "../achievements/AchievementComparisonRow";

type ComparisonTableProps = {
  personalData: AchievementUserData;
  friendData: AchievementUserData;
};

export function ComparisonTable({
  personalData,
  friendData,
}: ComparisonTableProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_120px_120px] gap-5 border-b border-neutral-100 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        <span>Logro</span>
        <span>Tú</span>
        <span>{getFirstName(friendData.name)}</span>
      </div>

      <div className="divide-y divide-neutral-100">
        {personalData.achievements.map((achievement) => {
          const friendAchievement = friendData.achievements.find(
            (item) => item.id === achievement.id,
          );

          const friendProgress = friendAchievement?.userProgress ?? {
            current: 0,
            target: achievement.userProgress.target,
            status: "locked" as const,
          };

          return (
            <AchievementComparisonRow
              key={achievement.id}
              achievement={achievement}
              userProgress={achievement.userProgress}
              friendProgress={friendProgress}
            />
          );
        })}
      </div>
    </>
  );
}