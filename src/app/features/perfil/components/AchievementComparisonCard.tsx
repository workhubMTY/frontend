import {
  Flame,
  Info,
  Trophy,
  UserRound,
  UsersRound,
  Network,
} from "lucide-react";
import type {
  Achievement,
  AchievementProgress,
  Friend,
  UserProfile,
} from "../types/profile";

type AchievementComparisonCardProps = {
  profile: UserProfile;
  selectedFriend: Friend | null;
  onChangeFriend: () => void;
};

export function AchievementComparisonCard({
  profile,
  selectedFriend,
  onChangeFriend,
}: AchievementComparisonCardProps) {
  if (!selectedFriend) {
    return (
      <section className="border border-neutral-200 bg-white shadow-sm">
        <header className="border-b border-neutral-100">
          <div className="flex items-center gap-3 px-7 py-5">
            <Trophy size={22} className="text-neutral-700" />
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Logros
            </h2>
          </div>
        </header>

        <div className="divide-y divide-neutral-100">
          {profile.achievements.map((achievement) => {
            return (
              <AchievementRow
                key={achievement.id}
                achievement={achievement}
                userProgress={achievement.userProgress}
              />
            );
          })}
        </div>

        <footer className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-7 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Info size={16} />
            ¡Compara con tus amigos!
          </div>
        </footer>
      </section>
    );
  }

  return (
    <section className="border border-neutral-200 bg-white shadow-sm">
      <header className="border-b border-neutral-100">
        <div className="flex items-center gap-3 px-7 py-5">
          <Trophy size={22} className="text-neutral-700" />
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Comparación de logros
          </h2>
        </div>

        <div className="grid items-center gap-5 border-t border-neutral-100 px-7 py-5 sm:grid-cols-[1fr_auto_1fr]">
          <PersonPreview
            label="Tú"
            name={profile.name}
            avatarUrl={profile.avatarUrl}
          />

          <span className="text-center text-sm font-semibold text-neutral-500">
            VS
          </span>

          <PersonPreview
            label={selectedFriend.name}
            name={selectedFriend.role}
            avatarUrl={selectedFriend.avatarUrl}
            alignRight
          />
        </div>
      </header>

      <div className="divide-y divide-neutral-100">
        <div className="grid grid-cols-[1fr_120px_120px] gap-5 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <span>Logro</span>
          <span>Tú</span>
          <span>{selectedFriend.name.split(" ")[0]}</span>
        </div>

        {profile.achievements.map((achievement) => {
          const friendProgress = achievement.friendsProgress[
            selectedFriend.id
          ] ?? {
            current: 0,
            target: achievement.userProgress.target,
            status: "locked" as const,
          };

          return (
            <AchievementRow
              key={achievement.id}
              achievement={achievement}
              userProgress={achievement.userProgress}
              friendProgress={friendProgress}
            />
          );
        })}
      </div>

      <footer className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-7 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Info size={16} />
          Comparando con {selectedFriend.name}
        </div>

        <button
          type="button"
          onClick={onChangeFriend}
          className="text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          Cambiar
        </button>
      </footer>
    </section>
  );
}

type PersonPreviewProps = {
  label: string;
  name: string;
  avatarUrl: string;
  alignRight?: boolean;
};

function PersonPreview({
  label,
  name,
  avatarUrl,
  alignRight = false,
}: PersonPreviewProps) {
  return (
    <div
      className={[
        "flex items-center gap-3",
        alignRight ? "justify-start sm:justify-end" : "",
      ].join(" ")}
    >
      <img
        src={avatarUrl}
        alt={label}
        className="h-11 w-11 rounded-full object-cover"
      />

      <div className={alignRight ? "sm:text-right" : ""}>
        <p className="font-semibold text-neutral-950">{label}</p>
        <p className="text-sm text-neutral-500">{name}</p>
      </div>
    </div>
  );
}

type AchievementRowProps = {
  achievement: Achievement;
  userProgress: AchievementProgress;
  friendProgress?: AchievementProgress;
};

function AchievementRow({
  achievement,
  userProgress,
  friendProgress,
}: AchievementRowProps) {
  if (!friendProgress) {
    return (
      <article className="grid grid-cols-[1fr_120px] gap-5 px-7 py-5">
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
      </article>
    );
  }
  return (
    <article className="grid grid-cols-[1fr_120px_120px] gap-5 px-7 py-5">
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
      className={`flex h-12 w-12 shrink-0 items-center justify-center ${iconClass}`}
    >
      <Icon size={22} />
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
