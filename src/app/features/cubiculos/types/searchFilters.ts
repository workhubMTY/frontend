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
  floor: string;

  search: string;

  time: {
    startTime: string;
    endTime: string;
  };

  capacity: {
    minCapacity: string;
    maxCapacity: string;
  };

  daysToApply: string[];
};