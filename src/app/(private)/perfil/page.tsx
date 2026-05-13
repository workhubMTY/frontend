"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@/app/features/perfil/data/mockProfileApi";
import { ProfileHeaderCard } from "@/app/features/perfil/components/ProfileHeaderCard";
import { ProgressSummaryCard } from "@/app/features/perfil/components/ProgressSumaryCard";
import { FriendsCard } from "@/app/features/perfil/components/FriendsCard";
import { TeamsCard } from "@/app/features/perfil/components/TeamsCard";
import { AchievementComparisonCard } from "@/app/features/perfil/components/AchievementComparisonCard";

export default function UserProfilePage() {
  const USER_ID = "MF"; // Esto deberiamos poder sacarlo de un context o algo

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [friendsData, setFriendsData] = useState<AchievementUserData | null>(
    null,
  );
  const [teams, setTeams] = useState<Team[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
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
      if (!selectedFriendId) return;
      const selectedFriend = friends?.find(
        (current) => current.id === selectedFriendId,
      );
      if (!selectedFriend) return;
      try {
        const achievementsResponse =
          await getAchievementsByUserId(selectedFriendId);
        setFriendsData({
          name: selectedFriend.name,
          achievements: achievementsResponse,
        });
      } catch (error) {
        console.log(error);
      }
    }
    loadFriendsAchievements();
  }, [selectedFriendId]);

  function handleCompareFriend(friendId: string) {
    console.log(friendId);
    setSelectedFriendId(friendId);
  }

  function handleClearComparison() {
    setSelectedFriendId(null);
  }

  function handleChangeFriend() {
    document
      .getElementById("friends-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile || !teams || !friends || !achievements) {
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
    <main className="min-h-screen bg-background-page px-8 py-8 text-neutral-950">
      <div className="mx-auto max-w-screen-2xl">
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
          <div id="friends-section" className="col-span-4">
            <FriendsCard
              friends={friends}
              selectedFriendId={selectedFriendId}
              onCompareFriend={handleCompareFriend}
              onClearComparison={handleClearComparison}
              onInviteFriend={(friend) =>
                alert(`Invitación enviada a ${friend.name}`)
              }
            />
          </div>

          <div className="col-span-4">
            <TeamsCard teams={teams} />
          </div>

          <div className="col-span-4">
            {friendsData ? (
              <AchievementComparisonCard
                personalData={{
                  name: profile.name,
                  achievements,
                }}
                friendsData={friendsData}
                onChangeFriend={handleChangeFriend}
              />
            ) : (
              <AchievementComparisonCard
                personalData={{
                  name: profile.name,
                  achievements,
                }}
                onChangeFriend={handleChangeFriend}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfilePageSkeleton() {
  return (
    <main className="min-h-screen bg-background-page px-8 py-8">
      <div className="mx-auto max-w-screen-2xl animate-pulse">
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
