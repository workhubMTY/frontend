export type DrawerMode = "list" | "invite";

export type FriendsListTabId = "friends" | "sent-requests";

export type SendFriendRequestsPayload = {
  toUserIds: string[];
  message?: string;
};

export type SentFriendRequest = {
  id: string;
  eId:string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  status?: "pending" | "accepted" | "rejected" | "cancelled";
};