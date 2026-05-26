import { useState } from "react";

export function useProfilePageController() {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const [isFriendDrawerOpen, setIsFriendDrawerOpen] = useState(false);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [isAchievementDrawerOpen, setIsAchievementDrawerOpen] = useState(false);

  const [initialOpenTeamId, setInitialOpenTeamId] = useState<string | null>(
    null,
  );

  const [initialTeamDrawerMode, setInitialTeamDrawerMode] = useState<
    "list" | "create"
  >("list");

  const [initialFriendDrawerMode, setInitialFriendDrawerMode] = useState<
    "list" | "invite"
  >("list");

  function closeAllDrawers() {
    setIsFriendDrawerOpen(false);
    setIsTeamDrawerOpen(false);
    setIsAchievementDrawerOpen(false);
  }

  function handleDisplayAllFriends() {
    closeAllDrawers();
    setInitialFriendDrawerMode("list");
    setIsFriendDrawerOpen(true);
  }

  function handleInviteFriends() {
    closeAllDrawers();
    setInitialFriendDrawerMode("invite");
    setIsFriendDrawerOpen(true);
  }

  function handleDisplayAllTeams() {
    closeAllDrawers();
    setInitialOpenTeamId(null);
    setInitialTeamDrawerMode("list");
    setIsTeamDrawerOpen(true);
  }

  function handleDisplayTeamMembers(teamId: string) {
    closeAllDrawers();
    setInitialOpenTeamId(teamId);
    setInitialTeamDrawerMode("list");
    setIsTeamDrawerOpen(true);
  }

  function handleCreateTeamShortcut() {
    closeAllDrawers();
    setInitialTeamDrawerMode("create");
    setInitialOpenTeamId(null);
    setIsTeamDrawerOpen(true);
  }

  function handleDisplayAllAchievements() {
    closeAllDrawers();
    setIsAchievementDrawerOpen(true);
  }

  function handleCompareFriend(friendId: string) {
    closeAllDrawers();
    setSelectedFriendId(friendId);
    setIsAchievementDrawerOpen(true);
  }

  function handleClearComparison() {
    setSelectedFriendId(null);
  }

  function handleCloseFriendDrawer() {
    setIsFriendDrawerOpen(false);
  }

  function handleCloseTeamDrawer() {
    setIsTeamDrawerOpen(false);
    setInitialTeamDrawerMode("list");
    setInitialOpenTeamId(null);
  }

  function handleCloseAchievementDrawer() {
    setIsAchievementDrawerOpen(false);
    setSelectedFriendId(null);
  }

  return {
    selectedFriendId,
    setSelectedFriendId,

    isFriendDrawerOpen,
    isTeamDrawerOpen,
    isAchievementDrawerOpen,

    initialOpenTeamId,
    initialTeamDrawerMode,
    initialFriendDrawerMode,

    handleDisplayAllFriends,
    handleInviteFriends,
    handleDisplayAllTeams,
    handleDisplayTeamMembers,
    handleCreateTeamShortcut,
    handleDisplayAllAchievements,
    handleCompareFriend,
    handleClearComparison,
    handleCloseFriendDrawer,
    handleCloseTeamDrawer,
    handleCloseAchievementDrawer,
  };
}
