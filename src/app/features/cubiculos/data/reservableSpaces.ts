import type { ReservableSpace } from "../types/reservableSpaces";
import { SpaceSearchFilters } from "../types/searchFilters";
export const reservableSpaces: ReservableSpace[] = [
  {
    id: 1,
    code: "#SM1",
    name: "Sierra Madre",
    floor: "MZ",
    capacity: 6,
    status: "available",
    statusLabel: "Disponible",
    timeline: [
      { id: "t1", start: "08:00", end: "09:00", status: "free" },
      { id: "t2", start: "09:00", end: "10:00", status: "search" },
      { id: "t3", start: "10:00", end: "11:30", status: "occupied" },
      { id: "t4", start: "11:30", end: "15:00", status: "free" },
      { id: "t5", start: "15:00", end: "16:00", status: "occupied" },
      { id: "t6", start: "16:00", end: "18:00", status: "free" },
    ],
  },
  {
    id: 2,
    code: "#SJ1",
    name: "Sala de juntas 1",
    floor: "MZ",
    capacity: 6,
    status: "occupied",
    statusLabel: "Ocupado",
    timeline: [],
  },
  {
    id: 3,
    code: "#SJ3",
    name: "Sala de juntas 3",
    floor: "MZ",
    capacity: 8,
    status: "soon",
    statusLabel: "Por comenzar",
    timeline: [],
  },
  {
    id: 4,
    code: "#CW1",
    name: "Coworking",
    floor: "MZ",
    capacity: 20,
    status: "available",
    statusLabel: "Disponible",
    timeline: [],
  },
  {
    id: 5,
    code: "#OF1",
    name: "Oficina 1",
    floor: "MZ",
    capacity: 1,
    status: "available",
    statusLabel: "Disponible",
    timeline: [],
  },
];
export async function fetchReservableSpaces(filters: SpaceSearchFilters) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return reservableSpaces.filter((space) => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      space.code.toLowerCase().includes(normalizedSearch) ||
      space.name.toLowerCase().includes(normalizedSearch);

    const matchesCapacity =
      (!filters.capacity.minCapacity ||
        space.capacity >= Number(filters.capacity.minCapacity)) &&
      (!filters.capacity.maxCapacity ||
        space.capacity <= Number(filters.capacity.maxCapacity));

    return matchesSearch && matchesCapacity;
  });
}
