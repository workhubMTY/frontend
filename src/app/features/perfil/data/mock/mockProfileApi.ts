import type {
  UserProfile,
  Achievement,
  Team,
  Friend,
  User,
  FriendSuggestion,
} from "@/app/features/perfil/types/profile";
import {
  ACHIEVEMENTS,
  FRIENDS,
  SUGGESTION_STATUS_BY_USER_ID,
  TEAM_MEMBER_IDS_BY_TEAM_ID,
  TEAM_MEMBER_ROLE_BY_USER_ID,
  TEAMS,
  USERS,
  USERS_BY_ID,
  STATS_BY_USER_ID,
} from "./mockDB";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type GetUsersParams = {
  query?: string;
  ids?: string[];
  excludeUserIds?: string[];
  limit?: number;
};

type GetSuggestionsParams = {
  query?: string;
  excludeUserIds?: string[];
  limit?: number;
};

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesUserSearch(user: User, query: string) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;

  return [user.name, user.email, user.role]
    .filter(Boolean)
    .some((value) => normalizeText(value ?? "").includes(normalizedQuery));
}

type GetUserProfileParams = {
  userId?: string;
};

type GetCollectionByUserParams = {
  userId?: string;
};

type GetTeamMembersParams = {
  teamId: string;
};

type QueryValue = string | number | boolean | undefined | null | string[];
type QueryParams = Record<string, QueryValue>;

function buildQueryString(params: QueryParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

function buildGetUrl(endpoint: string, params: QueryParams = {}) {
  return `${endpoint}${buildQueryString(params)}`;
}

function getSearchParams(url: string) {
  const queryString = url.split("?")[1] ?? "";

  return new URLSearchParams(queryString);
}

async function mockGet<T>(
  url: string,
  resolver: (params: URLSearchParams) => T,
) {
  await wait(500);

  return resolver(getSearchParams(url));
}

function getStringParam(params: URLSearchParams, key: string, fallback = "") {
  return params.get(key)?.trim() || fallback;
}

function getNumberParam(params: URLSearchParams, key: string) {
  const value = params.get(key);
  if (!value) return undefined;

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function getArrayParam(params: URLSearchParams, key: string) {
  return params.getAll(key).filter(Boolean);
}

export async function getUserProfile(
  params: GetUserProfileParams = {},
): Promise<UserProfile | null> {
  const url = buildGetUrl("/profile", {
    userId: params.userId,
  });

  return mockGet(url, (searchParams) => {
    const userId = getStringParam(searchParams, "userId");
    const user = USERS_BY_ID.get(userId);

    if (!user) return null;

    const achievements = ACHIEVEMENTS[user.id] ?? [];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      stats: STATS_BY_USER_ID[user.id] ?? {
        points: 0,
        streakDays: 0,
        friendsCount: FRIENDS[user.id]?.length ?? 0,
        completedAchievements: achievements.filter(
          (achievement) => achievement.userProgress.status === "completed",
        ).length,
        inProgressAchievements: achievements.filter(
          (achievement) => achievement.userProgress.status === "in_progress",
        ).length,
        pendingAchievements: achievements.filter(
          (achievement) => achievement.userProgress.status === "locked",
        ).length,
      },
    };
  });
}

export async function getFriends(
  params: GetCollectionByUserParams = {},
): Promise<Friend[]> {
  const url = buildGetUrl("/friends", {
    userId: params.userId,
  });

  return mockGet(url, (searchParams) => {
    const userId = getStringParam(searchParams, "userId");

    return FRIENDS[userId] ?? [];
  });
}

export async function getAchievements(
  params: GetCollectionByUserParams = {},
): Promise<Achievement[]> {
  const url = buildGetUrl("/achievements", {
    userId: params.userId,
  });

  return mockGet(url, (searchParams) => {
    const userId = getStringParam(searchParams, "userId");

    return ACHIEVEMENTS[userId] ?? [];
  });
}

export async function getTeams(
  params: GetCollectionByUserParams = {},
): Promise<Team[]> {
  const url = buildGetUrl("/teams", {
    userId: params.userId,
  });

  return mockGet(url, (searchParams) => {
    const userId = getStringParam(searchParams, "userId");

    return TEAMS[userId] ?? [];
  });
}

export async function getTeamMembers(
  params: GetTeamMembersParams,
): Promise<User[]> {
  const url = buildGetUrl("/teams/members", {
    teamId: params.teamId,
  });

  return mockGet(url, (searchParams) => {
    const teamId = getStringParam(searchParams, "teamId");
    const memberIds = TEAM_MEMBER_IDS_BY_TEAM_ID[teamId] ?? [];

    return memberIds
      .map((userId) => USERS_BY_ID.get(userId))
      .filter((user): user is User => Boolean(user))
      .map((user) => ({
        ...user,
        role: TEAM_MEMBER_ROLE_BY_USER_ID[user.id] ?? "Miembro",
      }));
  });
}

export async function getUsers(params: GetUsersParams = {}): Promise<User[]> {
  const url = buildGetUrl("/users", {
    query: params.query,
    ids: params.ids,
    excludeUserIds: params.excludeUserIds,
    limit: params.limit,
  });

  return mockGet(url, (searchParams) => {
    const query = getStringParam(searchParams, "query");
    const ids = getArrayParam(searchParams, "ids");
    const excludeUserIds = getArrayParam(searchParams, "excludeUserIds");
    const limit = getNumberParam(searchParams, "limit");

    const idsSet = ids.length > 0 ? new Set(ids) : null;
    const excludedIdsSet = new Set(excludeUserIds);

    const users = USERS.filter((user) => {
      if (idsSet && !idsSet.has(user.id)) return false;
      if (excludedIdsSet.has(user.id)) return false;

      return matchesUserSearch(user, query);
    });

    return typeof limit === "number" ? users.slice(0, limit) : users;
  });
}

export async function getSuggestions(
  params: GetSuggestionsParams = {},
): Promise<FriendSuggestion[]> {
  const query = params.query?.trim() ?? "";

  if (!query) return [];

  const users = await getUsers({
    query,
    excludeUserIds: params.excludeUserIds,
    limit: params.limit,
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: SUGGESTION_STATUS_BY_USER_ID[user.id] ?? "available",
  }));
}
