import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onClickOutside: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [enabled, onClickOutside, ref]);
}