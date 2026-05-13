"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DownTransitionProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
}

export default function DownTransition({
  children,
  duration = 0.3,
  distance = 40,
}: DownTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -distance }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ height: "100%", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}