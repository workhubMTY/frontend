"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { OfficeUpdateMessage } from "@/app/shared/socket/socket.context";
import type { ParkingUpdateMessage } from "@/app/features/estacionamientos/data/types";
import { listParkingReservations, listOfficeReservations } from "../data/api";
import type { ParkingReservation, OfficeReservation } from "../data/types";

export function getWeekRange(weekOffset: number): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff + weekOffset * 7);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return { start: mon, end: sun };
}

function parseParkingMe(raw: any): ParkingReservation[] {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((item: any) => {
      if (item?.reservation) {
        return { ...item.reservation, parking_lot: item.projection?.parking_lot } as ParkingReservation;
      }
      if (item?.id) return item as ParkingReservation;
      return null;
    })
    .filter(Boolean) as ParkingReservation[];
}

function parseOffice(raw: any): OfficeReservation[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as OfficeReservation[];
  if (raw?.id) return [raw] as OfficeReservation[];
  return [];
}

function filterByWeek<T extends { start_time: string }>(items: T[], weekOffset: number): T[] {
  const { start, end } = getWeekRange(weekOffset);
  return items.filter((item) => {
    const d = new Date(item.start_time);
    return d >= start && d <= end;
  });
}

export type WeekReservations = {
  parking: ParkingReservation[];
  office: OfficeReservation[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type Params = {
  weekOffset: number;
  userId?: string | null;
};

export function useWeekReservations({ weekOffset, userId }: Params): WeekReservations {
  const [parking, setParking] = useState<ParkingReservation[]>([]);
  const [office, setOffice] = useState<OfficeReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const socket = useSocket();

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    let parkingPromise: Promise<any>;
    let officePromise: Promise<any>;

    if (userId) {
      parkingPromise = Promise.resolve([]);
      officePromise = listOfficeReservations.getOfficeReservationsId(userId);
    } else {
      parkingPromise = listParkingReservations.getParkingReservationsMe();
      officePromise = listOfficeReservations.getOfficeReservationsMe();
    }

    Promise.allSettled([parkingPromise, officePromise]).then(([pResult, oResult]) => {
      if (cancelled) return;

      let parsedParking: ParkingReservation[] = [];
      let parsedOffice: OfficeReservation[] = [];

      if (pResult.status === "fulfilled") {
        parsedParking = filterByWeek(parseParkingMe(pResult.value), weekOffset);
      }

      if (oResult.status === "fulfilled") {
        parsedOffice = filterByWeek(parseOffice(oResult.value), weekOffset);
      } else {
        console.warn("Office fetch failed:", oResult.reason?.message);
      }

      setParking(parsedParking);
      setOffice(parsedOffice);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [weekOffset, userId, tick]);

  useEffect(() => {
    function onOfficeUpdate(msg: OfficeUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.checkedin" ||
        msg.type === "reservation.checkedout" ||
        msg.type === "reservation.noshow" ||
        msg.type === "reservation.attendance_updated"
      ) {
        refresh();
      }
    }

    socket.on("officeUpdate", onOfficeUpdate);
    return () => {
      socket.off("officeUpdate", onOfficeUpdate);
    };
  }, [socket, refresh]);

  useEffect(() => {
    function onParkingUpdate(msg: ParkingUpdateMessage) {
      if (
        msg.type === "reservation.created" ||
        msg.type === "reservation.canceled" ||
        msg.type === "reservation.attendance_updated" ||
        msg.type === "reservation.no_show"
      ) {
        refresh();
      }
    }

    socket.on("parkingUpdate", onParkingUpdate);
    return () => {
      socket.off("parkingUpdate", onParkingUpdate);
    };
  }, [socket, refresh]);

  return { parking, office, loading, error, refresh };
}
