import type { AchievementProgress } from "../../../../types/profile";

type ProgressCellProps = {
  progress: AchievementProgress;
};

export function ProgressCell({ progress }: ProgressCellProps) {
  const percentage = getProgressPercentage(progress);
  const isCompleted = percentage >= 100;

  return (
    <div>
      <p className="text-sm font-semibold text-neutral-950">
        {progress.current} / {progress.target}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div
          className={[
            "h-full rounded-full transition-all",
            isCompleted ? "bg-emerald-500" : "bg-purple-700",
          ].join(" ")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p
        className={[
          "mt-2 text-xs font-semibold",
          isCompleted ? "text-emerald-600" : "text-purple-700",
        ].join(" ")}
      >
        {isCompleted ? "Completado" : `${percentage}%`}
      </p>
    </div>
  );
}

function getProgressPercentage(progress: AchievementProgress) {
  if (progress.target === 0) return 0;

  return Math.min(
    Math.round((progress.current / progress.target) * 100),
    100,
  );
}