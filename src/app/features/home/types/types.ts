export type ReservationSummary = {
    id: number;
    reservable_id: number;
    reservable_name: string;
    floor_id: number;
    floor_name: string;
    start_time: string;
    end_time: string;
    checked_in: boolean;
};

export type UserReservationSummary = {
    user_id: string;
    user_name: string;
    reservations: ReservationSummary[];
};

export type FriendReservationsSummary = UserReservationSummary[];