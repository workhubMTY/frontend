import { authFetch, API_URL, getExportToken } from "@/app/shared/data/api";
import type { 
    Parking, 
    ParkingReservations, 
    ParkingReservationData, 
    GetParkingReservationsParams,
    Users,
    Friendships,
    OfficeReservations
} from "./types";
import type {
    AttendanceSummary,
    ReservationSummary,
    GlobalAttendanceSummary,
    GlobalReservationSummary,
    TopUser,
    Period,
} from "./stats.types";

const ParkingLink = "/parking";
const OfficeLink = "/office"
const UserLink = "/users"
const StatsLink = "/reports";

type RangeParams = {
    period?: Period;
    from?: string;
    to?: string;
};

function buildQuery(params: RangeParams & { limit?: number }) {
    const q = new URLSearchParams();
    if (params.period) q.append("period", params.period);
    if (params.from) q.append("from", params.from);
    if (params.to) q.append("to", params.to);
    if (params.limit) q.append("limit", String(params.limit));
    const s = q.toString();
    return s ? `?${s}` : "";
}

export const listParkingReservations = {
  // Get /parking
  getParking: () => authFetch<Parking>(`${ParkingLink}`),
  // Get /parking/:id
  getParkingId: (id: number) => authFetch<Parking>(`${ParkingLink}/${id}`),
  // Get /parking/reservations
  getparkingReservations: (params?: GetParkingReservationsParams) => {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.cursor) {
      searchParams.append("cursor", params.cursor);
    }

    const query = searchParams.toString();

    return authFetch<ParkingReservations>(
      `${ParkingLink}/reservations${query ? `?${query}` : ""}`
    );
  },
  // Get /parking/reservations/:id
  getParkingReservationsId: (eId: string) => authFetch<ParkingReservationData>(`${ParkingLink}/reservations/${eId}`),
  // Get /parking/reservations/me
  getParkingReservationsme: () => authFetch<ParkingReservationData>(`${ParkingLink}/reservations/me`),
} as const;

export const listOfficeReservations = {
  // Get /office/reservations
  getOfficeReservations: () => authFetch<OfficeReservations>(`${OfficeLink}/reservations`),
} as const

export const listUsers = {
    // Get /users
    getUsers: () => authFetch<Users>(`${UserLink}`),
    // Get /users/:eId/friendships
    getUsersFriendships: (eId: string) => authFetch<Friendships>(`${UserLink}/${eId}/friendships`),
} as const

export const listGuest = {} as const
 
export const listStats = {
    // GET /stats/:userId/attendance
    getUserAttendance: (userId: string, params: RangeParams = {}) =>
        authFetch<AttendanceSummary>(
            `${StatsLink}/stats/${userId}/attendance${buildQuery(params)}`
        ),
 
    // GET /stats/:userId/reservations
    getUserReservations: (userId: string, params: RangeParams = {}) =>
        authFetch<ReservationSummary>(
            `${StatsLink}/stats/${userId}/reservations${buildQuery(params)}`
        ),
 
    // GET /stats/global/attendance
    getGlobalAttendance: (params: RangeParams = {}) =>
        authFetch<GlobalAttendanceSummary>(
            `${StatsLink}/stats/global/attendance${buildQuery(params)}`
        ),
 
    // GET /stats/global/reservations
    getGlobalReservations: (params: RangeParams = {}) =>
        authFetch<GlobalReservationSummary>(
            `${StatsLink}/stats/global/reservations${buildQuery(params)}`
        ),
 
    // GET /stats/global/top?limit=10
    getTopUsers: (params: RangeParams & { limit?: number } = {}) =>
        authFetch<TopUser[]>(
            `${StatsLink}/stats/global/top${buildQuery(params)}`
        ),

    //  GET /stats/global/export → descarga el .xlsx
    exportGlobalAttendance: async (params: RangeParams = {}) => {
        const query = buildQuery(params);
        // Usar API_URL igual que el resto de las llamadas
        const url = `${API_URL}${StatsLink}/stats/global/export${query}`;

        // Obtener el token desde los accessors registrados en authFetch
        // Se importa _auth indirectamente a través de la función getToken exportada
        const token = getExportToken();
        if (!token) throw new Error("No autenticado");

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });

        if (!res.ok) throw new Error(`Export failed: ${res.status}`);

        const blob    = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const anchor  = document.createElement("a");
        const cd      = res.headers.get("Content-Disposition") ?? "";
        const match   = cd.match(/filename="(.+)"/);
        anchor.href     = blobUrl;
        anchor.download = match?.[1] ?? "estadisticas.xlsx";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
    },
 
} as const;