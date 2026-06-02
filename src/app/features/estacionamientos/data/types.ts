export type LifecycleStatus = "ACTIVE" | "CANCELED";

export type AttendanceStatus =
  | "NOT_ARRIVED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW";

export type AllocationState = "SOFT" | "FROZEN";

export type ParkingLot = {
  id: number;
  name: string;
  capacity: number;
  priority: number;
};

export type CreateParkingLot = Omit<ParkingLot, "id">;

export type UpdateParkingLot = Partial<CreateParkingLot>;

export type ParkingReservation = {
  id: number;
  user_id: string;
  start_time: Date;
  end_time: Date;
  lifecycle_status: LifecycleStatus;
  attendance_status: AttendanceStatus;
  allocation_state: AllocationState;
  canceled_at?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateParkingReservation = {
  /** Omitir para reservar como el usuario autenticado. Solo ADMIN puede especificar otro user_id. */
  user_id?: string;
  start_time: Date;
  end_time: Date;
};

export type StepMinutes = "15" | "30" | "60";

export type ListReservationsQuery = {
  user_id?: string;
  start_time?: Date;
  end_time?: Date;
  lifecycle_status?: LifecycleStatus;
  attendance_status?: AttendanceStatus;
  allocation_state?: AllocationState;
  /** CSV de includes. El back acepta "parking_lot". */
  include?: "parking_lot"[];
  limit?: number;
  cursor?: number;
};

export type ReservationBucketsQuery = {
  start_time: Date;
  end_time: Date;
  step_minutes?: StepMinutes;
};

export type PatchAttendance = {
  attendance_status: AttendanceStatus;
};

export type ReservationBucket = {
  timestamp: string;
  reservation_count: number;
};

export type ReservationBucketsResponse = {
  capacity: number;
  buckets: ReservationBucket[];
};

export type ReservationDetailResponse = {
  reservation: ParkingReservation;
  projection: {
    parking_lot: ParkingLot | null;
    slot_index: number | null;
    fifo_position: number;
  } | null;
};

export type ListReservationsResponse = {
  items: ParkingReservation[];
};

// WebSocket

export type ParkingReservationPublic = {
  id: number;
  start_time: Date;
  end_time: Date;
  lifecycle_status: LifecycleStatus;
  attendance_status: AttendanceStatus;
  allocation_state: AllocationState;
  updated_at: Date;
};

export type ParkingUpdateMessage =
  | { type: "reservation.created"; payload: ParkingReservationPublic }
  | { type: "reservation.canceled"; payload: ParkingReservationPublic }
  | { type: "reservation.attendance_updated"; payload: ParkingReservationPublic }
  | { type: "reservation.no_show"; payload: ParkingReservationPublic }
  | { type: "lot.created"; payload: ParkingLot }
  | { type: "lot.updated"; payload: ParkingLot }
  | { type: "lot.deleted"; payload: { id: number } };
