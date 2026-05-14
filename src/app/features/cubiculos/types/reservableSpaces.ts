export type SpaceStatus = "available" | "occupied" | "soon" | "partial";

export type ReservableSpace = {
  id: string;
  code: string;
  name: string;
  displayName: string;
  floor: number;
  capacity: number;
  status: SpaceStatus;
  statusLabel: string;
  timeline: TimelineBlock[];
  map: {
    x: string;
    y: string;
    w: string;
    h: string;
  };
};

export type TimelineBlock = {
  id: string;
  start: string;
  end: string;
  status: "free" | "occupied" | "search";
};
