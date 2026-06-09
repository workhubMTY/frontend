export type SelectionMode = "single" | "multiple" | "repeat";

export type CalendarCell = {
  id: string;
  date: Date;
  dayNumber: number;
  shortLabel: string;
  monthShort: string;
  isStartMonth: boolean;
  isMonthBoundary: boolean;
  isWeekend: boolean;
};
export type TimeBlock = {
  id: number;
  start: string;
  end: string;
  conflict?: boolean;
  applyToAllSelected?: boolean;
};

export type ApiReservation = {
  id: string;
  dateId: string;
  title: string;
  location: string;
  start: string;
  end: string;
};

export type CalendarSelectionAction =
  | {
      type: "day";
      dayId: string;
    }
  | {
      type: "range";
      dateIds: string[];
    };


export type CreateReservationBatchDto = {
  reservable_id: number;
  category?: "MEETING" | "RESERVATION";
  description?: string;
  timestamps: Array<{
    start_time: string;
    end_time: string;
  }>;
  participants?: string[];
  teamIds?: string[]
};