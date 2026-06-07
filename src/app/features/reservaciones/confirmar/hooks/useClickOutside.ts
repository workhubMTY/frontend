import { RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onClickOutside();
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClickOutside, ref]);
}
