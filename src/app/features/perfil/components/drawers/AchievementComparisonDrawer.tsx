"use client";

import {
  Flame,
  Info,
  Network,
  Search,
  Trophy,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type {
  Achievement,
  AchievementProgress,
  AchievementUserData,
  Friend,
} from "../../types/profile";
import { getInitials } from "../../lib/formatting";

type AchievementComparisonDrawerProps = {
  isOpen: boolean;
  personalData: AchievementUserData;
  friendData: AchievementUserData | null;
  friends: Friend[];
  selectedFriendId: string | null;
  onSelectFriend: (friendId: string | null) => void;
  onClose: () => void;
  onClearComparison: () => void;
};

export function AchievementComparisonDrawer({
  isOpen,
  personalData,
  friendData,
  friends,
  selectedFriendId,
  onSelectFriend,
  onClose,
  onClearComparison,
}: AchievementComparisonDrawerProps) {
  if (!isOpen) return null;

  const isComparing = Boolean(selectedFriendId && friendData);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel de logros"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[860px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        <header className="border-b border-neutral-100 bg-white">
          <div className="flex items-start justify-between gap-6 px-8 py-6">
            <div>
              <div className="flex items-center gap-3">
                <Trophy size={24} className="text-neutral-700" />
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  {isComparing ? "Comparación de logros" : "Todos los logros"}
                </h2>
              </div>

              <p className="mt-2 text-sm text-neutral-500">
                {isComparing
                  ? "Revisa tu progreso frente a una amistad."
                  : "Consulta tu progreso completo de logros."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Cerrar drawer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="border-t border-neutral-100 px-8 py-5">
            <label className="text-sm font-medium text-neutral-600">
              Comparar con amistad
            </label>

            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <select
                  value={selectedFriendId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    onSelectFriend(value || null);
                  }}
                  className="h-11 w-full appearance-none border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">Sin comparación</option>

                  {friends.map((friend) => (
                    <option key={friend.id} value={friend.id}>
                      {friend.name}
                    </option>
                  ))}
                </select>
              </div>

              {isComparing && (
                <button
                  type="button"
                  onClick={onClearComparison}
                  className="inline-flex h-11 items-center justify-center border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Quitar comparación
                </button>
              )}
            </div>
          </div>

          <div
            className={[
              "grid gap-5 border-t border-neutral-100 px-8 py-5",
              isComparing ? "sm:grid-cols-[1fr_auto_1fr]" : "sm:grid-cols-1",
            ].join(" ")}
          >
            <PersonPreview label="Tú" name={personalData.name} />

            {isComparing && (
              <>
                <span className="self-center text-center text-sm font-semibold text-neutral-500">
                  VS
                </span>

                <PersonPreview
                  label="Tu amistad"
                  name={friendData?.name ?? ""}
                  alignRight
                />
              </>
            )}
          </div>

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
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isComparing && friendData ? (
            <ComparisonTable
              personalData={personalData}
              friendData={friendData}
            />
          ) : (
            <AchievementsList personalData={personalData} />
          )}
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Info size={16} />
              {isComparing && friendData
                ? `Comparando con ${friendData.name}`
                : "Mostrando tus logros personales"}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800"
            >
              Listo
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

type ComparisonTableProps = {
  personalData: AchievementUserData;
  friendData: AchievementUserData;
};

function ComparisonTable({ personalData, friendData }: ComparisonTableProps) {
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

type AchievementsListProps = {
  personalData: AchievementUserData;
};

function AchievementsList({ personalData }: AchievementsListProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_140px] gap-5 border-b border-neutral-100 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        <span>Logro</span>
        <span>Progreso</span>
      </div>

      <div className="divide-y divide-neutral-100">
        {personalData.achievements.map((achievement) => (
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

type PersonPreviewProps = {
  label: string;
  name: string;
  avatarUrl?: string;
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
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
          {getInitials(name)}
        </div>
      )}

      <div className={alignRight ? "sm:text-right" : ""}>
        <p className="font-semibold text-neutral-950">{label}</p>
        <p className="text-sm text-neutral-500">{name}</p>
      </div>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
  alignRight?: boolean;
};

function SummaryItem({ label, value, alignRight = false }: SummaryItemProps) {
  return (
    <div className={alignRight ? "text-right" : "text-left"}>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}

type AchievementRowProps = {
  achievement: Achievement;
  progress: AchievementProgress;
};

function AchievementRow({ achievement, progress }: AchievementRowProps) {
  return (
    <article className="grid grid-cols-[1fr_140px] gap-5 px-8 py-5">
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

      <ProgressCell progress={progress} />
    </article>
  );
}

type AchievementComparisonRowProps = {
  achievement: Achievement;
  userProgress: AchievementProgress;
  friendProgress: AchievementProgress;
};

function AchievementComparisonRow({
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

type AchievementIconProps = {
  icon: Achievement["icon"];
};

function AchievementIcon({ icon }: AchievementIconProps) {
  const iconClass =
    icon === "flame"
      ? "bg-red-50 text-red-500"
      : icon === "network"
        ? "bg-purple-50 text-purple-700"
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

function getCompletedCount(userData: AchievementUserData) {
  return userData.achievements.filter(
    (achievement) =>
      achievement.userProgress.current >= achievement.userProgress.target,
  ).length;
}

function getSharedCompletedCount(
  personalData: AchievementUserData,
  friendData: AchievementUserData,
) {
  return personalData.achievements.filter((achievement) => {
    const friendAchievement = friendData.achievements.find(
      (item) => item.id === achievement.id,
    );

    if (!friendAchievement) return false;

    const userCompleted =
      achievement.userProgress.current >= achievement.userProgress.target;

    const friendCompleted =
      friendAchievement.userProgress.current >=
      friendAchievement.userProgress.target;

    return userCompleted && friendCompleted;
  }).length;
}

function getFirstName(name: string) {
  return name.trim().split(" ")[0] ?? name;
}
