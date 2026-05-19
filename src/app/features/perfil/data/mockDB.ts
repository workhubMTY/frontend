import {
  Achievement,
  Friend,
  FriendSuggestion,
  Team,
  User,
} from "../types/profile";

export const USERS: User[] = [
  {
    id: "1234567",
    name: "María Fernanda López",
    role: "Desarrollador fullstack",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    email: "maria@accenture.com",
  },
  {
    id: "2345678",
    name: "Carlos Méndez",
    role: "Product Owner",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    email: "carlos.mendez@accenture.com",
  },
  {
    id: "3456789",
    name: "Valeria Ruiz",
    role: "Scrum Master",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    email: "valeria.ruiz@accenture.com",
  },
  {
    id: "4567890",
    name: "Andrés Gómez",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    email: "andres.gomez@accenture.com",
  },
  {
    id: "5678901",
    name: "Laura Pérez",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
    email: "laura.perez@accenture.com",
  },
  {
    id: "6789012",
    name: "Jorge Martínez",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2e?w=200&h=200&fit=crop&crop=face",
    email: "jorge.martinez@accenture.com",
  },
  {
    id: "7890123",
    name: "Sofía Ramírez",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
    email: "sofia.ramirez@accenture.com",
  },
  {
    id: "8901234",
    name: "Miguel Torres",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
    email: "miguel.torres@accenture.com",
  },
  {
    id: "9012345",
    name: "Ana Castillo",
    role: "Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=face",
    email: "ana.castillo@accenture.com",
  },
  {
    id: "1234567",
    name: "Mariana López",
    role: "Backend Developer",
    avatarUrl: "/avatars/mariana.jpg",
    email: "mariana.lopez@accenture.com",
  },
  {
    id: "2233445",
    name: "Diego Fernández",
    role: "Frontend Developer",
    avatarUrl: "/avatars/diego.jpg",
    email: "diego.fernandez@accenture.com",
  },
  {
    id: "3344556",
    name: "Sofía Martínez",
    role: "QA Lead",
    avatarUrl: "/avatars/sofia.jpg",
    email: "sofia.martinez@accenture.com",
  },
  {
    id: "4455667",
    name: "Javier Torres",
    role: "Developer",
    avatarUrl: "/avatars/javier.jpg",
    email: "javier.torres@accenture.com",
  },
];

export const USERS_BY_ID = new Map(USERS.map((user) => [user.id, user]));

export const FRIEND_IDS_BY_USER_ID: Record<string, string[]> = {
  ["1234567"]: [
    "2345678",
    "3456789",
    "4567890",
    "5678901",
    "6789012",
    "7890123",
    "8901234",
    "9012345",
  ],
  ["2345678"]: ["1234567", "3456789", "4567890", "6789012", "9012345"],
  ["3456789"]: ["1234567", "2345678", "5678901", "7890123", "8901234"],
};

export const FRIENDS: Record<string, Friend[]> = Object.fromEntries(
  Object.entries(FRIEND_IDS_BY_USER_ID).map(([userId, friendIds]) => [
    userId,
    friendIds
      .map((friendId) => USERS_BY_ID.get(friendId))
      .filter((user): user is User => Boolean(user)),
  ]),
);

type AchievementList = Record<string, Achievement[]>;

export const ACHIEVEMENTS: AchievementList = {
  ["1234567"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 7, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 6, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 3, target: 5, status: "in_progress" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 12, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 15, target: 30, status: "in_progress" },
    },
  ],

  ["2345678"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 5, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 3, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 5, target: 5, status: "completed" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 7, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 10, target: 30, status: "in_progress" },
    },
  ],

  ["3456789"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 9, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 10, target: 10, status: "completed" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 4, target: 5, status: "in_progress" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 20, target: 20, status: "completed" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 30, target: 30, status: "completed" },
    },
  ],

  ["4567890"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 2, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 1, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 2, target: 5, status: "in_progress" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 5, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 7, target: 30, status: "in_progress" },
    },
  ],

  ["5678901"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 0, target: 1, status: "locked" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 4, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 2, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 1, target: 5, status: "in_progress" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 3, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 0, target: 30, status: "locked" },
    },
  ],

  ["6789012"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 10, target: 10, status: "completed" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 8, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 5, target: 5, status: "completed" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 18, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 25, target: 30, status: "in_progress" },
    },
  ],

  ["7890123"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 6, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 5, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 2, target: 5, status: "in_progress" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 10, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 12, target: 30, status: "in_progress" },
    },
  ],

  ["8901234"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 3, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 0, target: 10, status: "locked" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 0, target: 5, status: "locked" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 2, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 5, target: 30, status: "in_progress" },
    },
  ],

  ["9012345"]: [
    {
      id: "achievement-1",
      title: "Primera amistad",
      description: "Agrega 1 amigo a tu red",
      icon: "users",
      userProgress: { current: 1, target: 1, status: "completed" },
    },
    {
      id: "achievement-2",
      title: "Red activa",
      description: "Ten 10 amigos en tu red",
      icon: "network",
      userProgress: { current: 8, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-3",
      title: "Racha de 10 días",
      description: "Inicia sesión 10 días seguidos",
      icon: "flame",
      userProgress: { current: 9, target: 10, status: "in_progress" },
    },
    {
      id: "achievement-4",
      title: "Conexión creciente",
      description: "Agrega 5 amigos a tu red",
      icon: "users",
      userProgress: { current: 5, target: 5, status: "completed" },
    },
    {
      id: "achievement-5",
      title: "Red consolidada",
      description: "Ten 20 amigos en tu red",
      icon: "network",
      userProgress: { current: 15, target: 20, status: "in_progress" },
    },
    {
      id: "achievement-6",
      title: "Racha de 30 días",
      description: "Inicia sesión 30 días seguidos",
      icon: "flame",
      userProgress: { current: 20, target: 30, status: "in_progress" },
    },
  ],
};

type TeamList = Record<string, Team[]>;

export const TEAMS: TeamList = {
  ["1234567"]: [
    {
      id: "team-alpha",
      name: "Equipo Alpha",
      membersCount: 4,
    },
    {
      id: "team-beta",
      name: "Equipo Beta",
      membersCount: 2,
    },
    {
      id: "team-gamma",
      name: "Equipo Gamma",
      membersCount: 1,
    },
  ],
  ["2345678"]: [
    {
      id: "team-alpha",
      name: "Equipo Alpha",
      membersCount: 4,
    },
  ],
  ["3456789"]: [
    {
      id: "team-alpha",
      name: "Equipo Alpha",
      membersCount: 4,
    },
    {
      id: "team-beta",
      name: "Equipo Beta",
      membersCount: 2,
    },
  ],
};

export const TEAM_MEMBER_IDS_BY_TEAM_ID: Record<string, string[]> = {
  "team-alpha": ["3456789", "2345678", "1234567", "2233445"],
  "team-beta": ["9012345", "3344556"],
  "team-gamma": ["4455667"],
};

export const TEAM_MEMBER_ROLE_BY_USER_ID: Record<string, string> = {
  ["3456789"]: "Líder",
  ["9012345"]: "Líder",
};

export const SUGGESTION_STATUS_BY_USER_ID: Record<
  string,
  FriendSuggestion["status"]
> = {
  ["3344556"]: "pending",
};

import type { UserProfile } from "../types/profile";

type UserStats = UserProfile["stats"];

export const STATS_BY_USER_ID: Record<string, UserStats> = {
  "1234567": {
    points: 2450,
    streakDays: 12,
    friendsCount: 8,
    completedAchievements: 3,
    inProgressAchievements: 2,
    pendingAchievements: 1,
  },
  "2345678": {
    points: 1810,
    streakDays: 7,
    friendsCount: 5,
    completedAchievements: 2,
    inProgressAchievements: 2,
    pendingAchievements: 2,
  },
  "3456789": {
    points: 3260,
    streakDays: 21,
    friendsCount: 5,
    completedAchievements: 4,
    inProgressAchievements: 1,
    pendingAchievements: 1,
  },
  "4567890": {
    points: 980,
    streakDays: 3,
    friendsCount: 2,
    completedAchievements: 1,
    inProgressAchievements: 2,
    pendingAchievements: 3,
  },
  "5678901": {
    points: 1540,
    streakDays: 9,
    friendsCount: 3,
    completedAchievements: 2,
    inProgressAchievements: 1,
    pendingAchievements: 3,
  },
  "6789012": {
    points: 2120,
    streakDays: 15,
    friendsCount: 4,
    completedAchievements: 3,
    inProgressAchievements: 1,
    pendingAchievements: 2,
  },
  "7890123": {
    points: 2875,
    streakDays: 18,
    friendsCount: 3,
    completedAchievements: 4,
    inProgressAchievements: 1,
    pendingAchievements: 1,
  },
  "8901234": {
    points: 1320,
    streakDays: 6,
    friendsCount: 2,
    completedAchievements: 2,
    inProgressAchievements: 2,
    pendingAchievements: 2,
  },
  "9012345": {
    points: 1745,
    streakDays: 10,
    friendsCount: 3,
    completedAchievements: 3,
    inProgressAchievements: 1,
    pendingAchievements: 2,
  },
  "1122334": {
    points: 760,
    streakDays: 2,
    friendsCount: 1,
    completedAchievements: 1,
    inProgressAchievements: 1,
    pendingAchievements: 4,
  },
  "2233445": {
    points: 1190,
    streakDays: 5,
    friendsCount: 2,
    completedAchievements: 2,
    inProgressAchievements: 1,
    pendingAchievements: 3,
  },
  "3344556": {
    points: 2050,
    streakDays: 14,
    friendsCount: 2,
    completedAchievements: 3,
    inProgressAchievements: 2,
    pendingAchievements: 1,
  },
  "4455667": {
    points: 690,
    streakDays: 1,
    friendsCount: 1,
    completedAchievements: 1,
    inProgressAchievements: 1,
    pendingAchievements: 4,
  },
};
