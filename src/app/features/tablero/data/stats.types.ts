export type Period = "day" | "week" | "month";

export type ReportsBucket = {
    period_label: string;
    total: number;
    attended: number;
    missed: number;
    canceled: number;
    pending: number;
    attendance_rate: number;
};

export type ReservationBucket = {
    period_label: string;
    total: number;
    checked_in: number;
    not_checked_in: number;
    canceled: number;
    pending: number;
};

export type AttendanceSummary = {
    total: number;
    attended: number;
    missed: number;
    canceled: number;
    pending: number;
    attendance_rate: number;
    buckets: ReportsBucket[];
};

export type ReservationSummary = {
    total: number;
    checked_in: number;
    not_checked_in: number;
    canceled: number;
    pending: number;
    buckets: ReservationBucket[];
};

export type GlobalAttendanceSummary = AttendanceSummary;
export type GlobalReservationSummary = ReservationSummary;

export type TopUser = {
    user_id: string;
    user_name: string;
    total: number;
    attended: number;
    missed: number;
    attendance_rate: number;
};