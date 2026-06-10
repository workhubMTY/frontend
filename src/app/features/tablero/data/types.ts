export type Parking = {
    id: number;
    name: string;
    capacity: number;
    priority: number;
};

export type ParkingReservations = {
    id: number;
    user_id: string;
    start_time: string;
    end_time: string;
    lifecycle_status: string;
    attendance_status: string;
    allocation_state: string;
    canceled_at?: string | null;
    created_at: string;
    updated_at: string;
};

export type ParkingProjection = {
    parking_lot: Parking;
    slot_index: number;
    fifo_position: number;
};

export type ParkingReservationData = {
    reservation: ParkingReservations;
    projection: ParkingProjection;
};

export type GetParkingReservationsParams = {
  limit?: number;
  cursor?: string;
};

export type Office = {
    id: number;
    name: string;
    code: string;
    capacity: number;
    floor_id: number;
    is_blocked: boolean;
};

export type Participants = {
    id: number;
    reservations_id: number;
    user_id: string;
    ownership_priority: number;
    attendance_status: string | null;
    created_at: string;
    updated_at: string;
};

export type OfficeReservations = {
    id: number;
    reservavle_id: number;
    category: string;
    start_time: string;
    end_time: string;
    description: string;
    attendance_status: string;
    created_at: string;
    updated_at: string;
    lifecycle_status: string;
    reservable: Office;
    participants: Participants[];
};

export type Users = {
    eId: string;
    name: string;
    email: string;
    roleName: string;
    status: string;
};

export type Friendships = Users;