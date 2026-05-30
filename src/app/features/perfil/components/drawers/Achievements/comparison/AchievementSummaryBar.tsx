import type { AchievementUserData } from "../../../../types/profile";
import {
  getCompletedCount,
  getFirstName,
  getSharedCompletedCount,
} from "../utils/achievementComparison";


type AchievementSummaryBarProps = {
  personalData: AchievementUserData;
  friendData: AchievementUserData | null;
  isComparing: boolean;
};

export function AchievementSummaryBar({
  personalData,
  friendData,
  isComparing,
}: AchievementSummaryBarProps) {
  return (
    <div
      className={[
        "grid border-t border-neutral-100 bg-neutral-50 px-8 py-4",
        isComparing ? "grid-cols-3" : "grid-cols-2",
      ].join(" ")}
    >
      <SummaryItem
        label="Tus logros completados"
        value={getCompletedCount(personalData)}
      />

      {isComparing && friendData && (
        <SummaryItem
          label="Logros compartidos"
          value={getSharedCompletedCount(personalData, friendData)}
        />
      )}

      <SummaryItem
        label={
          isComparing && friendData
            ? `${getFirstName(friendData.name)} completados`
            : "Total de logros"
        }
        value={
          isComparing && friendData
            ? getCompletedCount(friendData)
            : personalData.achievements.length
        }
        alignRight
      />
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
  alignRight?: boolean;
};

export function SummaryItem({
  label,
  value,
  alignRight = false,
}: SummaryItemProps) {
  return (
    <div className={alignRight ? "text-right" : "text-left"}>
      <p className="text-xs font-medium text-neutral-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}