export type SendFriendRequestsPayload = {
  toUserIds: string[];
  message?: string;
};

export type DrawerMode = "list" | "invite";

export type FriendsTabMode = "friends" | "sent-requests";

export type SortOption = "name-asc" | "name-desc";

export type SentFriendRequest = {
  id: string;
  toUser: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
};