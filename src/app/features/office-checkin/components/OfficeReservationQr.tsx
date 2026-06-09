"use client";

import { ReservationQr } from "@/app/features/guard-checkin/components/ReservationQr";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

type OfficeReservationQrProps = {
  slotCode: string;
  size?: number;
};

export function OfficeReservationQr({ slotCode, size }: OfficeReservationQrProps) {
  const url = `${APP_BASE_URL}/cubiculos/reservacion/checkin/${encodeURIComponent(slotCode)}`;
  return <ReservationQr url={url} label={`Espacio ${slotCode}`} size={size} />;
}
