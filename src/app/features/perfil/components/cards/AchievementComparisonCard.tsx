import { Flame, Info, Trophy, UsersRound, Network } from "lucide-react";
import type { Achievement, AchievementProgress } from "../../types/profile";

type AchievementComparisonCardProps = {
  achievements: Achievement[];
  isLoading?: boolean;
  error?: Error | null;
  onDisplayAll: () => void;
};

export function AchievementComparisonCard({
  achievements,
  isLoading = false,
  error = null,
  onDisplayAll,
}: AchievementComparisonCardProps) {
  const hasAchievements = achievements.length > 0;

  return (
    <section className="flex h-full flex-col border border-neutral-200 bg-white shadow-sm">
      <header className="flex justify-between border-b border-neutral-100 px-7 py-4">
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-neutral-700" />
          <h2 className="text-md font-semibold tracking-tight text-neutral-950">
            Logros
          </h2>
        </div>

        <button
          type="button"
          onClick={onDisplayAll}
          disabled={isLoading || Boolean(error) || !hasAchievements}
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:text-neutral-300"
        >
          Ver todos
        </button>
      </header>

      <div className="flex-1 divide-y divide-neutral-100">
        {isLoading ? (
          <AchievementCardSkeleton />
        ) : error ? (
          <AchievementCardError />
        ) : !hasAchievements ? (
          <AchievementCardEmpty />
        ) : (
          achievements
            .slice(0, 3)
            .map((achievement) => (
              <AchievementRow
                key={achievement.id}
                achievement={achievement}
                userProgress={achievement.userProgress}
              />
            ))
        )}
      </div>

      <footer className="mt-auto flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-7 py-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Info size={16} />
          ¡Compara con tus amigos!
        </div>
      </footer>
    </section>
  );
}

type AchievementRowProps = {
  achievement: Achievement;
  userProgress: AchievementProgress;
  friendProgress?: AchievementProgress;
};

function AchievementRow({ achievement, userProgress }: AchievementRowProps) {
  return (
    <article className="grid grid-cols-[1fr_120px] gap-5 px-7 py-3 items-center">
      <div className="flex min-w-0 gap-4">
        <AchievementIcon icon={achievement.icon} />

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-950">
            {achievement.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
            {achievement.description}
          </p>
        </div>
      </div>

      <ProgressCell progress={userProgress} />
    </article>
  );
}

type AchievementIconProps = {
  icon: Achievement["icon"];
};

function AchievementIcon({ icon }: AchievementIconProps) {
  const iconClass =
    icon === "flame"
      ? "bg-red-50 text-red-500"
      : "bg-purple-50 text-purple-700";

  const Icon =
    icon === "flame" ? Flame : icon === "network" ? Network : UsersRound;

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center ${iconClass}`}
    >
      <Icon size={16} />
    </div>
  );
}

type ProgressCellProps = {
  progress: AchievementProgress;
};

function ProgressCell({ progress }: ProgressCellProps) {
  const percentage =
    progress.target === 0
      ? 0
      : Math.min(Math.round((progress.current / progress.target) * 100), 100);

  const isCompleted = percentage >= 100;

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-neutral-950">
          {progress.current} / {progress.target}
        </p>
        <p className={[
            "text-xs font-semibold",
            isCompleted ? "text-emerald-600" : "text-purple-700",
          ].join(" ")}
        >
          {isCompleted ? "Completado" : `${percentage}%`}
        </p>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div
          className={[
            "h-full rounded-full transition-all",
            isCompleted ? "bg-emerald-500" : "bg-purple-700",
          ].join(" ")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AchievementCardSkeleton() {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="grid grid-cols-[1fr_120px] gap-5 px-7 py-5"
        >
          <div className="flex min-w-0 gap-4">
            <div className="h-12 w-12 shrink-0 animate-pulse bg-neutral-100" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
            <div className="h-1.5 w-full animate-pulse rounded-full bg-neutral-100" />
            <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
          </div>
        </article>
      ))}
    </div>
  );
}

function AchievementCardError() {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-red-900">
          No se pudieron cargar los logros
        </h3>
        <p className="mt-1 text-sm text-red-700">
          Intenta nuevamente más tarde o revisa tu conexión.
        </p>
      </div>
    </div>
  );
}

function AchievementCardEmpty() {
  return (
    <div className="px-7 py-8">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-purple-100 text-purple-700">
            <Trophy size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-950">
              Todavía no tienes logros disponibles
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Cuando completes actividades, tus avances aparecerán aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
