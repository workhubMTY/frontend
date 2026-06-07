"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type SelectedSpace = {
  id: string;
  name: string;
};

export function useSelectedSpace() {
  const router = useRouter();
  const [selectedSpace, setSelectedSpace] = useState<SelectedSpace | null>(
    null,
  );

  useEffect(() => {
    const rawSelectedSpace = window.sessionStorage.getItem(
      "cubiculos:selectedSpace",
    );

    if (!rawSelectedSpace) {
      router.replace("/cubiculos");
      return;
    }

    try {
      const parsedSpace = JSON.parse(rawSelectedSpace) as SelectedSpace;

      if (!parsedSpace?.id) {
        router.replace("/cubiculos");
        return;
      }

      setSelectedSpace(parsedSpace);
    } catch {
      router.replace("/cubiculos");
    }
  }, [router]);

  return {
    selectedSpace,
    spaceId: selectedSpace?.id,
    spaceName: selectedSpace?.name ?? "Cubículo",
  };
}
