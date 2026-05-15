export type SpaceStatus = "available" | "occupied" | "soon" | "partial";

// Display Name es calculable a partir del codigo y el nombre concatenados
// status label igual.
// timeline no necesita search
export type ReservableSpace = {
  id: number;
  code: string;
  name: string;
  floor: string;
  capacity: number;
  status: "available" | "occupied" | "soon";
  statusLabel: string;
  timeline: TimelineBlock[];
};
export type TimelineBlock = {
  id: string;
  start: string;
  end: string;
  status: "free" | "occupied" | "search";
};
