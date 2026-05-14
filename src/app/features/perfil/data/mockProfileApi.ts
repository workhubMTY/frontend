import type {
  UserProfile,
  Achievement,
  Team,
  Friend,
  User,
} from "../types/profile";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export async function getUserProfileMock(): Promise<ProfileApiResponse> {
//   await wait(500);

//   return {
//     profile: {
//       id: "user-1",
//       name: "María Fernanda López",
//       email: "maria@accenture.com",
//       role: "Desarrollador fullstack",
//       avatarUrl:
//         "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
//       stats: {
//         points: 2450,
//         streakDays: 12,
//         friendsCount: 48,
//         completedAchievements: 18,
//         inProgressAchievements: 5,
//         pendingAchievements: 12,
//       },
//       friends: [
//         {
//           id: "friend-1",
//           name: "Carlos Méndez",
//           role: "Compañero",
//           avatarUrl:
//             "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
//         },
//         {
//           id: "friend-2",
//           name: "Valeria Ruiz",
//           role: "Compañera",
//           avatarUrl:
//             "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
//         },
//         {
//           id: "friend-3",
//           name: "Andrés Gómez",
//           role: "Organizador",
//           avatarUrl:
//             "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
//         },
//       ],
//       teams: [
//         {
//           id: "team-1",
//           name: "Equipo Alpha",
//           initials: "EA",
//           membersCount: 4,
//
//         },
//         {
//           id: "team-2",
//           name: "Equipo Beta",
//           initials: "EB",
//           membersCount: 2,
//
//         },
//         {
//           id: "team-3",
//           name: "Equipo Gamma",
//           initials: "EG",
//           membersCount: 1,
//
//         },
//       ],
//       achievements: [
//         {
//           id: "achievement-1",
//           title: "Primera amistad",
//           description: "Agrega 1 amigo a tu red",
//           icon: "users",
//           userProgress: {
//             current: 1,
//             target: 1,
//             status: "completed",
//           },
//           friendsProgress: {
//             "friend-1": {
//               current: 1,
//               target: 1,
//               status: "completed",
//             },
//             "friend-2": {
//               current: 1,
//               target: 1,
//               status: "completed",
//             },
//             "friend-3": {
//               current: 0,
//               target: 1,
//               status: "in_progress",
//             },
//           },
//         },
//         {
//           id: "achievement-2",
//           title: "Red activa",
//           description: "Ten 10 amigos en tu red",
//           icon: "network",
//           userProgress: {
//             current: 7,
//             target: 10,
//             status: "in_progress",
//           },
//           friendsProgress: {
//             "friend-1": {
//               current: 4,
//               target: 10,
//               status: "in_progress",
//             },
//             "friend-2": {
//               current: 10,
//               target: 10,
//               status: "completed",
//             },
//             "friend-3": {
//               current: 3,
//               target: 10,
//               status: "in_progress",
//             },
//           },
//         },
//         {
//           id: "achievement-3",
//           title: "Racha de 10 días",
//           description: "Inicia sesión 10 días seguidos",
//           icon: "flame",
//           userProgress: {
//             current: 6,
//             target: 10,
//             status: "in_progress",
//           },
//           friendsProgress: {
//             "friend-1": {
//               current: 5,
//               target: 10,
//               status: "in_progress",
//             },
//             "friend-2": {
//               current: 9,
//               target: 10,
//               status: "in_progress",
//             },
//             "friend-3": {
//               current: 10,
//               target: 10,
//               status: "completed",
//             },
//           },
//         },
//       ],
//     },
//   };
// }

type FriendList = Record<string, Friend[]>;
const FRIENDS: FriendList = {
  MF: [
    {
      id: "CM",
      name: "Carlos Méndez",
      role: "Compañero",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "VR",
      name: "Valeria Ruiz",
      role: "Compañera",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "AG",
      name: "Andrés Gómez",
      role: "Organizador",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "LP",
      name: "Laura Pérez",
      role: "Compañera",
      avatarUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "JM",
      name: "Jorge Martínez",
      role: "Amigo cercano",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "SR",
      name: "Sofía Ramírez",
      role: "Compañera",
      avatarUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "MT",
      name: "Miguel Torres",
      role: "Mentor",
      avatarUrl:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
    },
    {
      id: "AC",
      name: "Ana Castillo",
      role: "Compañera",
      avatarUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop&crop=face",
    },
  ],
};

type AchievementList = Record<string, Achievement[]>;

const ACHIEVEMENTS: AchievementList = {
  MF: [
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

  CM: [
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

  VR: [
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

  AG: [
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

  LP: [
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

  JM: [
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

  SR: [
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

  MT: [
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

  AC: [
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

const TEAMS: TeamList = {
  MF: [
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

  CM: [
    {
      id: "team-delta",
      name: "Equipo Delta",
      membersCount: 3,
    },
    {
      id: "team-epsilon",
      name: "Equipo Épsilon",
      membersCount: 5,
    },
  ],

  VR: [
    {
      id: "team-zeta",
      name: "Equipo Zeta",
      membersCount: 2,
    },
    {
      id: "team-theta",
      name: "Equipo Theta",
      membersCount: 4,
    },
  ],

  AG: [
    {
      id: "team-omega",
      name: "Equipo Omega",
      membersCount: 6,
    },
    {
      id: "team-sigma",
      name: "Equipo Sigma",
      membersCount: 3,
    },
  ],
};

export async function getUserProfileMock(): Promise<UserProfile> {
  await wait(500);

  return {
    id: "user-1",
    name: "María Fernanda López",
    email: "maria@accenture.com",
    role: "Desarrollador fullstack",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    stats: {
      points: 2450,
      streakDays: 12,
      friendsCount: 48,
      completedAchievements: 18,
      inProgressAchievements: 5,
      pendingAchievements: 12,
    },
  };
}
export async function getFriendsByUserId(userId: string) {
  await wait(500);
  return FRIENDS[userId];
}
export async function getAchievementsByUserId(userId: string) {
  await wait(500);
  return ACHIEVEMENTS[userId];
}
export async function getTeamsByUserId(userId: string) {
  await wait(500);
  return TEAMS[userId];
}

export async function mockGetTeamMembers(teamId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const membersByTeamId: Record<string, User[]> = {
    "team-alpha": [
      {
        id: "member-1",
        name: "Valeria Ruiz",
        role: "Líder",
        avatarUrl: "/avatars/valeria.jpg",
      },
      {
        id: "member-2",
        name: "Carlos Méndez",
        role: "Miembro",
        avatarUrl: "/avatars/carlos.jpg",
      },
      {
        id: "member-3",
        name: "Mariana López",
        role: "Miembro",
      },
      {
        id: "member-4",
        name: "Diego Fernández",
        role: "Miembro",
      },
    ],
    "team-beta": [
      {
        id: "member-5",
        name: "Ana Torres",
        role: "Líder",
      },
      {
        id: "member-6",
        name: "Sofía Martínez",
        role: "Miembro",
      },
    ],
    "team-gamma": [
      {
        id: "member-7",
        name: "Javier Torres",
        role: "Miembro",
      },
    ],
  };

  return membersByTeamId[teamId] ?? [];
}

export async function mockGetSuggestions() {
  return [
    {
      id: "u-1",
      name: "Mariana López",
      email: "mariana@empresa.com",
      status: "available",
    },
    {
      id: "u-2",
      name: "Diego Fernández",
      email: "diego@empresa.com",
      status: "available",
    },
    {
      id: "u-3",
      name: "Sofía Martínez",
      email: "sofia@empresa.com",
      status: "pending",
    },
  ];
}
