import type { UserProfile } from "../types/profile";

type ProgressSummaryCardProps = {
  profile: UserProfile;
};

export function ProgressSummaryCard({ profile }: ProgressSummaryCardProps) {
  const { completedAchievements, inProgressAchievements, pendingAchievements } =
    profile.stats;

  const total =
    completedAchievements + inProgressAchievements + pendingAchievements;

  const percentage = Math.round((completedAchievements / total) * 100);

  const circumference = 2 * Math.PI * 48;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <section className="border border-neutral-200 bg-white p-7 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
        Resumen de progreso
      </h2>

      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[170px_1fr]">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="11"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          <div className="absolute text-center">
            <p className="text-3xl font-semibold text-neutral-950">
              {percentage}%
            </p>
            <p className="text-sm text-neutral-500">Completado</p>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          <LegendItem
            colorClass="bg-purple-700"
            label="Logros completados"
            value={completedAchievements}
          />

          <LegendItem
            colorClass="bg-purple-200"
            label="En progreso"
            value={inProgressAchievements}
          />

          <LegendItem
            colorClass="bg-neutral-300"
            label="Por completar"
            value={pendingAchievements}
          />
        </div>
      </div>
    </section>
  );
}

type LegendItemProps = {
  colorClass: string;
  label: string;
  value: number;
};

function LegendItem({ colorClass, label, value }: LegendItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${colorClass}`} />
        <span className="text-neutral-600">{label}</span>
      </div>

      <span className="font-semibold text-neutral-950">{value}</span>
    </div>
  );
}
