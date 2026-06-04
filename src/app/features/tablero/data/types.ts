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

export type Office = Parking;

export type OfficeReservations = ParkingReservations;

// export type Office = {
// };

// export type OfficeReservations = {
// };

export type Users = {
    eId: string;
    name: string;
    email: string;
    roleName: string;
    status: string;
};

export type Friendships = Users;