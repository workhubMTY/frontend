"use client";

import { useState, useCallback, useRef } from "react";
import { createElement } from "react";
import { officeCheckinApi } from "../data/api";
import { OfficeCheckinSuccessContent } from "../components/OfficeCheckinSuccessContent";
import type {
  CheckinResult,
  OfficeEarlyCheckinResponse,
} from "@/app/features/guard-checkin/types";

export function useOfficeCheckin() {
  const [result, setResult] = useState<CheckinResult>({ status: "idle" });
  const processingRef = useRef(false);

  const reset = useCallback(() => {
    processingRef.current = false;
    setResult({ status: "idle" });
  }, []);

  const processSlot = useCallback(async (slotCode: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setResult({ status: "loading" });

    try {
      const { reservationId } = await officeCheckinApi.checkin(slotCode);

      const reservation = await officeCheckinApi.getReservation(reservationId);

      setResult({
        status: "success",
        successContent: createElement(OfficeCheckinSuccessContent, { reservation }),
        closeLabel: "Listo",
      });
    } catch (err: any) {
      processingRef.current = false;

      // 425 Too Early — server returns early-checkin payload
      if (err?.status === 425 || err?.message?.includes("425")) {
        try {
          const payload: OfficeEarlyCheckinResponse =
            typeof err.body.data === "object" ? err.body.data : JSON.parse(err.body.data ?? "{}");
          setResult({
            status: "early",
            message: "Aún no es posible realizar el check-in.",
            minutesUntil: payload.minutesUntilCheckinAvailable ?? 0,
            nextReservation: payload.nextReservation ?? null,
            todayReservations: payload.todayReservations ?? [],
          });
        } catch {
          setResult({
            status: "early",
            message: "Aún no es posible realizar el check-in.",
            minutesUntil: 0,
            nextReservation: null,
            todayReservations: [],
          });
        }
        return;
      }

      let message = "¡Ups! Ocurrió un error inesperado.";
      if (err.message?.includes("404") || err.message?.includes("Not Found"))
        message = "No se encontró una reservación activa para este espacio.";
      else if (err.message?.includes("409") || err.message?.includes("Conflict"))
        message = "No fue posible realizar el check-in debido al estado actual de la reservación.";

      setResult({ status: "error", message });
    }
  }, []);

  const parseQr = useCallback((raw: string): string | null => {
    const trimmed = raw.trim();
    // Full URL: http://localhost:3000/cubiculos/reservacion/checkin/MZ034
    const urlMatch = trimmed.match(/\/checkin\/([^/?#]+)/);
    if (urlMatch) return decodeURIComponent(urlMatch[1]);
    // Plain code: "MZ034"
    if (trimmed.length > 0 && !trimmed.includes(" ")) return trimmed;
    return null;
  }, []);

  const handleScan = useCallback(
    (raw: string) => {
      const code = parseQr(raw);
      if (code) processSlot(code);
    },
    [parseQr, processSlot]
  );

  return { result, processSlot, handleScan, reset };
}
