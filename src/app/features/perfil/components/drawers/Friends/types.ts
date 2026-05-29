export type SendFriendRequestsPayload = {
  userIds: string[];
  message?: string;
};

export type DrawerMode = "list" | "invite";
export type SortOption = "name-asc" | "name-desc";
