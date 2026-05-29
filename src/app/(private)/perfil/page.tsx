"use client";

import { useCallback, useMemo } from "react";

import { ProfileHeaderCard } from "@/app/features/perfil/components/cards/ProfileHeaderCard";
import { ProgressSummaryCard } from "@/app/features/perfil/components/cards/ProgressSumaryCard";
import { FriendsCard } from "@/app/features/perfil/components/cards/FriendsCard";
import { TeamsCard } from "@/app/features/perfil/components/cards/TeamsCard";
import { AchievementComparisonCard } from "@/app/features/perfil/components/cards/AchievementComparisonCard";

import { FriendsDrawer } from "@/app/features/perfil/components/drawers/FriendsDrawer";
import { TeamsDrawer } from "@/app/features/perfil/components/drawers/TeamsDrawer";
import { AchievementComparisonDrawer } from "@/app/features/perfil/components/drawers/AchievementComparisonDrawer";

import {
  useProfile,
  useFriends,
  useAchievements,
  useTeams,
  useSelectedFriendAchievements,
} from "@/app/features/perfil/data/hooks";

import { useAuth } from "@/app/shared/auth/useAuth";
import { useProfilePageController } from "@/app/features/perfil/hooks/useProfilePageController";
import { ProfilePageSkeleton } from "@/app/features/perfil/components/feedback/ProfileSkeleton";
import { ProfilePageMessage } from "@/app/features/perfil/components/feedback/ProfilePageMessage";
import { useQueryClient } from "@tanstack/react-query";
import { perfilApi } from "@/app/features/perfil/data/api";

export default function UserProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const {
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
  } = useProfilePageController();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    data: friends = [],
    isLoading: friendsLoading,
    error: friendsError,
  } = useFriends();

  const {
    data: teams = [],
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();


  const {
    data: achievements = [],
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useAchievements(user?.eId, {
    enabled: Boolean(user?.eId),
  });

  const {
    data: selectedFriendAchievementData,
    isLoading: selectedFriendAchievementsLoading,
    error: selectedFriendAchievementsError,
  } = useSelectedFriendAchievements({
    selectedFriendId: selectedFriendId,
    friends,
  });

  const handleSearchUserSuggestions = useCallback(
  async (query: string) => {
    return queryClient.fetchQuery({
      queryKey: ["users", query, user?.eId],
      queryFn: () => perfilApi.getUsers(query, user?.eId),
    });
  },
  [queryClient, user?.eId],);
  
  const handleGetTeamMembers = useCallback(
    async (teamId: string) => {
      return queryClient.fetchQuery({
        queryKey: ["teamMembers", teamId],
        queryFn: () => perfilApi.getTeamMembers(teamId),
      });
    },
    [queryClient],
  );

  // const handleSearchFriendSuggestions = useCallback(
  //   async (query: string) => {
  //     return queryClient.fetchQuery({


  // const personalAchievementData = useMemo(() => {
  //   if (!profile) return null;

  //   return {
  //     name: profile.name,
  //     achievements: achievements,
  //   };
  // }, [profile, achievements]);

  if (authLoading || profileLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    return <ProfilePageMessage title="No se encontró una sesión activa" />;
  }

  if (profileError || !profile) {
    return (
      <ProfilePageMessage title="No se pudo cargar la información principal del perfil" />
    );
  }

  return (
    <>
      <main className="min-h-full min-w-full bg-background-page px-8 py-8 text-neutral-950">
        <div className="mx-auto min-w-full max-w-screen-2xl">
          <header className="mb-6">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
              Perfil de usuario
            </h1>
            <p className="mt-2 text-base text-neutral-500">
              Consulta tu información, amistades y progreso de logros.
            </p>
          </header>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-9">
              <ProfileHeaderCard profile={profile} />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <ProgressSummaryCard profile={profile} />
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div id="friends-section" className="min-w-0 lg:col-span-4">
              <FriendsCard
                friends={friends}
                isLoading={friendsLoading}
                error={friendsError}
                selectedFriendId={selectedFriendId}
                onCompareFriend={handleCompareFriend}
                onClearComparison={handleClearComparison}
                onDisplayAll={handleDisplayAllFriends}
                onInviteFriendsShortcut={handleInviteFriends}
              />
            </div>

            <div className="min-w-0 lg:col-span-4">
              <TeamsCard
                teams={teams}
                isLoading={teamsLoading}
                error={teamsError}
                onDisplayAll={handleDisplayAllTeams}
                onCreateTeamShortcut={handleCreateTeamShortcut}
                onDisplayMembers={handleDisplayTeamMembers}
              />
            </div>

            <div className="min-w-0 lg:col-span-4">
              <AchievementComparisonCard
                achievements={achievements}
                isLoading={achievementsLoading}
                error={achievementsError}
                onDisplayAll={handleDisplayAllAchievements}
              />
            </div>
          </section>
        </div>
      </main>

      <FriendsDrawer
        isOpen={isFriendDrawerOpen}
        friends={friends}
        selectedFriendId={selectedFriendId}
        initialMode={initialFriendDrawerMode}
        onSearchSuggestions={handleSearchUserSuggestions}
        onCompareFriend={handleCompareFriend}
        onClearComparison={handleClearComparison}
        onClose={handleCloseFriendDrawer}
        onSendFriendRequests={async (payload) => {
          console.log("Solicitudes enviadas:", payload);
        }}
      />

      <TeamsDrawer
        open={isTeamDrawerOpen}
        teams={teams}
        onClose={handleCloseTeamDrawer}
        initialOpenTeamId={initialOpenTeamId}
        initialTeamDrawerMode={initialTeamDrawerMode}
        getUsers={handleSearchUserSuggestions}
        onGetTeamMembers={handleGetTeamMembers}
        onCreateTeam={async (payload) => {
          console.log("Crear equipo:", payload);
        }}
      />

      <AchievementComparisonDrawer
        isOpen={isAchievementDrawerOpen}
        personalData={{
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          achievements,
        }}
        friendData={selectedFriendAchievementData}
        friendDataLoading={selectedFriendAchievementsLoading}
        friendDataError={selectedFriendAchievementsError}
        friends={friends}
        selectedFriendId={selectedFriendId}
        onSelectFriend={setSelectedFriendId}
        onClose={handleCloseAchievementDrawer}
        onClearComparison={handleClearComparison}
      />
    </>
  );
}
