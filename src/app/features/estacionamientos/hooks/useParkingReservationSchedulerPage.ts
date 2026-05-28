// "use client";

// import { useMemo } from "react";

// import {
//   createApiJson,
//   toTimelineEvent,
// } from "@/app/features/reservaciones/data/reservationsApi";

// import { createCalendarCells } from "@/app/features/reservaciones/lib/dates";

// import { useReservationQueries } from "@/app/features/reservaciones/hooks/useReservationQueries";
// import { useReservationScheduler } from "@/app/features/reservaciones/hooks/useReservationScheduler";

// import type { TimelineEvent } from "@/app/features/reservaciones/types/reservaciones";

// type UseParkingReservationSchedulerPageParams = {
//   showAllEvents: boolean;
//   parkingId: string | null;
//   parkingName: string;
// };

// export function useParkingReservationSchedulerPage({
//   showAllEvents,
//   parkingId,
//   parkingName,
// }: UseParkingReservationSchedulerPageParams) {
//   const calendarCells = useMemo(() => createCalendarCells(), []);

//   const apiJson = useMemo(() => createApiJson(calendarCells), [calendarCells]);

//   const spaceReservationsByDate = useMemo(() => {
//     if (!parkingName) return {};

//     return apiJson.spaceReservations
//       .filter((reservation) => reservation.location === parkingName)
//       .reduce<Record<string, TimelineEvent[]>>(
//         (reservationsByDate, reservation) => {
//           const dateId = reservation.dateId;

//           if (!reservationsByDate[dateId]) {
//             reservationsByDate[dateId] = [];
//           }

//           reservationsByDate[dateId].push(
//             toTimelineEvent(reservation, "reserved"),
//           );

//           return reservationsByDate;
//         },
//         {},
//       );
//   }, [apiJson.spaceReservations, parkingName]);

//   const scheduler = useReservationScheduler({
//     calendarCells,
//     spaceReservationsByDate,
//   });

//   const proposedTimelineEventsForActiveDay = useMemo(
//     () =>
//       scheduler.proposedBlocksForActiveDay.map((block) => ({
//         id: block.id,
//         dateId: scheduler.activeDayId,
//         start: block.start,
//         end: block.end,
//         title: block.label ?? "Horario propuesto",
//         type: "pending",
//         status: "normal",
//       })),
//     [scheduler.proposedBlocksForActiveDay, scheduler.activeDayId],
//   );

//   const { spaceReservationsForActiveDay, externalEventsForInterval } =
//     useReservationQueries({
//       apiJson,
//       calendarCells,
//       activeDayId: scheduler.activeDayId,
//       spaceName: parkingName,
//       enabled: Boolean(parkingId),
//     });

//   const activeDayExternalEvents = useMemo(
//     () =>
//       externalEventsForInterval.filter(
//         (event) => event.dateId === scheduler.activeDayId,
//       ),
//     [externalEventsForInterval, scheduler.activeDayId],
//   );

//   const externalTimelineEventsForActiveDay = useMemo(
//     () =>
//       activeDayExternalEvents.map((event) =>
//         toTimelineEvent(event, "external"),
//       ),
//     [activeDayExternalEvents],
//   );

//   const conflictCount = useMemo(
//     () =>
//       activeDayExternalEvents.filter((event) => event.status !== "normal")
//         .length,
//     [activeDayExternalEvents],
//   );

//   const visibleEvents = useMemo(() => {
//     if (showAllEvents) return activeDayExternalEvents;

//     return activeDayExternalEvents
//       .filter((event) => event.status !== "normal")
//       .slice(0, 2);
//   }, [activeDayExternalEvents, showAllEvents]);

//   const selectedParking = useMemo(
//     () => ({
//       id: parkingId ?? "parking-default",
//       name: parkingName,
//     }),
//     [parkingId, parkingName],
//   );

//   return {
//     selectedParking,
//     parkingId,
//     parkingName,
//     calendarCells,
//     scheduler,
//     activeDayExternalEvents,
//     externalTimelineEventsForActiveDay,
//     proposedTimelineEventsForActiveDay,
//     spaceReservationsForActiveDay,
//     conflictCount,
//     visibleEvents,
//   };
// }
