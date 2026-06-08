export type Parking = {
    id: number;
    name: string;
    capacity: number;
    priority: number;
};

export type ParkingProjection = {
    parking_lot: Parking;
    slot_index: number;
    fifo_position: number;
};

export type GetParkingReservationsParams = {
  limit?: number;
  cursor?: string;
};

export type Office = {
    id: number;
    name: string;
    capacity: number;
    floor_id: number;
    is_blocked: boolean;
};

export type Participants = {
    id: number;
    reservations_id: number;
    user_id: number;
    ownership_priority: number;
    attendance_status: string | null;
    created_at: string;
    updated_at: string;
};

export type Users = {
    eId: string;
    name: string;
    email: string;
    roleName: string;
    status: string;
};

export type Friends = Users;

export type Guests = {};

export type GuestsInvitatiosn = {}; 

export type ParkingReservation = {
  id: number;
  user_id: string;
  start_time: string;
  end_time: string;
  attendance_status: string;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
  lifecycle_status: string;
  parking_lot?: { id: number; name: string; capacity: number; priority: number };
};

export type OfficeReservable = {
  id: number;
  name: string;
  capacity: number;
  floor_id: number;
  is_blocked: boolean;
};

export type OfficeParticipant = {
  id: number;
  reservations_id: number;
  user_id: string | null;
  ownership_priority: number | null;
  attendance_status: string | null;
  created_at: string;
  updated_at: string;
};

export type OfficeReservation = {
  id: number;
  reservable_id: number;
  category: string;
  start_time: string;
  end_time: string;
  description: string;
  attendance_status: string;
  created_at: string;
  updated_at: string;
  lifecycle_status: string;
  reservable: OfficeReservable;
  participants: OfficeParticipant[];
};

export type BackendListResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  cursor: { nextCursor: string | null; hasNext: boolean };
};

export type ParkingReservationData = ParkingReservation;
export type OfficeReservations = OfficeReservation;