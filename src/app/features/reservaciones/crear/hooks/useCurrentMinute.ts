"use client";

import { useEffect, useState } from "react";

export function useCurrentMinute() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();

    const intervalId = window.setInterval(updateNow, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}