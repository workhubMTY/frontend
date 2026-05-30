import type { Achievement } from "../../../../types/profile";
import { AchievementRow } from "./AchievementRow";

type AchievementsListProps = {
  achievements: Achievement[];
};

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_140px] gap-5 border-b border-neutral-100 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        <span>Logro</span>
        <span>Progreso</span>
      </div>

      <div className="divide-y divide-neutral-100">
        {achievements.map((achievement) => (
          <AchievementRow
            key={achievement.id}
            achievement={achievement}
            progress={achievement.userProgress}
          />
        ))}
      </div>
    </>
  );
}