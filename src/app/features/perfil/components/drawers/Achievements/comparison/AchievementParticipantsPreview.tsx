import { getInitials } from "../../../../lib/formatting";
import type { AchievementUserData } from "../../../../types/profile";

type AchievementParticipantsPreviewProps = {
  personalData: AchievementUserData;
  friendData: AchievementUserData | null;
  isComparing: boolean;
};

export function AchievementParticipantsPreview({
  personalData,
  friendData,
  isComparing,
}: AchievementParticipantsPreviewProps) {
  return (
    <div
      className={[
        "grid gap-5 border-t border-neutral-100 px-8 py-5",
        isComparing ? "sm:grid-cols-[1fr_auto_1fr]" : "sm:grid-cols-1",
      ].join(" ")}
    >
      <PersonPreview label="Tú" name={personalData.name} />

      {isComparing && friendData && (
        <>
          <span className="self-center text-center text-sm font-semibold text-neutral-500">
            VS
          </span>

          <PersonPreview
            label="Tu amistad"
            name={friendData.name}
            alignRight
          />
        </>
      )}
    </div>
  );
}

type PersonPreviewProps = {
  label: string;
  name: string;
  avatarUrl?: string;
  alignRight?: boolean;
};

export function PersonPreview({
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