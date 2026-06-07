import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section className={cn("border border-grid-lines bg-container", className)}>
      {children}
    </section>
  );
}
