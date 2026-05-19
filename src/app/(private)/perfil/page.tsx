"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type UserProfile,
  type Friend,
  Achievement,
  Team,
  AchievementUserData,
} from "@/app/features/perfil/types/profile";
import {
  getUserProfileMock,
  getFriendsByUserId,
  getAchievementsByUserId,
  getTeamsByUserId,
  mockGetTeamMembers,
  getSuggestions,
} from "@/app/features/perfil/data/mockProfileApi";
import { ProfileHeaderCard } from "@/app/features/perfil/components/cards/ProfileHeaderCard";
import { ProgressSummaryCard } from "@/app/features/perfil/components/cards/ProgressSumaryCard";
import { FriendsCard } from "@/app/features/perfil/components/cards/FriendsCard";
import { TeamsCard } from "@/app/features/perfil/components/cards/TeamsCard";
import { AchievementComparisonCard } from "@/app/features/perfil/components/cards/AchievementComparisonCard";
import { FriendsDrawer } from "@/app/features/perfil/components/drawers/FriendsDrawer";
import { TeamsDrawer } from "@/app/features/perfil/components/drawers/TeamsDrawer";
import { AchievementComparisonDrawer } from "@/app/features/perfil/components/drawers/AchievementComparisonDrawer";

export default function UserProfilePage() {
  const USER_ID = "MF"; // Esto deberiamos poder sacarlo de un context o algo

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);

  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedFriendsData, setSelectedFriendsData] =
    useState<AchievementUserData | null>(null);

  const [isFriendDrawerOpen, setIsFriendDrawerOpen] = useState(false);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [isAchievementDrawerOpen, setIsAchievementDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [initialOpenTeamId, setInitialOpenTeamId] = useState<string | null>(
    null,
  );

  const [initialTeamDrawerMode, setInitialTeamDrawerMode] = useState<
    "list" | "create"
  >("list");
  const [initialFriendDrawerMode, setInitialFriendDrawerMode] = useState<
    "list" | "invite"
  >("list");

  const personalAchievementData = useMemo<AchievementUserData | null>(() => {
    if (!profile || !achievements) return null;

    return {
      name: profile.name,
      achievements,
    };
  }, [profile, achievements]);

  function handleDisplayAllTeams() {
    setInitialOpenTeamId(null);
    setIsTeamDrawerOpen(true);
    setIsFriendDrawerOpen(false);
    setIsAchievementDrawerOpen(false);
  }

  function handleDisplayTeamMembers(teamId: string) {
    setInitialOpenTeamId(teamId);
    setIsTeamDrawerOpen(true);
    setIsFriendDrawerOpen(false);
    setIsAchievementDrawerOpen(false);
  }

  function handleDisplayAllAchievements() {
    setIsAchievementDrawerOpen(true);
    setIsFriendDrawerOpen(false);
    setIsTeamDrawerOpen(false);
  }

  const handleSearchSuggestions = useCallback(async (query: string) => {
    return await getSuggestions(query);
  }, []);

  function handleDisplayAllFriends() {
    setInitialFriendDrawerMode("list");
    setIsFriendDrawerOpen(true);
    setIsTeamDrawerOpen(false);
  }

  function handleInviteFriends() {
    setInitialFriendDrawerMode("invite");
    setIsFriendDrawerOpen(true);
    setIsAchievementDrawerOpen(false);
    setIsTeamDrawerOpen(false);
  }
  function handleCompareFriend(friendId: string) {
    setSelectedFriendId(friendId);
    setIsAchievementDrawerOpen(true);
    setIsFriendDrawerOpen(false);
    setIsTeamDrawerOpen(false);
  }

  function handleCreateTeamShortcut() {
    setInitialTeamDrawerMode("create");
    setIsTeamDrawerOpen(true);
    setIsAchievementDrawerOpen(false);
    setIsFriendDrawerOpen(false);
  }

  function handleSelectFriendInsideAchievementDrawer(friendId: string | null) {
    setSelectedFriendId(friendId);
  }

  function handleClearComparison() {
    setSelectedFriendId(null);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);

        const [
          profileResponse,
          friendResponse,
          achievementResponse,
          teamsResponse,
        ] = await Promise.all([
          getUserProfileMock(),
          getFriendsByUserId(USER_ID),
          getAchievementsByUserId(USER_ID),
          getTeamsByUserId(USER_ID),
        ]);

        setProfile(profileResponse);
        setFriends(friendResponse);
        setAchievements(achievementResponse);
        setTeams(teamsResponse);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadFriendsAchievements() {
      if (!selectedFriendId) {
        setSelectedFriendsData(null);
        return;
      }

      const selectedFriend = friends?.find(
        (current) => current.id === selectedFriendId,
      );

      if (!selectedFriend) return;

      try {
        const achievementsResponse =
          await getAchievementsByUserId(selectedFriendId);

        setSelectedFriendsData({
          name: selectedFriend.name,
          achievements: achievementsResponse,
        });
      } catch (error) {
        console.log(error);
      }
    }

    loadFriendsAchievements();
  }, [selectedFriendId, friends]);

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (
    !profile ||
    !teams ||
    !friends ||
    !achievements ||
    !personalAchievementData
  ) {
    return (
      <main className="min-h-screen bg-neutral-100 px-8 py-8">
        <div className="mx-auto max-w-screen-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-950">
            No se pudo cargar el perfil
          </h1>
        </div>
      </main>
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
                onDisplayAll={handleDisplayAllTeams}
                onCreateTeamShortcut={handleCreateTeamShortcut}
                onDisplayMembers={handleDisplayTeamMembers}
              />
            </div>

            <div className="min-w-0 lg:col-span-4">
              <AchievementComparisonCard
                achievements={achievements}
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
        onSearchSuggestions={handleSearchSuggestions}
        onCompareFriend={handleCompareFriend}
        onClearComparison={handleClearComparison}
        onClose={() => setIsFriendDrawerOpen(false)}
        onSendFriendRequests={async (payload) => {
          console.log("Solicitudes enviadas:", payload);
          // AQUI HACEMOS POST
        }}
      />

      <TeamsDrawer
        open={isTeamDrawerOpen}
        teams={teams}
        onClose={() => {
          setIsTeamDrawerOpen(false);
          setInitialTeamDrawerMode("list");
        }}
        initialOpenTeamId={initialOpenTeamId}
        initialTeamDrawerMode={initialTeamDrawerMode}
        onGetTeamMembers={mockGetTeamMembers}
        inviteCandidates={friends}
        onCreateTeam={async (payload) => {
          console.log("Crear equipo:", payload);
          // Aqui metemos la llamada a la api
        }}
      />

      <AchievementComparisonDrawer
        isOpen={isAchievementDrawerOpen}
        personalData={personalAchievementData}
        friendData={selectedFriendsData}
        friends={friends}
        selectedFriendId={selectedFriendId}
        onSelectFriend={handleSelectFriendInsideAchievementDrawer}
        onClose={() => {
          setIsAchievementDrawerOpen(false);
          setSelectedFriendsData(null);
          setSelectedFriendId(null);
        }}
        onClearComparison={handleClearComparison}
      />
    </>
  );
}

function ProfilePageSkeleton() {
  return (
    <main className="min-h-screen bg-background-page px-8 py-8">
      <div className="mx-auto min-w-full max-w-screen-2xl animate-pulse">
        <div className="h-10 w-72 bg-container" />
        <div className="mt-3 h-5 w-96 bg-container" />

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-64 border border-neutral-200 bg-container lg:col-span-9" />
          <div className="h-64 border border-neutral-200 bg-container lg:col-span-3" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
        </div>
      </div>
    </main>
  );
}
