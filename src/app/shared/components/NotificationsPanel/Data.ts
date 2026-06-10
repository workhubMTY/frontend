import { authFetch } from '../../data/api';
import { FriendRequest} from './notificationInterfaces'

export const api = {
  getFriendRequests: () =>
    authFetch<FriendRequest[]>("/friendships/requests/received/"),
  acceptRequest: (fromUser: string) =>
    authFetch("/friendships/requests/received", {
      method: "POST",
      body: JSON.stringify({ fromUser }),
    }),
  rejectRequest: (userId: string) =>
    authFetch("/friendships/requests/received", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),
};