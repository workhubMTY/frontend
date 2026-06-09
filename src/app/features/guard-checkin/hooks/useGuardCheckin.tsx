"use client";

import { useState, useCallback, useRef } from "react";
import { guardCheckinApi } from "../data/api";
import type { CheckinResult } from "../types";

// Parking-specific success content — rendered inline as JSX
function buildParkingSuccessContent(parkingLotName: string | null) {
  return (
    <>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
        ¡Acceso registrado!
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {parkingLotName
          ? `El colaborador ha sido registrado correctamente en el estacionamiento ${parkingLotName}.`
          : "El colaborador ha sido registrado correctamente en el estacionamiento."}
      </p>
    </>
  );
}

function getValidationMessage(lifecycleStatus: string, attendanceStatus: string): string | null {
  if (lifecycleStatus === "CANCELED") return "La reserva ha sido cancelada.";
  if (lifecycleStatus === "FINALIZED") return "La reserva ha sido finalizada.";
  if (lifecycleStatus !== "ACTIVE") return "Estado de reserva inválido.";

  if (attendanceStatus === "CHECKED_IN") return "El colaborador ya realizó check-in.";
  if (attendanceStatus === "CHECKED_OUT") return "El colaborador ya realizó check-out.";
  if (attendanceStatus === "CANCELED") return "La reserva ha sido cancelada.";
  if (attendanceStatus === "NO_SHOW") return "El colaborador fue marcado como no presentado.";
  if (attendanceStatus !== "NOT_ARRIVED") return "Estado de asistencia inválido.";

  return null;
}

export function useGuardCheckin() {
  const [result, setResult] = useState<CheckinResult>({ status: "idle" });
  const processingRef = useRef(false);

  const reset = useCallback(() => {
    processingRef.current = false;
    setResult({ status: "idle" });
  }, []);

  const processReservation = useCallback(async (reservationId: number) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setResult({ status: "loading" });

    try {
      const detail = await guardCheckinApi.getReservation(reservationId);
      const { reservation, projection } = detail;

      const validationError = getValidationMessage(
        reservation.lifecycle_status,
        reservation.attendance_status
      );
      if (validationError) {
        setResult({ status: "invalid", message: validationError });
        processingRef.current = false;
        return;
      }

      await guardCheckinApi.checkin(reservationId);
      const parkingLotName = projection?.parking_lot?.name ?? null;

      setResult({
        status: "success",
        successContent: buildParkingSuccessContent(parkingLotName),
        closeLabel: "Escanear siguiente",
      });
    } catch (err: any) {
      let message = "¡Ups! Ocurrió un error inesperado.";
      if (err.message?.includes("404") || err.message?.includes("Not Found"))
        message = "No se encontró la reservación solicitada.";
      else if (err.message?.includes("409") || err.message?.includes("Conflict"))
        message = "No fue posible realizar el check-in debido al estado actual de la reservación.";

      setResult({ status: "error", message });
      processingRef.current = false;
    }
  }, []);

  // Parking QR: parse numeric id from URL or plain number
  const parseQr = useCallback((raw: string): number | null => {
    const trimmed = raw.trim();
    const urlMatch = trimmed.match(/\/parking-checkin\/(\d+)/);
    if (urlMatch) {
      const id = parseInt(urlMatch[1], 10);
      return isNaN(id) ? null : id;
    }
    const plain = parseInt(trimmed, 10);
    return !isNaN(plain) && String(plain) === trimmed ? plain : null;
  }, []);

  const handleScan = useCallback(
    (raw: string) => {
      const id = parseQr(raw);
      if (id !== null) processReservation(id);
    },
    [parseQr, processReservation]
  );

  return { result, processReservation, handleScan, reset };
}
