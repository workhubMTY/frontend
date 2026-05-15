import type { UserViewModel } from "../users/types";
import type { Reservation } from "../office-slots/types";

export type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export type Source = "ADMIN" | "REQUEST";

export type Friendship = {
  userLow: string;
  userHigh: string;
  source: Source;
  createdAt: string;
};

export type FriendRequest = {
  id: number;
  fromUser: string;
  toUser: string;
  status: RequestStatus;
  createdAt: string;
  resolvedAt: string | null;
};

export type CreateFriendRequestDto = {
  toUser: string;
};

export type AcceptFriendRequestDto = {
  fromUser: string;
};

export type RemoveRelationDto = {
  userId: string;
};

export type FriendWithReservations = UserViewModel & {
  reservations: Reservation[];
};