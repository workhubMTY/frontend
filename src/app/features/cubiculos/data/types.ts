export type ParticipantStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Floor = {
  id: number;
  name: string;
  floor_number: number;
};

export type Reservation = {
  id: number;
  reservable_id: number;
  user_id: string;
  start_time: Date;
  end_time: Date;
  checked_in: 0 | 1;
};

export type WorkGroup = {
  id: number;
  name: string;
  description: string | null;
  memberCount?: number;
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Guest = {
  id: number;
  name: string;
  email: string;
};

export type ReservationParticipant = {
  id: number;
  reservationId: number;
  userId: string | null;
  guestId: number | null;
  ownershipPriority: number;
  checkedIn: boolean;
  status: ParticipantStatus;
  user: UserSummary | null;
  guest: Guest | null;
};

export type ReservationDetail = {
  id: number;
  reservableId: number;
  startTime: string;
  endTime: string;
  description: string;
  canOverlap: boolean;
  workGroups: WorkGroup[];
  participants: ReservationParticipant[];
};

export type FriendOccupancy = {
  user_id: string;
  user_name: string;
  start_time: Date;
  end_time: Date;
};

export type OfficeSlot = {
  id: number;
  name: string;
  code: string;
  capacity: number;
  floor_id: number;
  floor_name: string;
  is_blocked: boolean;
  is_available: boolean;
  status: "available" | "occupied" | "soon";
  statusLabel: string;
  timeline: {
    id: string;
    start: string;
    end: string;
    status: "free" | "occupied" | "search";
  }[];
  occupied_by_friends: FriendOccupancy[];
};

export type CreateOfficeSlotDto = {
  name: string;
  capacity: number;
  floor_id: number;
};

export type UpdateOfficeSlotDto = {
  name?: string;
  capacity?: number;
  floor_id?: number;
};

export type BlockSlotDto = {
  is_blocked: boolean;
};


export type CreateReservationBatchDto = {
  reservableId: number;
  description: string;
  schedules: { start_time: string; end_time: string }[];
  workGroupIds?: number[];
  userIds?: string[];
  guestIds?: number[];
  canOverlap: boolean;
};

export type UpdateParticipantStatusDto = {
  status: ParticipantStatus;
  reinvite?: boolean;
};

export type ReservationSummary = {
  id: number;
  reservable_id: number;
  reservable_name: string;
  floor_id: number;
  floor_name: string;
  start_time: string;
  end_time: string;
  checked_in: boolean;
  status: ParticipantStatus;
};

export type UserReservationSummary = {
  user_id: string;
  user_name: string;
  reservations: ReservationSummary[];
};

export type FriendReservationsSummary = UserReservationSummary[];

export type ReservationEvent = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  reservable: {
    id: number;
    name: string;
    capacity: number;
    floor_id: number;
    floor_name: string;
    floor_number: number;
  } | null;
};

export type GetEventsQuery = {
  reservable_id?: number;
  floor_id?: number;
  start_time?: string;
  end_time?: string;
};

export type CreateEventDto = {
  title: string;
  description: string;
  reservable_id?: number;
  start_time: string;
  end_time: string;
};

export type AvailableOfficeSlotsQuery = {
  floorId?: number;
  startTime: string;
  endTime: string;
  minCapacity: number;
  maxCapacity: number;
  query?: string;
  daysToApply?: string[];
  userId?: string;
};

export type OfficeSlotSummary = {
  id: number;
  name: string;
  code: string;
  floor: string;
  capacity: number;
  status: string;
};
