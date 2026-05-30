import type { AchievementUserData } from "../../../../types/profile";

export function getCompletedCount(userData: AchievementUserData) {
  return userData.achievements.filter((achievement) =>
    isProgressCompleted(
      achievement.userProgress.current,
      achievement.userProgress.target,
    ),
  ).length;
}

export function getSharedCompletedCount(
  personalData: AchievementUserData,
  friendData: AchievementUserData,
) {
  return personalData.achievements.filter((achievement) => {
    const friendAchievement = friendData.achievements.find(
      (item) => item.id === achievement.id,
    );

    if (!friendAchievement) return false;

    const userCompleted = isProgressCompleted(
      achievement.userProgress.current,
      achievement.userProgress.target,
    );

    const friendCompleted = isProgressCompleted(
      friendAchievement.userProgress.current,
      friendAchievement.userProgress.target,
    );

    return userCompleted && friendCompleted;
  }).length;
}

export function getFirstName(name: string) {
  return name.trim().split(" ")[0] ?? name;
}

function isProgressCompleted(current: number, target: number) {
  return current >= target;
}