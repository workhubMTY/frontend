import type {
  Achievement,
  AchievementProgress,
} from "../../../../types/profile";
import { AchievementIcon } from "./AchievementIcon";
import { ProgressCell } from "./ProgressCell";

type AchievementComparisonRowProps = {
  achievement: Achievement;
  userProgress: AchievementProgress;
  friendProgress: AchievementProgress;
};

export function AchievementComparisonRow({
  achievement,
  userProgress,
  friendProgress,
}: AchievementComparisonRowProps) {
  return (
    <article className="grid grid-cols-[1fr_120px_120px] gap-5 px-8 py-5">
      <div className="flex min-w-0 gap-4">
        <AchievementIcon icon={achievement.icon} />

        <div className="min-w-0">
          <h3 className="font-semibold text-neutral-950">
            {achievement.title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-neutral-500">
            {achievement.description}
          </p>
        </div>
      </div>

      <ProgressCell progress={userProgress} />
      <ProgressCell progress={friendProgress} />
    </article>
  );
}