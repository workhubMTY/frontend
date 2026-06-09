"use client";

import { ReservationQr } from "./ReservationQr";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

type ParkingReservationQrProps = {
  reservationId: number;
  size?: number;
};

export function ParkingReservationQr({ reservationId, size }: ParkingReservationQrProps) {
  const url = `${APP_BASE_URL}/parking-checkin/${reservationId}`;
  return <ReservationQr url={url} size={size} />;
}
