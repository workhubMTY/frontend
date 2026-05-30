"use client";

import type {
  AchievementUserData,
  Friend,
} from "../../../types/profile";

import { AchievementDrawerShell } from "./layout/AchievementDrawerShell";
import { DrawerMissingPersonalDataState } from "./states/DrawerMissingPersonalDataState";
import { AchievementDrawerHeader } from "./layout/AchievementDrawerHeader";
import { AchievementComparisonSelector } from "./comparison/AchievementComparisonSelector";
import { AchievementParticipantsPreview } from "./comparison/AchievementParticipantsPreview";
import { AchievementSummaryBar } from "./comparison/AchievementSummaryBar";
import { DrawerLoadingState } from "./states/DrawerLoadingState";
import { DrawerErrorState } from "./states/DrawerErrorState";
import { ComparisonTable } from "./comparison/ComparisonTable";
import { AchievementsList } from "./achievements/AchievementList";
import { AchievementDrawerFooter } from "./layout/AchievementDrawerFooter";

type AchievementComparisonDrawerProps = {
  isOpen: boolean;
  personalData: AchievementUserData | null;
  friendData: AchievementUserData | null;
  friendDataLoading?: boolean;
  friendDataError?: Error | null;
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
  friendDataError,
  friendDataLoading,
  friends,
  selectedFriendId,
  onSelectFriend,
  onClose,
  onClearComparison,
}: AchievementComparisonDrawerProps) {
  if (!isOpen) return null;

  if (!personalData) {
    return (
      <AchievementDrawerShell onClose={onClose}>
        <DrawerMissingPersonalDataState onClose={onClose} />
      </AchievementDrawerShell>
    );
  }

  const isComparing = Boolean(selectedFriendId && friendData);

  return (
    <AchievementDrawerShell onClose={onClose}>
      <header className="border-b border-neutral-100 bg-white">
        <AchievementDrawerHeader
          isComparing={isComparing}
          onClose={onClose}
        />

        <AchievementComparisonSelector
          friends={friends}
          selectedFriendId={selectedFriendId}
          isComparing={isComparing}
          onSelectFriend={onSelectFriend}
          onClearComparison={onClearComparison}
        />

        <AchievementParticipantsPreview
          personalData={personalData}
          friendData={friendData}
          isComparing={isComparing}
        />

        <AchievementSummaryBar
          personalData={personalData}
          friendData={friendData}
          isComparing={isComparing}
        />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedFriendId && friendDataLoading ? (
          <DrawerLoadingState />
        ) : selectedFriendId && friendDataError ? (
          <DrawerErrorState />
        ) : isComparing && friendData ? (
          <ComparisonTable
            personalData={personalData}
            friendData={friendData}
          />
        ) : (
          <AchievementsList achievements={personalData.achievements} />
        )}
      </div>

      <AchievementDrawerFooter
        isComparing={isComparing}
        friendName={friendData?.name}
        onClose={onClose}
      />
    </AchievementDrawerShell>
  );
}