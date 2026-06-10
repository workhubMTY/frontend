import { authFetch } from "@/app/shared/data/api";

import type {
  OfficeSlot,
  WorkGroup,
  CreateOfficeSlotDto,
  UpdateOfficeSlotDto,
  BlockSlotDto,
  AvailableOfficeSlotsQuery,
  ReservationSummary,
  GetSlotReservationsPayload,
  OfficeSlotSummary,
} from "./types";

const SLOTS_BASE = `/office/slots`;
const WORK_GROUPS = `${SLOTS_BASE}/work-groups`;

function toApiDateTime(value: string | Date | undefined) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function normalizeSlotReservationsPayload(
  payload?: GetSlotReservationsPayload,
): GetSlotReservationsPayload {
  if (!payload) return {};

  const uniqueDates = payload.dates
    ? Array.from(new Set(payload.dates)).filter(Boolean)
    : undefined;

  if (uniqueDates && uniqueDates.length > 0) {
    return {
      dates: uniqueDates,
    };
  }

  return {
    start_time: toApiDateTime(payload.start_time),
    end_time: toApiDateTime(payload.end_time),
  };
}

export const officeSlotsApi = {
  getAllSlots: () => authFetch<OfficeSlot[]>(`${SLOTS_BASE}/`),

  getSlotById: (id: number) => authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}`),

  getAvailableSlots: (query: AvailableOfficeSlotsQuery) => {
    const params = new URLSearchParams();

    if (query.floorId) params.append("floorId", query.floorId.toString());
    if (query.startTime) params.append("startTime", query.startTime);
    if (query.endTime) params.append("endTime", query.endTime);
    if (query.userId) params.append("userId", query.userId);
    if (query.minCapacity)
      params.append("minCapacity", query.minCapacity.toString());
    if (query.maxCapacity)
      params.append("maxCapacity", query.maxCapacity.toString());
    if (query.query) params.append("query", query.query);

    if (query.daysToApply && query.daysToApply.length > 0) {
      query.daysToApply.forEach((day) => params.append("daysToApply", day));
    }

    return authFetch<OfficeSlotSummary[]>(
      `${SLOTS_BASE}/available?${params.toString()}`,
    );
  },

  createSlot: (payload: CreateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSlot: (id: number, payload: UpdateOfficeSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteSlot: (id: number) =>
    authFetch<void>(`${SLOTS_BASE}/${id}`, {
      method: "DELETE",
    }),

  blockSlot: (id: number, payload: BlockSlotDto) =>
    authFetch<OfficeSlot>(`${SLOTS_BASE}/${id}/block`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSlotReservations: (
    id: number,
    payload?: GetSlotReservationsPayload,
    detail = false,
    showInactiveReservations?:boolean
  ) => {
    const params = new URLSearchParams();

    if (detail) {
      params.append("detail", "true");
    }

    if(showInactiveReservations){
      params.append("showInactiveReservations", "true")
    }

    const search = params.toString();

    return authFetch<ReservationSummary[]>(
      `${SLOTS_BASE}/${id}/reservations${search ? `?${search}` : ""}`,
      {
        method: "POST",
        body: JSON.stringify(normalizeSlotReservationsPayload(payload)),
      },
    );
  },

  getSlotReservationsInRange: ({
    id,
    startTime,
    endTime,
    detail = false,
  }: {
    id: number;
    startTime: string | Date;
    endTime: string | Date;
    detail?: boolean;
  }) =>
    officeSlotsApi.getSlotReservations(
      id,
      {
        start_time: toApiDateTime(startTime),
        end_time: toApiDateTime(endTime),
      },
      detail,
    ),

  getSlotReservationsForDates: ({
    id,
    dates,
    detail = false,
  }: {
    id: number;
    dates: string[];
    detail?: boolean;
  }) =>
    officeSlotsApi.getSlotReservations(
      id,
      {
        dates,
      },
      detail,
    ),

  getWorkGroups: () => authFetch<WorkGroup[]>(`${WORK_GROUPS}`),
};