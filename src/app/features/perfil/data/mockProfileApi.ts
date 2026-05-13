import type { ProfileApiResponse } from "../types/profile";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUserProfileMock(): Promise<ProfileApiResponse> {
  await wait(500);

  return {
    profile: {
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
      friends: [
        {
          id: "friend-1",
          name: "Carlos Méndez",
          role: "Compañero",
          avatarUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        },
        {
          id: "friend-2",
          name: "Valeria Ruiz",
          role: "Compañera",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
        },
        {
          id: "friend-3",
          name: "Andrés Gómez",
          role: "Organizador",
          avatarUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
        },
      ],
      teams: [
        {
          id: "team-1",
          name: "Equipo Alpha",
          initials: "EA",
          membersCount: 4,
          role: "Miembro",
        },
        {
          id: "team-2",
          name: "Equipo Beta",
          initials: "EB",
          membersCount: 2,
          role: "Líder",
        },
        {
          id: "team-3",
          name: "Equipo Gamma",
          initials: "EG",
          membersCount: 1,
          role: "Miembro",
        },
      ],
      achievements: [
        {
          id: "achievement-1",
          title: "Primera amistad",
          description: "Agrega 1 amigo a tu red",
          icon: "users",
          userProgress: {
            current: 1,
            target: 1,
            status: "completed",
          },
          friendsProgress: {
            "friend-1": {
              current: 1,
              target: 1,
              status: "completed",
            },
            "friend-2": {
              current: 1,
              target: 1,
              status: "completed",
            },
            "friend-3": {
              current: 0,
              target: 1,
              status: "in_progress",
            },
          },
        },
        {
          id: "achievement-2",
          title: "Red activa",
          description: "Ten 10 amigos en tu red",
          icon: "network",
          userProgress: {
            current: 7,
            target: 10,
            status: "in_progress",
          },
          friendsProgress: {
            "friend-1": {
              current: 4,
              target: 10,
              status: "in_progress",
            },
            "friend-2": {
              current: 10,
              target: 10,
              status: "completed",
            },
            "friend-3": {
              current: 3,
              target: 10,
              status: "in_progress",
            },
          },
        },
        {
          id: "achievement-3",
          title: "Racha de 10 días",
          description: "Inicia sesión 10 días seguidos",
          icon: "flame",
          userProgress: {
            current: 6,
            target: 10,
            status: "in_progress",
          },
          friendsProgress: {
            "friend-1": {
              current: 5,
              target: 10,
              status: "in_progress",
            },
            "friend-2": {
              current: 9,
              target: 10,
              status: "in_progress",
            },
            "friend-3": {
              current: 10,
              target: 10,
              status: "completed",
            },
          },
        },
      ],
    },
  };
}

// export async function getUserProfileMock(): Promise<ProfileApiResponse> {
//   await wait(500);

//   return {

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

//   };
// }

// export async function getFriends(){
//   await wait(500)
//   return [
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
//       ]
// }

// export async function getAchievements(){
//   await wait(500)
//   return [
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
//       ]
// }

// export async function getTeams(){
//   await wait(500)

//       return [
//         {
//           id: "team-1",
//           name: "Equipo Alpha",
//           initials: "EA",
//           membersCount: 4,
//           role: "Miembro",
//         },
//         {
//           id: "team-2",
//           name: "Equipo Beta",
//           initials: "EB",
//           membersCount: 2,
//           role: "Líder",
//         },
//         {
//           id: "team-3",
//           name: "Equipo Gamma",
//           initials: "EG",
//           membersCount: 1,
//           role: "Miembro",
//         },
//       ]
// }
