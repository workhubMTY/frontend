import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section className={cn(" bg-container", className)}>{children}</section>
  );
}
