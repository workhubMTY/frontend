export type TimeFilterValue = {
  startTime: string;
  endTime: string;
};
export type PeriodFilterValue = string[];

export type CapacityFilterValue = {
  minCapacity: string;
  maxCapacity: string;
};

export type SpaceSearchFilters = {
  search: string;
  time: {
    startTime: string;
    endTime: string;
  };
  capacity: CapacityFilterValue;
  daysToApply: PeriodFilterValue;
};