"use client";

import { RefObject, useEffect } from "react";

type UseCloseOnOutsideClickParams<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  enabled: boolean;
  onClose: () => void;
};

export function useCloseOnOutsideClick<T extends HTMLElement>({
  ref,
  enabled,
  onClose,
}: UseCloseOnOutsideClickParams<T>) {
  useEffect(() => {
    if (!enabled) return;

    function handleMouseDown(event: MouseEvent) {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ref, enabled, onClose]);
}
